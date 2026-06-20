import type { VercelRequest, VercelResponse } from "@vercel/node";

function classifyGpa(score: number) {
  if (score >= 3.6) return { rank: "Xuất sắc", rank_en: "Excellent", emoji: "🏆" };
  if (score >= 3.2) return { rank: "Giỏi", rank_en: "Very Good", emoji: "🌟" };
  if (score >= 2.5) return { rank: "Khá", rank_en: "Good", emoji: "👍" };
  if (score >= 2.0) return { rank: "Trung bình", rank_en: "Average", emoji: "📘" };
  return { rank: "Yếu", rank_en: "Weak", emoji: "⚠️" };
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const raw = req.query.score as string;
  const score = Number(raw);
  if (raw === undefined || Number.isNaN(score) || score < 0 || score > 4) {
    return res.status(400).json({ error: "score phải là số từ 0 đến 4", error_en: "score must be a number between 0 and 4" });
  }

  return res.status(200).json({ score, scale: "4.0", ...classifyGpa(score) });
}
