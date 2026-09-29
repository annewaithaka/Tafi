import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import parentImg from "@/assets/parent.jpg";
import parentCardImg from "@/assets/parent-card.jpg";
import schoolImg from "@/assets/school.jpg";
import driverImg from "@/assets/driver.jpg";
import avatarImg from "@/assets/avatar.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tafi — Safe school transport, via WhatsApp" },
      {
        name: "description",
        content:
          "Tafi connects Kenyan parents, schools, and drivers through WhatsApp. Real-time boarding alerts, live route tracking, and verified drivers — no new app to download.",
      },
      { property: "og:title", content: "Tafi — Safe school transport, via WhatsApp" },
      {
        property: "og:description",
        content:
          "Real-time boarding alerts, live route tracking, and verified drivers — all inside the WhatsApp app you already use every day.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-surface text-ink font-sans antialiased selection:bg-brand/20">
      <Nav />
      <Hero />
      <Timeline />
      <DemoSection />
      <Product />
      <Testimonial />
      <FinalCTA />
      <Footer />
    </div>
  );
}


function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={"flex items-center gap-2 " + className}>
      <div className="size-8 rounded-lg bg-brand flex items-center justify-center text-primary-foreground font-display font-extrabold text-sm">
        T
      </div>
      <span className="font-display font-extrabold text-xl tracking-tight text-ink">Tafi</span>
    </div>
  );
}

function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#how" className="hover:text-brand transition-colors">How it works</a>
          <a href="#product" className="hover:text-brand transition-colors">Product</a>
          <a href="#product" className="hover:text-brand transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/auth"
            className="hidden sm:inline text-sm font-semibold text-ink hover:text-brand transition-colors"
          >
            School portal
          </Link>
          <Link
            to="/auth"
            search={{ portal: "tafi" }}
            className="bg-accent text-accent-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Tafi admin
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative pt-16 pb-32 px-6 overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 size-[900px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--brand) 25%, transparent), transparent 70%)",
          }}
        />
        <div className="absolute -bottom-40 -left-40 size-[500px] bg-safe/20 blur-[120px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--ink) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-16 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border shadow-sm text-xs font-bold tracking-widest uppercase mb-8">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-safe opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full size-2 bg-safe" />
            </span>
            <span className="text-ink">Reimagined · Innovative · Peace of mind</span>
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight leading-[0.98] text-balance mb-6">
            No missed pickups.{" "}
            <span className="text-brand">Just Tafi.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-[52ch] leading-relaxed mb-10">
            Real-time updates from verified drivers — delivered to WhatsApp, SMS, and email.
            Parents, schools, and operators finally on the same page, every single morning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <a
              href="#product"
              className="group relative bg-ink text-surface px-8 py-4 rounded-2xl font-bold text-lg text-center hover:scale-[1.02] transition-transform shadow-xl shadow-ink/20 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get started free
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-brand to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a
              href="#demo"
              className="px-8 py-4 rounded-2xl font-bold text-lg text-center border-2 border-ink/10 bg-card/60 backdrop-blur hover:bg-card hover:border-ink/20 transition-all"
            >
              ▶ Watch demo
            </a>
          </div>
          {/* Channels row */}
          <div className="flex items-center gap-3 flex-wrap mb-8">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Alerts on</span>
            <ChannelChip icon="💬" label="WhatsApp" tone="safe" />
            <ChannelChip icon="✉️" label="Email" tone="ink" />
            <ChannelChip icon="📱" label="SMS" tone="brand" />
          </div>
          {/* Social proof strip */}
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex -space-x-2">
              {[
                "oklch(0.75 0.15 40)",
                "oklch(0.55 0.12 160)",
                "oklch(0.7 0.13 60)",
                "oklch(0.6 0.14 20)",
              ].map((c, i) => (
                <div
                  key={i}
                  className="size-9 rounded-full ring-2 ring-surface"
                  style={{ background: c }}
                />
              ))}
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-1 text-brand font-bold">
                ★★★★★ <span className="text-ink">4.9/5</span>
              </div>
              <div className="text-muted-foreground text-xs">
                Trusted by 12,000+ parents across the country
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-black/5 bg-card">
            <img
              src={parentImg}
              alt="Kenyan parent receiving a Tafi WhatsApp notification on their phone"
              loading="eager"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-brand/10 flex items-center justify-center text-brand text-lg">✓</div>
                <div>
                  <p className="font-bold text-sm text-ink">Amani boarded safely</p>
                  <p className="text-xs text-muted-foreground">7:12 AM · Bus KDA 213A</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function ChannelChip({ icon, label, tone }: { icon: string; label: string; tone: "safe" | "brand" | "ink" }) {
  const toneCls =
    tone === "safe"
      ? "bg-safe/10 text-accent"
      : tone === "brand"
        ? "bg-brand/10 text-brand"
        : "bg-ink/5 text-ink";
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${toneCls}`}>
      <span aria-hidden>{icon}</span>
      {label}
    </span>
  );
}

type Beat =
  | { kind: "msg"; side: "in" | "out"; time: string; body: React.ReactNode; typingMs?: number }
  | { kind: "map"; time: string; typingMs?: number };

const BEATS: Beat[] = [
  {
    kind: "msg",
    side: "out",
    time: "07:10",
    typingMs: 800,
    body: <>Where is Amani?</>,
  },
  {
    kind: "msg",
    side: "in",
    time: "07:12",
    typingMs: 1400,
    body: (
      <>
        <strong>✓ Amani boarded</strong> Bus KDA 213A at 7:12 AM
        <br />
        <span className="text-[11px] opacity-70">(tag scanned by driver Peter)</span>
      </>
    ),
  },
  { kind: "map", time: "07:12", typingMs: 900 },
  {
    kind: "msg",
    side: "in",
    time: "07:13",
    typingMs: 1100,
    body: <>ETA to Riverside Academy: <strong>7:38 AM</strong> 🚌</>,
  },
  {
    kind: "msg",
    side: "out",
    time: "07:14",
    typingMs: 700,
    body: <>Asante! 🙏</>,
  },
  {
    kind: "msg",
    side: "in",
    time: "07:38",
    typingMs: 1200,
    body: (
      <>
        <strong>✓ Arrived</strong> at Riverside Academy
        <br />
        <span className="text-[11px] opacity-70">Amani tag scanned off bus</span>
      </>
    ),
  },
];

function WhatsAppDemo() {
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    // Loop: for each beat, show typing then reveal, then advance.
    const beat = BEATS[step % BEATS.length];
    const typingMs = beat.typingMs ?? 800;
    const holdMs = 1600;
    let t2: ReturnType<typeof setTimeout>;

    setTyping(true);
    const t1 = setTimeout(() => {
      setTyping(false);
      t2 = setTimeout(() => {
        setStep((s) => (s + 1 >= BEATS.length ? 0 : s + 1));
      }, holdMs);
    }, typingMs);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2!);
    };
  }, [step]);

  // On loop restart (step === 0), clear visible history
  const cycle = Math.floor(step / BEATS.length);
  const visible = BEATS.slice(0, (step % BEATS.length) + (typing ? 0 : 1));

  return (
    <div className="relative z-10 w-full max-w-[360px] mx-auto bg-card rounded-[2.5rem] p-3 shadow-2xl ring-1 ring-black/5">
      <div className="bg-[#EFEAE2] rounded-[2rem] h-[560px] flex flex-col overflow-hidden">
        <div className="bg-[#075E54] p-4 pt-6 text-white flex items-center gap-3">
          <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <circle cx="12" cy="5" r="2" />
              <path d="M12 7v4" />
              <circle cx="8" cy="15" r="1" fill="currentColor" />
              <circle cx="16" cy="15" r="1" fill="currentColor" />
              <path d="M8 19h8" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">Tafi Assistant</p>
            <p className="text-[10px] opacity-80 uppercase tracking-wider">
              online
            </p>
          </div>
          <div className="flex gap-3 opacity-80 text-lg">⋮</div>

        </div>
        <div
          key={cycle}
          className="flex-1 p-4 space-y-2.5 overflow-hidden flex flex-col justify-end"
        >
          {visible.map((b, i) =>
            b.kind === "map" ? (
              <MapBubble key={`${cycle}-${i}`} time={b.time} />
            ) : (
              <ChatBubble key={`${cycle}-${i}`} side={b.side} time={b.time}>
                {b.body}
              </ChatBubble>
            ),
          )}
          {typing && <TypingBubble />}
        </div>
      </div>
    </div>
  );
}


function ChatBubble({
  side,
  time,
  children,
}: {
  side: "in" | "out";
  time: string;
  children: React.ReactNode;
}) {
  const base =
    "p-3 rounded-2xl text-[13px] shadow-sm max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300";
  const styles =
    side === "in"
      ? "bg-white rounded-tl-none text-ink"
      : "bg-[#DCF8C6] rounded-tr-none ml-auto text-ink";
  return (
    <div className={base + " " + styles}>
      {children}
      <span className="block text-[9px] text-black/40 mt-1 text-right font-mono">
        {time} {side === "out" && <span className="text-[#34B7F1]">✓✓</span>}
      </span>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="p-3 rounded-2xl rounded-tl-none bg-white shadow-sm w-fit animate-in fade-in duration-200">
      <span className="flex gap-1 items-center h-3">
        <span className="size-1.5 rounded-full bg-black/30 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="size-1.5 rounded-full bg-black/30 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="size-1.5 rounded-full bg-black/30 animate-bounce" style={{ animationDelay: "300ms" }} />
      </span>
    </div>
  );
}

function MapBubble({ time }: { time: string }) {
  return (
    <div className="p-2 rounded-2xl rounded-tl-none bg-white shadow-sm max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-emerald-50 to-stone-100 aspect-[2/1] ring-1 ring-black/5">
        <svg viewBox="0 0 200 100" className="absolute inset-0 w-full h-full">
          <path
            d="M10 80 Q 50 70, 70 50 T 130 30 T 190 20"
            stroke="var(--brand)"
            strokeWidth="2"
            strokeDasharray="4 3"
            fill="none"
          />
          <circle cx="70" cy="50" r="4" fill="var(--safe)" />
          <circle cx="190" cy="20" r="4" fill="var(--brand)" />
        </svg>
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 px-2 py-0.5 rounded-full text-[9px] font-bold">
          <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />
          LIVE
        </div>
      </div>
      <div className="px-1 pt-2 text-[11px] text-ink font-semibold">Route 4 · 14 min to school</div>
      <span className="block text-[9px] text-black/40 mt-0.5 px-1 text-right font-mono">{time}</span>
    </div>
  );
}

function Timeline() {
  const steps = [
    {
      n: "01",
      title: "Morning check-in",
      body: "Driver scans your child's Tafi tag. You get an instant WhatsApp notification the moment they're safe on board.",
    },
    {
      n: "02",
      title: "Live route watch",
      body: "Follow the bus in real time. Know exactly when it's two minutes from your gate or the school gates.",
    },
    {
      n: "03",
      title: "Arrival verified",
      body: "A final confirmation once the bus reaches school — safe, sound, and logged for the administrator.",
    },
  ];
  return (
    <section id="how" className="bg-card py-24 border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Timeline of safety
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight max-w-2xl">
            The daily peace of mind, in three quiet moments.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.n} className="group">
              <div className="size-12 bg-brand/10 rounded-2xl flex items-center justify-center font-mono font-bold text-brand mb-6 group-hover:bg-brand group-hover:text-primary-foreground transition-colors duration-300">
                {s.n}
              </div>
              <h3 className="font-display text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoSection() {
  return (
    <section id="demo" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-50">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--ink) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-16 items-center">
        <div>
          <span className="inline-flex items-center gap-2 bg-ink text-surface px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-6">
            <span className="size-2 rounded-full bg-red-500 animate-pulse" />
            Live demo
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance">
            See Tafi in action.
          </h2>
          <p className="text-lg text-muted-foreground max-w-[50ch] leading-relaxed mb-8">
            Ask anytime on WhatsApp. Tafi replies instantly with your child's live status — powered by driver tag scans on every pickup and drop-off.
          </p>
          <ul className="space-y-3">
            {[
              "Parent asks where their child is",
              "Driver tag scan triggers the update",
              "Tafi bot replies with boarding time & ETA",
              "Arrival confirmation when they reach school",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm">
                <span className="size-5 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <WhatsAppDemo />
        </div>
      </div>
    </section>
  );
}

function Product() {

  const cards = [
    {
      id: "parents",
      eyebrow: "For parents",
      title: "Peace of mind, delivered.",
      body: "Millennial convenience for busy modern families — every alert in the apps you already use.",
      features: [
        "Boarding & drop-off alerts",
        "Live bus location on demand",
        "Verified driver profile & photo",
        "Emergency SOS line",
      ],
      price: "KES 450",
      unit: "/ child / month",
      cta: "Start free trial",
      ctaHref: "#",
      img: parentCardImg,
      alt: "Kenyan parent at a school gate receiving a Tafi alert",
      featured: true,
    },
    {
      id: "schools",
      eyebrow: "For schools",
      title: "Calm dashboards, calmer mornings.",
      body: "Eliminate morning chaos with one view of every route, child, and parent.",
      features: [
        "Unlimited parent notifications",
        "Admin dashboard & attendance",
        "Route & fleet analytics",
        "Dedicated onboarding lead",
      ],
      price: "Custom",
      unit: "tailored to your fleet",
      cta: "Talk to our team",
      ctaHref: "#contact",
      img: schoolImg,
      alt: "School administrator managing transport",
      featured: false,
    },
    {
      id: "operators",
      eyebrow: "For operators",
      title: "Scale fleets, share the load.",
      body: "Run multiple schools on one platform with shared drivers, routes, and M-Pesa splits.",
      features: [
        "Multi-school management",
        "Driver app & QR check-in",
        "M-Pesa payment splits",
        "24/7 operations support",
      ],
      price: "Let's chat",
      unit: "volume pricing",
      cta: "Contact sales",
      ctaHref: "#contact",
      img: driverImg,
      alt: "School bus driver holding a smartphone",
      featured: false,
    },
  ];
  return (
    <section id="product" className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-brand/5 to-transparent -z-10" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-brand mb-3">
            One platform · three experiences
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance">
            Built for parents. <span className="text-brand">Loved by schools.</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            The same trusted platform, priced right for who's using it.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 items-stretch auto-rows-fr" id="pricing">
          {cards.map((c) => (
            <div
              key={c.id}
              id={c.id}
              className={
                "relative rounded-[2rem] flex flex-col overflow-hidden transition-all duration-300 " +
                (c.featured
                  ? "bg-card ring-2 ring-brand shadow-2xl md:-translate-y-4 hover:-translate-y-5"
                  : "bg-card border border-border hover:-translate-y-1 hover:shadow-xl")
              }
            >
              {c.featured && (
                <div className="absolute top-4 right-4 z-10 bg-brand text-primary-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                  ★ Most popular
                </div>
              )}
              <div className="aspect-[16/10] bg-muted overflow-hidden">
                <img
                  src={c.img}
                  alt={c.alt}
                  loading="lazy"
                  width={800}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <p className="font-mono text-[10px] uppercase tracking-widest text-brand mb-2">
                  {c.eyebrow}
                </p>
                <h3 className="font-display text-2xl font-extrabold mb-2 leading-tight">
                  {c.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">{c.body}</p>
                <ul className="space-y-2.5 mb-8 text-sm flex-1">
                  {c.features.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <span className="size-5 rounded-full bg-safe/10 text-accent flex items-center justify-center text-xs font-bold shrink-0">
                        ✓
                      </span>
                      <span className="font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mb-6 pt-6 border-t border-border">
                  <div className="font-display text-3xl font-extrabold leading-none">
                    {c.price}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{c.unit}</div>
                </div>
                <a
                  href={c.ctaHref}
                  className={
                    "block text-center py-3.5 rounded-2xl font-bold transition-all " +
                    (c.featured
                      ? "bg-brand text-primary-foreground hover:scale-[1.02] shadow-lg shadow-brand/30"
                      : "bg-ink text-surface hover:opacity-90")
                  }
                >
                  {c.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-10">
          Free onboarding · M-Pesa & bank transfer accepted · Cancel anytime
        </p>
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section className="bg-accent text-accent-foreground py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="font-display text-6xl leading-none opacity-40 mb-6">"</div>
        <p className="font-display text-2xl md:text-3xl font-medium leading-snug mb-10 text-balance">
          Tafi changed how we handle transport. Parents aren't guessing where the bus is,
          and our admins save hours every week on phone calls. It just fits into how
          Kenyan families already communicate.
        </p>
        <div className="flex items-center justify-center gap-4">
          <img
            src={avatarImg}
            alt="Jane Kamau, school administrator"
            width={512}
            height={512}
            loading="lazy"
            className="size-14 rounded-full object-cover ring-2 ring-white/20"
          />
          <div className="text-left">
            <div className="font-bold">Jane Kamau</div>
            <div className="opacity-70 text-sm">Admin, Greenview Academy · Kenya</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="pb-24 px-6">
      <div className="max-w-5xl mx-auto bg-ink text-surface rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-balance">
            Ready to modernize your school route?
          </h2>
          <p className="text-xl opacity-70 mb-12 max-w-2xl mx-auto">
            Join schools across the country already using Tafi for a
            safer, calmer commute.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <a
              href="#pricing"
              className="bg-brand text-primary-foreground px-10 py-5 rounded-full font-bold text-lg hover:scale-[1.02] transition-transform shadow-xl"
            >
              Start free trial via WhatsApp
            </a>
            <a
              href="#contact"
              className="px-10 py-5 rounded-full font-bold text-lg border border-white/20 hover:bg-white/5 transition-colors"
            >
              Talk to sales
            </a>
          </div>
        </div>
        <div className="absolute -top-24 -left-24 size-96 bg-brand/30 blur-[120px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 size-96 bg-accent/40 blur-[120px] rounded-full" />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <Logo />
        <p className="text-sm text-muted-foreground text-center">
          © 2026 Tafi Technologies Ltd. · Built for safer school runs across Kenya.
        </p>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-brand">Privacy</a>
          <a href="#" className="hover:text-brand">Terms</a>
          <a href="#" className="hover:text-brand">Contact</a>
        </div>
      </div>
    </footer>
  );
}
