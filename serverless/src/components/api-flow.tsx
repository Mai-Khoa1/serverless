import { motion } from "framer-motion";
import { MonitorSmartphone, Globe, Server, Database } from "lucide-react";

const steps = [
  { icon: MonitorSmartphone, label: "Client", sub: "Trình duyệt", color: "text-brand" },
  { icon: Globe, label: "Edge CDN", sub: "Mạng biên", color: "text-accent-cyan" },
  { icon: Server, label: "Serverless Fn", sub: "Hàm máy chủ", color: "text-accent-pink" },
  { icon: Database, label: "Response", sub: "Dữ liệu trả về", color: "text-accent-emerald" },
];

export function ApiFlow() {
  return (
    <div className="relative rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-2">
        <span className="size-2.5 animate-status-pulse rounded-full bg-accent-emerald" />
        <h2 className="font-display text-lg font-semibold sm:text-xl">
          Luồng xử lý API <span className="text-muted-foreground">— Request Lifecycle</span>
        </h2>
      </div>

      <div className="relative">
        {/* connecting line */}
        <div className="absolute left-0 right-0 top-7 hidden h-1 overflow-hidden rounded-full bg-secondary sm:block">
          <motion.div
            className="absolute top-0 h-1 w-24 rounded-full bg-gradient-to-r from-brand via-accent-pink to-accent-emerald"
            animate={{ left: ["-10%", "100%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              className="flex flex-col items-center gap-2 text-center"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              <motion.div
                className="relative z-10 flex size-14 items-center justify-center rounded-2xl border border-border bg-background shadow-sm"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.4 }}
              >
                <step.icon className={`size-6 ${step.color}`} />
              </motion.div>
              <div>
                <p className="font-display text-sm font-semibold">{step.label}</p>
                <p className="text-xs text-muted-foreground">{step.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}