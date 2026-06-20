import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return res.status(200).json({
    status: "online",
    message: "Serverless Student API đang hoạt động",
    message_en: "Serverless Student API is up and running",
    runtime: "Node.js (Vercel Serverless)",
    timestamp: new Date().toISOString(),
  });
}
