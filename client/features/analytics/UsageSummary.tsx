import { useEffect, useState } from "react";
import { health, getJSON } from "@/services/api-client";

export default function UsageSummary() {
  const [data, setData] = useState<{ queries: number; suggestions: number; accepted: number; rejected: number } | null>(null);
  const [online, setOnline] = useState<boolean | null>(null);

  async function load() {
    if (!(await health())) { setOnline(false); return; }
    setOnline(true);
    const json = await getJSON<{ queries: number; suggestions: number; accepted: number; rejected: number }>("/api/analytics/summary");
    if (json) setData(json); else setData((d) => d ?? { queries: 0, suggestions: 0, accepted: 0, rejected: 0 });
  }
  useEffect(() => {
    load();
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
  }, []);

  function toCSV() {
    if (!data) return;
    const rows = [ ["queries","suggestions","accepted","rejected"], [data.queries, data.suggestions, data.accepted, data.rejected] ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `usage-${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
  }

  function toPDF() {
    const w = window.open("", "print");
    if (!w || !data) return;
    w.document.write(`<h1>Usage Report</h1><p>Queries: ${data.queries}</p><p>Suggestions: ${data.suggestions}</p><p>Accepted: ${data.accepted}</p><p>Rejected: ${data.rejected}</p>`);
    w.document.close();
    w.focus();
    w.print();
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Analytics</h3>
        <div className="flex gap-2">
          <button onClick={toCSV} className="rounded-md border px-3 py-1">CSV</button>
          <button onClick={toPDF} className="rounded-md border px-3 py-1">PDF</button>
        </div>
      </div>
      {!data ? (
        <p className="text-sm text-foreground/60 mt-2">Loading…</p>
      ) : (
        <div className="grid grid-cols-4 gap-2 text-center mt-3">
          <Stat label="Queries" value={data.queries} />
          <Stat label="Suggestions" value={data.suggestions} />
          <Stat label="Accepted" value={data.accepted} />
          <Stat label="Rejected" value={data.rejected} />
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border p-3 bg-secondary/30">
      <div className="text-xs text-foreground/70">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
