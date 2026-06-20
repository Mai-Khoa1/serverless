import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { HeartPulse, Users, IdCard, TrendingUp, UserPlus, Cloud, Code2, Network, Cpu } from "lucide-react";
import { StatCards } from "@/components/stat-cards";
import { ApiFlow } from "@/components/api-flow";
import { EndpointCard, type EndpointCardProps } from "@/components/endpoint-card";
import heroImg from "@/assets/hero-serverless.jpg";
import bannerStudents from "@/assets/banner-students.jpg";
import bannerData from "@/assets/banner-data.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Serverless Student API — Demo API Sinh Viên" },
      {
        name: "description",
        content:
          "Trang demo REST API quản lý sinh viên chạy trên kiến trúc serverless. Health check, danh sách sinh viên, tra cứu theo ID, phân loại GPA và thêm sinh viên mới.",
      },
      { property: "og:title", content: "Serverless Student API — Demo API Sinh Viên" },
      {
        property: "og:description",
        content: "Event-Driven REST API trên kiến trúc serverless (FaaS). Thử nghiệm trực tiếp 5 endpoint ngay trên trang.",
      },
    ],
  }),
  component: Index,
});

const badges = [
  { icon: Cpu, label: "Node.js Runtime" },
  { icon: Code2, label: "JavaScript" },
  { icon: Cloud, label: "Containerized" },
  { icon: Network, label: "Edge Network" },
];

const endpoints: EndpointCardProps[] = [
  {
    index: 1,
    method: "GET",
    accent: "emerald",
    icon: HeartPulse,
    titleEn: "Health Check",
    titleVi: "Kiểm tra hệ thống",
    kind: "simple",
    staticPath: "/api/health",
  },
  {
    index: 2,
    method: "GET",
    accent: "brand",
    icon: Users,
    titleEn: "Get All Students",
    titleVi: "Lấy danh sách sinh viên",
    kind: "simple",
    staticPath: "/api/students",
    banner: bannerStudents,
  },
  {
    index: 3,
    method: "GET",
    accent: "cyan",
    icon: IdCard,
    titleEn: "Get Student by ID",
    titleVi: "Tìm sinh viên theo ID",
    kind: "id",
  },
  {
    index: 4,
    method: "GET",
    accent: "amber",
    icon: TrendingUp,
    titleEn: "GPA Classifier",
    titleVi: "Phân loại học lực",
    kind: "gpa",
    banner: bannerData,
  },
  {
    index: 5,
    method: "POST",
    accent: "pink",
    icon: UserPlus,
    titleEn: "Add Student",
    titleVi: "Thêm sinh viên mới",
    kind: "post",
    staticPath: "/api/students",
  },
];

const techChips = [
  { icon: Cloud, label: "Serverless" },
  { icon: Cpu, label: "Node.js" },
  { icon: Code2, label: "JavaScript" },
  { icon: Network, label: "REST API" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <header className="relative overflow-hidden bg-brand text-brand-foreground">
        <div className="absolute inset-0 animate-gradient-pan bg-gradient-to-br from-brand via-accent-pink to-accent-amber opacity-90" />
        <div className="absolute -right-20 -top-24 size-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-24 right-40 size-56 rounded-full bg-white/10 blur-2xl" />
        <div className="relative mx-auto grid max-w-5xl items-center gap-8 px-5 py-14 sm:py-16 md:grid-cols-[1.2fr_1fr]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <span className="size-2 animate-status-pulse rounded-full bg-accent-emerald" />
              Event-Driven REST API · FaaS
            </div>
            <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Serverless Student API
            </h1>
            <p className="mt-3 max-w-md text-base text-white/80 sm:text-lg">
              API quản lý sinh viên chạy trên kiến trúc serverless — thử trực tiếp 5 endpoint ngay trên trang này.
              <span className="mt-1 block text-sm text-white/60">
                A serverless REST API for students. Try all 5 endpoints right here.
              </span>
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {badges.map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur"
                >
                  <b.icon className="size-3.5" />
                  {b.label}
                </span>
              ))}
            </div>
          </motion.div>
          <motion.img
            src={heroImg}
            alt="Minh họa kiến trúc serverless nhiều màu sắc"
            width={1280}
            height={960}
            className="mx-auto w-full max-w-sm animate-float-soft drop-shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          />
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-5 py-10">
        <StatCards />
        <ApiFlow />

        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-brand to-accent-pink" />
            <h2 className="font-display text-xl font-bold sm:text-2xl">
              Các Endpoint <span className="text-muted-foreground">— API Playground</span>
            </h2>
          </div>
          <div className="grid gap-5">
            {endpoints.map((e) => (
              <EndpointCard key={e.index} {...e} />
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="flex flex-wrap items-center justify-center gap-3 pt-4">
          {techChips.map((t) => (
            <span
              key={t.label}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm"
            >
              <t.icon className="size-4 text-brand" />
              {t.label}
            </span>
          ))}
        </footer>
        <p className="pb-6 text-center text-xs text-muted-foreground">
          Built with TanStack Start · Serverless Functions · {new Date().getFullYear()}
        </p>
      </main>
    </div>
  );
}
