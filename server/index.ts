import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { signup, login, me, logout, listUsers, updateRole } from "./routes/auth";
import { listSnippets, createSnippet } from "./routes/snippets";
import { listTemplates, createTemplate, updateTemplate } from "./routes/knowledge";
import { chat } from "./routes/chat";
import { track, summary } from "./routes/metrics";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Healthcheck
  app.get("/health", (_req, res) => res.json({ ok: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth
  app.post("/api/auth/signup", signup);
  app.post("/api/auth/login", login);
  app.post("/api/auth/logout", logout);
  app.get("/api/auth/me", me);
  app.get("/api/users", listUsers);
  app.post("/api/users/role", updateRole);

  // Snippets
  app.get("/api/snippets", listSnippets);
  app.post("/api/snippets", createSnippet);

  // Knowledge
  app.get("/api/knowledge", listTemplates);
  app.post("/api/knowledge", createTemplate);
  app.put("/api/knowledge/:id", updateTemplate);

  // Chatbot
  app.post("/api/chat", chat);

  // Analytics
  app.post("/api/analytics/track", track);
  app.get("/api/analytics/summary", summary);

  return app;
}
