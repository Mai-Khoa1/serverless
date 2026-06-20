import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Activity, HardDrive, Zap } from "lucide-react";

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export function StatCards() {
  const endpoints = useCountUp(5);
  const latency = useCountUp(40);

  const cards = [
    {
      icon: Activity,
      label: "Trạng thái",
      labelEn: "Status",
      value: (
        <span className="flex items-center gap-2">
          <span className="size-2.5 animate-status-pulse rounded-full bg-accent-emerald" />
          Online
        </span>
      ),
      accent: "text-accent-emerald",
    },
    { icon: HardDrive, label: "Endpoints", labelEn: "Số endpoint", value: endpoints, accent: "text-brand" },
    { icon: Zap, label: "Độ trễ", labelEn: "Avg Latency", value: `~${latency}ms`, accent: "text-accent-amber" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <c.icon className={`size-4 ${c.accent}`} />
            <span>
              {c.label} <span className="opacity-60">· {c.labelEn}</span>
            </span>
          </div>
          <div className="font-display text-2xl font-bold sm:text-3xl">{c.value}</div>
        </motion.div>
      ))}
    </div>
  );
}