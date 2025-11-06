"use client";

import useSWR from "swr";
import { useState, useCallback } from "react";
import { fetcher } from "../../../../lib/axios";
import PaperCard from "./PaperCard";

export default function UsersPanel() {
  const { data, mutate, error, isLoading } = useSWR("/admin/users", fetcher);
  const [updating, setUpdating] = useState(null);

  const setRole = useCallback(async (userId, role) => {
    try {
      setUpdating(userId);
      await api.patch("/admin/users", { userId, role });
      await mutate();
    } catch (err) {
      console.error("Failed to update role:", err);
      alert("Failed to update user role");
    } finally {
      setUpdating(null);
    }
  }, [mutate]);

  const toggleActive = useCallback(async (userId, active) => {
    try {
      setUpdating(userId);
      await api.patch("/admin/users", { userId, active });
      await mutate();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update user status");
    } finally {
      setUpdating(null);
    }
  }, [mutate]);

  if (error) {
    return (
      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
        <h2 className="text-lg font-semibold text-slate-900">User Management</h2>
        <p className="mt-4 text-sm text-red-600">Failed to load users</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">User Management</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {Array.isArray(data) ? data.length : 0} users
        </span>
      </div>
      <div className="mt-6 space-y-3 max-h-96 overflow-y-auto pr-2">
        {isLoading ? (
          <LoadingState />
        ) : Array.isArray(data) && data.length > 0 ? (
          data.map((user) => (
            <PaperCard
              key={user.id}
              user={user}
              updating={updating === user.id}
              onSetRole={setRole}
              onToggleActive={toggleActive}
            />
          ))
        ) : (
          <EmptyState message="No users found" />
        )}
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
      <p className="mt-3 text-sm text-slate-500">Loading users...</p>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="py-12 text-center">
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}
