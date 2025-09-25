import { useEffect, useState } from "react";
import { RoleGate } from "@/services/role-based-access";
import { useAuth } from "@/services/auth-context";
import { health, getJSON } from "@/services/api-client";

interface Template { id: string; title: string; content: string; category: string; tags: string[]; updatedAt: number }

export default function KnowledgeHubPanel() {
  const { token } = useAuth();
  const [items, setItems] = useState<Template[]>([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [form, setForm] = useState({ title: "", content: "", category: "frontend", tags: "" });

  const [online, setOnline] = useState<boolean | null>(null);

  async function load() {
    if (!(await health())) { setOnline(false); return; }
    setOnline(true);
    const data = await getJSON<{ templates: Template[] }>(`/api/knowledge?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}`);
    if (data) setItems(data.templates);
  }
  useEffect(() => { load(); }, [q, category]);

  async function create() {
    const headers: any = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch("/api/knowledge", { method: "POST", headers, body: JSON.stringify({ ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) }) });
    if (res.ok) { setForm({ title: "", content: "", category: "frontend", tags: "" }); load(); }
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h3 className="font-semibold">Knowledge Hub</h3>
          <p className="text-sm text-foreground/70">Guidelines & templates with categories and tags.</p>
        </div>
        <div className="flex gap-2">
          <input className="rounded-md border px-3 py-2 w-48" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="rounded-md border px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            <option>frontend</option><option>backend</option><option>devops</option>
          </select>
        </div>
      </div>
      {online === false && <p className="text-sm text-foreground/60 mt-3">Backend offline. Retrying…</p>}
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="space-y-3 max-h-64 overflow-auto">
          {items.map((t) => (
            <div key={t.id} className="rounded-md border p-3 bg-secondary/30">
              <div className="text-sm font-semibold">{t.title} <span className="uppercase text-xs text-foreground/60">{t.category}</span></div>
              <p className="text-sm text-foreground/80">{t.content}</p>
              <div className="text-xs text-foreground/60 mt-1">{t.tags.join(", ")}</div>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-foreground/60">No templates yet.</p>}
        </div>
        <RoleGate roles={["Admin"]}>
          <div className="space-y-2">
            <div className="text-sm font-semibold">Admin: Add Template</div>
            <input className="w-full rounded-md border px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <textarea className="w-full h-24 rounded-md border p-2" placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            <div className="flex gap-2">
              <select className="rounded-md border px-3 py-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option>frontend</option><option>backend</option><option>devops</option>
              </select>
              <input className="flex-1 rounded-md border px-3 py-2" placeholder="tags (comma)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              <button onClick={create} className="rounded-md bg-primary text-primary-foreground px-3">Add</button>
            </div>
          </div>
        </RoleGate>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold mb-3">Practice on coding platforms</h4>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: "LeetCode", url: "https://leetcode.com/" },
            { name: "HackerRank", url: "https://www.hackerrank.com/" },
            { name: "CodeSignal", url: "https://codesignal.com/" },
            { name: "Codeforces", url: "https://codeforces.com/" },
            { name: "Exercism", url: "https://exercism.org/" },
            { name: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/" },
            { name: "InterviewBit", url: "https://www.interviewbit.com/" },
          ].map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-foreground/70 break-all">{p.url}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
