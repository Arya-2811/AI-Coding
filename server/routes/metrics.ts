import { RequestHandler } from "express";

const counters: Record<string, number> = {
  queries: 0,
  suggestions: 0,
  accepted: 0,
  rejected: 0,
};

export function trackEvent(type: keyof typeof counters) {
  counters[type] = (counters[type] || 0) + 1;
}

export const track: RequestHandler = (req, res) => {
  const { type } = req.body as { type?: keyof typeof counters };
  if (!type || !(type in counters)) return res.status(400).json({ error: "Invalid type" });
  trackEvent(type);
  res.json({ ok: true });
};

export const summary: RequestHandler = (_req, res) => {
  res.json({ ...counters });
};
