import { createFileRoute } from "@tanstack/react-router";
import { classifyGpa } from "@/lib/students-data";

export const Route = createFileRoute("/api/gpa")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const raw = url.searchParams.get("score");
        const score = Number(raw);
        if (raw === null || Number.isNaN(score) || score < 0 || score > 4) {
          return Response.json(
            { error: "score phải là số từ 0 đến 4", error_en: "score must be a number between 0 and 4" },
            { status: 400 },
          );
        }
        const result = classifyGpa(score);
        return Response.json({ score, scale: "4.0", ...result });
      },
    },
  },
});