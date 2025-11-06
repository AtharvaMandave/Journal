'use client'
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardBody, Input, Label, Button } from "../../components/ui";
import { getSupabaseClient } from "../../../lib/supabase";
export default function SubmitPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 sm:p-20">
      <h1 className="text-2xl font-semibold text-gray-900">Submit a Paper</h1>
      <Card className="mt-6 max-w-3xl">
        <CardBody>
          <Form />
        </CardBody>
      </Card>
    </main>
  );
}

function TagInput({ value, onChange, placeholder }) {
  const [input, setInput] = useState("");
  function addTag() {
    const t = input.trim();
    if (!t) return;
    onChange([...value, t]);
    setInput("");
  }
  function removeTag(idx) {
    const next = [...value];
    next.splice(idx, 1);
    onChange(next);
  }
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {value.map((k, i) => (
          <span key={i} className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm">
            {k}
            <button type="button" className="ml-2" onClick={() => removeTag(i)}>×</button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
        />
        <Button type="button" onClick={addTag} variant="outline">Add</Button>
      </div>
    </div>
  );
}

function CoAuthors({ value, onChange }) {
  const [author, setAuthor] = useState({ name: "", email: "", affiliation: "" });
  function add() {
    if (!author.name || !author.email) return;
    onChange([...value, author]);
    setAuthor({ name: "", email: "", affiliation: "" });
  }
  function remove(idx) {
    const next = [...value];
    next.splice(idx, 1);
    onChange(next);
  }
  return (
    <div>
      <ul className="space-y-2">
        {value.map((a, i) => (
          <li key={i} className="flex items-center justify-between rounded border p-2 text-sm">
            <span>{a.name} – {a.email}{a.affiliation ? `, ${a.affiliation}` : ""}</span>
            <button type="button" className="text-red-600" onClick={() => remove(i)}>Remove</button>
          </li>
        ))}
      </ul>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <Input placeholder="Name" value={author.name} onChange={(e) => setAuthor({ ...author, name: e.target.value })} />
        <Input placeholder="Email" value={author.email} onChange={(e) => setAuthor({ ...author, email: e.target.value })} />
        <Input placeholder="Affiliation (optional)" value={author.affiliation} onChange={(e) => setAuthor({ ...author, affiliation: e.target.value })} />
      </div>
      <Button type="button" onClick={add} variant="outline" className="mt-2">Add Co-author</Button>
    </div>
  );
}

function Form() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [coAuthors, setCoAuthors] = useState([]);
  const [file, setFile] = useState(null);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    if (!file) {
      setMessage("A PDF file is required for submission.");
      setLoading(false);
      return;
    }
    if (!agree) {
      setMessage("You must agree to the terms");
      return;
    }
    setLoading(true);

    // If using Supabase Storage, upload client-side and pass public URL to API
    let uploadUrl = null;
    let fileUrl = null;
    const currentUserEmail = session?.user?.email || "";
    const currentUserName = session?.user?.name || (currentUserEmail ? currentUserEmail.split('@')[0] : "");
    const authors = [
      { name: currentUserName, email: currentUserEmail, affiliation: "" },
      ...coAuthors,
    ];
    try {
      if (file) {
        const supabase = getSupabaseClient();
        const path = `papers/${currentUserEmail}/${Date.now()}-${file.name}`;
        const { error: upErr } = await supabase.storage.from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET).upload(path, file, { upsert: false, contentType: file.type });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET).getPublicUrl(path);
        fileUrl = pub.publicUrl;
      }
      const res = await fetch("/api/papers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          abstract,
          keywords,
          authors,
          correspondingAuthorEmail: currentUserEmail,
          fileUrl: fileUrl || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Submission failed");
      if (data.id) {
        setMessage("Submission received");
        setLoading(false);
        return;
      }
    } catch (err) {
      setLoading(false);
      setMessage(err.message);
      return;
    }

    // Step 2: upload file directly to S3 via presigned URL
    if (uploadUrl && file) {
      const put = await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!put.ok) {
        setLoading(false);
        setMessage("Upload to storage failed");
        return;
      }
      
      const res2 = await fetch("/api/papers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          abstract,
          keywords,
          authors,
          correspondingAuthorEmail: currentUserEmail,
          fileUrl,
        }),
      });
      const data2 = await res2.json();
      if (!res2.ok) {
        setLoading(false);
        setMessage(data2?.error || "Failed to create record");
        return;
      }
      setLoading(false);
      setMessage("Submission received");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea className="w-full rounded-2xl border px-3 py-2 text-gray-900" rows={6} placeholder="Abstract" value={abstract} onChange={(e) => setAbstract(e.target.value)} required />
      <div>
        <Label>Keywords</Label>
        <TagInput value={keywords} onChange={setKeywords} placeholder="Add a keyword" />
      </div>
      <div>
        <Label>Co-authors</Label>
        <CoAuthors value={coAuthors} onChange={setCoAuthors} />
      </div>
      <div className="text-black">
        <input aria-label="Upload PDF" type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input className="text-black" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <p className="text-black">I agree to the submission terms</p>
      </label>
      {message ? <p className="text-sm text-black">{message}</p> : null}
      <Button disabled={loading} type="submit" className="w-full">
        {loading ? "Submitting..." : "Submit Paper"}
      </Button>
    </form>
  );
}


