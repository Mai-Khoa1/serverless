import { useState, type ComponentType } from "react";
import { motion } from "framer-motion";
import { Play, Send, Loader2 } from "lucide-react";

type Accent = "brand" | "pink" | "amber" | "emerald" | "cyan";

const accentMap: Record<Accent, { text: string; bg: string; soft: string; ring: string }> = {
  brand: { text: "text-brand", bg: "bg-brand", soft: "bg-brand/10", ring: "border-brand/30" },
  pink: { text: "text-accent-pink", bg: "bg-accent-pink", soft: "bg-accent-pink/10", ring: "border-accent-pink/30" },
  amber: { text: "text-accent-amber", bg: "bg-accent-amber", soft: "bg-accent-amber/10", ring: "border-accent-amber/30" },
  emerald: { text: "text-accent-emerald", bg: "bg-accent-emerald", soft: "bg-accent-emerald/10", ring: "border-accent-emerald/30" },
  cyan: { text: "text-accent-cyan", bg: "bg-accent-cyan", soft: "bg-accent-cyan/10", ring: "border-accent-cyan/30" },
};

export type EndpointCardProps = {
  index: number;
  method: "GET" | "POST";
  accent: Accent;
  icon: ComponentType<{ className?: string }>;
  titleVi: string;
  titleEn: string;
  banner?: string;
  kind: "simple" | "id" | "gpa" | "post";
  staticPath?: string;
};

const defaultBody = `{
  "name": "Nguyễn Cloud Computing",
  "email": "cloud@university.edu.vn",
  "major": "Điện toán đám mây",
  "gpa": 3.8,
  "year": 3
}`;

export function EndpointCard(props: EndpointCardProps) {
  const { index, method, accent, icon: Icon, titleVi, titleEn, banner, kind, staticPath } = props;
  const a = accentMap[accent];

  const [idValue, setIdValue] = useState("1");
  const [gpaValue, setGpaValue] = useState("3.6");
  const [body, setBody] = useState(defaultBody);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ status: number; ms: number; data: unknown } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentPath =
    kind === "id"
      ? `/api/students?id=${idValue}`
      : kind === "gpa"
        ? `/api/gpa?score=${gpaValue}`
        : (staticPath ?? "/api/health");

  async function run() {
    setError(null);
    setLoading(true);
    setResponse(null);
    try {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY ?? "",
        },
      };
      if (kind === "post") {
        try {
          options.body = JSON.stringify(JSON.parse(body));
        } catch {
          setError("JSON không hợp lệ · Invalid JSON");
          setLoading(false);
          return;
        }
      }
      const start = Date.now();
      const res = await fetch(currentPath, options);
      const ms = Date.now() - start;
      const data = await res.json();
      setResponse({ status: res.status, ms, data });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  }

  const ok = response && response.status >= 200 && response.status < 300;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
      className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      {banner && (
        <div className="relative h-24 w-full overflow-hidden">
          <img src={banner} alt="" loading="lazy" className="size-full object-cover" width={1280} height={512} />
          <div className={`absolute inset-0 ${a.bg} opacity-20 mix-blend-multiply`} />
        </div>
      )}
      <div className="p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className={`flex size-10 items-center justify-center rounded-xl ${a.soft}`}>
            <Icon className={`size-5 ${a.text}`} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Endpoint {index}</p>
            <h3 className="font-display text-base font-semibold sm:text-lg">
              {titleEn} <span className="font-normal text-muted-foreground">— {titleVi}</span>
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-lg px-3 py-1.5 font-display text-xs font-bold ${
              method === "GET" ? "bg-accent-emerald/15 text-accent-emerald" : "bg-brand/15 text-brand"
            }`}
          >
            {method}
          </span>
          <code className={`flex-1 truncate rounded-xl border ${a.ring} bg-secondary px-3 py-2 font-mono text-sm ${a.text}`}>
            {currentPath}
          </code>
          <button
            onClick={run}
            disabled={loading}
            className={`inline-flex items-center gap-2 rounded-xl ${a.bg} px-4 py-2 font-medium text-white shadow-sm transition-transform hover:scale-105 active:scale-95 disabled:opacity-60`}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : method === "POST" ? (
              <Send className="size-4" />
            ) : (
              <Play className="size-4" />
            )}
            {method === "POST" ? "Gửi" : "Chạy"}
          </button>
        </div>

        {kind === "id" && (
          <div className="mt-3 flex items-center gap-2">
            <label className="text-sm text-muted-foreground">ID sinh viên:</label>
            <input
              type="number"
              value={idValue}
              onChange={(e) => setIdValue(e.target.value)}
              className="w-24 rounded-xl border border-border bg-secondary px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
        )}

        {kind === "gpa" && (
          <div className="mt-3 flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Điểm GPA (0–4):</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="4"
              value={gpaValue}
              onChange={(e) => setGpaValue(e.target.value)}
              className="w-24 rounded-xl border border-border bg-secondary px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
        )}

        {kind === "post" && (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            spellCheck={false}
            className="mt-3 min-h-32 w-full rounded-xl border border-border bg-secondary px-3 py-3 font-mono text-xs outline-none focus:border-brand"
          />
        )}

        {(response || error) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 overflow-hidden rounded-xl bg-foreground p-4 font-mono text-xs text-background"
          >
            {error ? (
              <p className="text-accent-pink">❌ {error}</p>
            ) : response ? (
              <>
                <p className="mb-2 flex items-center gap-2 text-[11px] opacity-70">
                  <span className={`size-2 rounded-full ${ok ? "bg-accent-emerald" : "bg-accent-pink"}`} />
                  Status: {response.status} · {response.ms}ms
                </p>
                <pre className={`whitespace-pre-wrap break-words ${ok ? "text-accent-emerald" : "text-accent-pink"}`}>
                  {JSON.stringify(response.data, null, 2)}
                </pre>
              </>
            ) : null}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}