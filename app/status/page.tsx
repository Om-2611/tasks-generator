"use client";

import { useEffect, useState } from "react";

export default function StatusPage() {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => setStatus(data));
  }, []);

  if (!status) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold">System Status</h1>
        <p className="mt-4">Checking system health...</p>
      </main>
    );
  }

  const renderStatus = (value: boolean) =>
    value ? "✅ Healthy" : "❌ Not Connected";

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">System Status</h1>

      <div className="space-y-4 text-lg">
        <div className="flex justify-between border p-4 rounded">
          <span>Backend</span>
          <span>{renderStatus(status.backend)}</span>
        </div>

        <div className="flex justify-between border p-4 rounded">
          <span>Database (Supabase)</span>
          <span>{renderStatus(status.database)}</span>
        </div>

        <div className="flex justify-between border p-4 rounded">
          <span>LLM (OpenRouter)</span>
          <span>{renderStatus(status.llm)}</span>
        </div>
      </div>
    </main>
  );
}
