"use client";

import { useState, useRef } from "react";
import { Card, CardBody, Input, Label, Button } from "../../components/ui";

export default function CertificatesPage() {
  const [email, setEmail] = useState("");
  const [paperId, setPaperId] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const printRef = useRef(null);

  async function fetchCert(e) {
    e.preventDefault();
    setError("");
    setData(null);
    const res = await fetch("/api/public/certificate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, paperId }) });
    const j = await res.json();
    if (!res.ok) { setError(j.error || "Not available"); return; }
    setData(j);
  }

  function printCertificate() {
    if (!printRef.current) return;
    const html = printRef.current.innerHTML;
    const w = window.open("", "print");
    w.document.write(`<html><head><title>Certificate</title><style>body{font-family:Arial;padding:40px} .cert{border:8px double #111;border-radius:20px;padding:32px} h2{margin:0 0 8px} .muted{color:#555}</style></head><body>${html}</body></html>`);
    w.document.close(); w.focus(); w.print(); w.close();
  }

  return (
    <main className="p-8 sm:p-20">
      <h1 className="text-2xl font-semibold">Download Certificate</h1>
      <Card className="mt-6 max-w-2xl">
        <CardBody>
          <form onSubmit={fetchCert} className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            <div className="sm:col-span-1"><Label>Paper ID</Label><Input value={paperId} onChange={(e) => setPaperId(e.target.value)} required /></div>
            <div className="sm:col-span-1 flex items-end"><Button className="w-full">Fetch</Button></div>
          </form>
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

          {data ? (
            <div className="mt-8">
              <div ref={printRef} className="cert">
                <h2>Certificate of Publication</h2>
                <p className="muted">This certifies that</p>
                <p><strong>{data.author.name}</strong> ({data.author.affiliation})</p>
                <p className="muted">has published the paper</p>
                <p><strong>{data.paper.title}</strong></p>
                {data.issue ? (
                  <p className="muted">in Volume {data.issue.volume}, Issue {data.issue.issueNumber} ({data.issue.year})</p>
                ) : null}
                <p className="muted">Paper ID: {data.paper.id}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={printCertificate}>Print / Save PDF</Button>
                {data.paper.fileUrl ? <a className="inline-flex items-center rounded-2xl border px-4 py-2 text-sm" href={data.paper.fileUrl} target="_blank" rel="noreferrer">Download Paper</a> : null}
              </div>
            </div>
          ) : null}
        </CardBody>
      </Card>
    </main>
  );
}


