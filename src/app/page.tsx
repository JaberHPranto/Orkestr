'use client";';
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const FEATURES = [
  {
    title: "Type-Safe by Default",
    description:
      "Full TypeScript support with strict mode enabled. Catch errors at compile time, not in production.",
    icon: "🔒",
  },
  {
    title: "Lightning Fast",
    description:
      "Built on Next.js 16 with React 19, Turbopack, and the App Router. Ships only what you need.",
    icon: "⚡",
  },
  {
    title: "Code Quality Built In",
    description:
      "Ultracite (Biome), Knip, commitlint, and Lefthook all pre-configured and ready from day one.",
    icon: "✅",
  },
  {
    title: "Modern Styling",
    description:
      "Tailwind CSS v4 with shadcn/ui components and tw-animate-css for polished, accessible UIs.",
    icon: "🎨",
  },
  {
    title: "CI Ready",
    description:
      "GitHub Actions workflow with lint, typecheck, knip, commitlint, and build steps out of the box.",
    icon: "🚀",
  },
  {
    title: "Zero Config Needed",
    description:
      "Clone, install, and start building. Every tool is wired together so you don't have to be.",
    icon: "📦",
  },
] as const;

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Skip to main content — accessibility */}
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none"
        href="#main-content"
      >
        Skip to Main Content
      </a>

      {/* ── Nav ── */}
      <header className="sticky top-0 z-40 border-foreground/10 border-b bg-background/80 backdrop-blur-sm">
        <nav
          aria-label="Primary navigation"
          className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6"
        >
          <a
            className="flex items-center gap-2 rounded-sm font-semibold text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            href="/"
          >
            <Image
              alt=""
              aria-hidden="true"
              className="dark:invert"
              height={16}
              priority
              src="/next.svg"
              width={80}
            />
          </a>
          <div className="flex items-center gap-2">
            <a
              className={buttonVariants({ variant: "ghost", size: "lg" })}
              href="https://github.com/JaberHPranto/nextjs-boilerplate"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </a>
            <Button size="lg">Get Started</Button>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <main id="main-content">
        <section
          aria-labelledby="hero-heading"
          className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-24 text-center"
        >
          <span className="inline-flex items-center rounded-full border border-foreground/15 bg-muted px-3 py-1 font-medium text-muted-foreground text-xs">
            Next.js 16 · React 19 · Tailwind v4
          </span>
          <h1
            className="max-w-2xl text-balance font-semibold text-4xl tracking-tight sm:text-5xl"
            id="hero-heading"
          >
            The Modern Next.js Boilerplate
          </h1>
          <p className="max-w-xl text-pretty text-base text-muted-foreground leading-relaxed sm:text-lg">
            Everything configured, nothing in your way. Start shipping features
            from minute one — not after hours of tooling setup.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button className={"px-4 py-5"}>
              <a
                href="https://github.com/JaberHPranto/nextjs-boilerplate"
                rel="noopener noreferrer"
                target="_blank"
              >
                Clone the Repo
              </a>
            </Button>
            <Button className={"px-4 py-5"} variant="outline">
              <a href="#features">Browse Features</a>
            </Button>
          </div>
        </section>

        {/* ── Features ── */}
        <section
          aria-labelledby="features-heading"
          className="mx-auto max-w-5xl px-6 pb-24"
          id="features"
          style={{ scrollMarginTop: "4rem" }}
        >
          <h2
            className="mb-2 text-balance text-center font-semibold text-2xl tracking-tight"
            id="features-heading"
          >
            Everything You Need
          </h2>
          <p className="mb-10 text-center text-muted-foreground text-sm">
            A carefully curated stack — no bloat, no compromises.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <li key={feature.title}>
                <Card className="h-full transition-shadow duration-200 hover:ring-foreground/20">
                  <CardHeader>
                    <div aria-hidden="true" className="mb-1 text-2xl">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Newsletter ── */}
        <section
          aria-labelledby="newsletter-heading"
          className="border-foreground/10 border-t bg-muted/40"
        >
          <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-6 py-20 text-center">
            <h2
              className="text-balance font-semibold text-2xl tracking-tight"
              id="newsletter-heading"
            >
              Stay in the Loop
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Get notified about updates, new features, and releases. No spam —
              unsubscribe any time.
            </p>
            <form
              aria-label="Newsletter sign-up"
              className="flex w-full max-w-sm flex-col gap-3 sm:flex-row"
              noValidate
              // onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex flex-1 flex-col gap-1">
                <label className="sr-only" htmlFor="email-input">
                  Email address
                </label>
                <Input
                  autoComplete="email"
                  className="h-9 text-sm"
                  id="email-input"
                  name="email"
                  placeholder="you@example.com…"
                  spellCheck={false}
                  type="email"
                />
              </div>
              <Button className="h-9 shrink-0" type="submit">
                Subscribe
              </Button>
            </form>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-foreground/10 border-t">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-8 text-muted-foreground text-xs sm:flex-row">
          <p>
            Built with{" "}
            <a
              className="underline underline-offset-4 transition-colors duration-150 hover:text-foreground"
              href="https://nextjs.org"
              rel="noopener noreferrer"
              target="_blank"
            >
              Next.js
            </a>{" "}
            &amp;{" "}
            <a
              className="underline underline-offset-4 transition-colors duration-150 hover:text-foreground"
              href="https://ui.shadcn.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              shadcn/ui
            </a>
          </p>
          <p>© {new Date().getFullYear()} Next.js Boilerplate</p>
        </div>
      </footer>
    </div>
  );
}
