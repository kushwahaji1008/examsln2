import { Link, Navigate } from "react-router-dom";
import {
  Sparkles,
  ShieldCheck,
  BookOpen,
  Rocket,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";

const features = [
  {
    title: "Smart Exam Management",
    description: "Access, schedule, and take exams securely from anywhere.",
    icon: BookOpen,
  },
  {
    title: "Live Progress Tracking",
    description: "Monitor your learning activity, attempts, and performance in real time.",
    icon: Rocket,
  },
  {
    title: "Personalized Experience",
    description: "A tailored learning journey designed for your success.",
    icon: ShieldCheck,
  },
];

const benefits = [
  {
    title: "Discover Courses",
    detail: "Browse a rich catalog of courses designed to elevate your skills and knowledge.",
    badge: "Learn faster",
    accent: "bg-primary/5 text-primary",
  },
  {
    title: "Prepare with Exams",
    detail: "Take practice and official exams with a seamless, distraction-free interface.",
    badge: "Perform better",
    accent: "bg-primary/5 text-primary",
  },
  {
    title: "Track Progress",
    detail: "Visualize your growth with detailed scorecards and performance analytics.",
    badge: "Achieve more",
    accent: "bg-primary/5 text-primary",
  },
];

export default function LandingPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/student" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <div className="relative overflow-hidden">
        <div className="absolute inset-x-0 -top-24 h-96 bg-primary/5 opacity-50 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-secondary-foreground ring-1 ring-border">
              <Sparkles className="h-4 w-4 text-primary" />
              Ready for exams that feel exciting and fair?
            </div>

            <h1 className="mt-8 max-w-4xl text-5xl font-medium tracking-tight sm:text-7xl text-foreground">
              Elevate your learning with a smarter platform.
            </h1>
            
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Access courses, take exams, and track your progress with a fast, beautiful interface designed to help you succeed.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row items-center justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-8 py-3.5 text-sm font-medium text-foreground transition hover:bg-secondary"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16 border-t border-border/50 mt-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-medium tracking-wider text-muted-foreground">WHAT MAKES IT MODERN</p>
            <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              A seamless learning experience.
            </h2>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              Enjoy a polished dashboard, fast workflows, and a responsive platform that looks great on every device, designed to keep you focused on your studies.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, idx) => (
              <div
                key={feature.title}
                className={`group rounded-2xl border border-border bg-card p-6 transition hover:shadow-sm ${idx === 2 ? 'sm:col-span-2' : ''}`}
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-medium text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24 sm:px-10 lg:px-16 mt-8">
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-8">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-medium tracking-wider text-muted-foreground">{item.title}</p>
                <h3 className="text-2xl font-medium text-foreground">{item.badge}</h3>
              </div>
              <p className="mt-4 text-muted-foreground leading-relaxed">{item.detail}</p>
              <div className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Easy onboarding and fast setup.
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
