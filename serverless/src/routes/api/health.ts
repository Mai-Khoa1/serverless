import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () =>
        Response.json({
          status: "online",
          message: "Serverless Student API đang hoạt động",
          message_en: "Serverless Student API is up and running",
          runtime: "Node.js (Edge)",
          uptime: `${Math.floor(process.uptime?.() ?? 0)}s`,
          timestamp: new Date().toISOString(),
        }),
    },
  },
});