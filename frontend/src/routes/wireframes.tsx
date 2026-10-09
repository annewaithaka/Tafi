import { useEffect, useRef, useState } from "react";

import { buttonStyles } from "@/components/ui/button-styles";
import { cn } from "@/lib/utils";

const DECK_SRC = "/wireframes/tafi-mvp1-wireframes.html";

interface Screen {
  /** Exact heading text in the exported deck, used to find the screen. */
  title: string;
  label: string;
  blurb: string;
}

interface Group {
  name: string;
  screens: Screen[];
}

const groups: Group[] = [
  {
    name: "School portal",
    screens: [
      {
        title: "School portal · Today",
        label: "Today",
        blurb: "The morning run: trips running, children boarded, and anything that needs attention.",
      },
      {
        title: "School portal · Children & guardians",
        label: "Children & guardians",
        blurb: "Riders with their route, stop and guardian, plus import and WhatsApp invite actions.",
      },
      {
        title: "School portal · Routes, vehicles & crew",
        label: "Routes, vehicles & crew",
        blurb: "The routes with their stops, and the vehicle and crew assigned to each.",
      },
      {
        title: "School portal · Trip detail",
        label: "Trip detail",
        blurb: "One trip: the stop order, who boarded where, and the timeline of what happened.",
      },
    ],
  },
  {
    name: "Crew app",
    screens: [
      {
        title: "Crew app · My trip today",
        label: "My trip today",
        blurb: "What the driver opens on their phone: today's trip, start and end controls.",
      },
      {
        title: "Crew app · Mark children on and off",
        label: "Mark children on and off",
        blurb: "Tapping each child boarded, dropped off or absent, one-handed.",
      },
      {
        title: "Crew app · Trip complete",
        label: "Trip complete",
        blurb: "The summary after a trip and what was recorded for every child.",
      },
    ],
  },
  {
    name: "Parent",
    screens: [
      {
        title: "Option A · Parent WhatsApp messages",
        label: "WhatsApp messages (Option A)",
        blurb: "Boarded, approaching, dropped off and absent — and what a failed message looks like.",
      },
      {
        title: "Option A · Registration page (from invite link)",
        label: "Registration from invite link (Option A)",
        blurb: "What a guardian sees when the school invites them, including the consent step.",
      },
      {
        title: "Option B · Parent web dashboard",
        label: "Parent web dashboard (Option B)",
        blurb: "A parent web view. Not in MVP 1 — it is one side of an open decision for the client.",
      },
    ],
  },
  {
    name: "Later phase",
    screens: [
      {
        title: "Transport operator · Overview (later phase)",
        label: "Transport operator overview",
        blurb: "A provider running several schools. After MVP 1.",
      },
    ],
  },
];

const allScreens = groups.flatMap((group) => group.screens);
const titles = new Set(allScreens.map((screen) => screen.title));

export function WireframesPage() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [offsets, setOffsets] = useState<Record<string, number>>({});
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let attempts = 0;
    let timer: number | undefined;

    // The deck is a bundle that unpacks its screens with JavaScript, so the
    // headings appear late and grow the page. Re-measure until every screen is
    // accounted for, then stop.
    function measure(): boolean {
      const doc = frameRef.current?.contentDocument;
      if (!doc) {
        return false;
      }

      const found: Record<string, number> = {};
      const scrollTop = doc.documentElement.scrollTop || doc.body.scrollTop || 0;
      for (const node of Array.from(doc.querySelectorAll<HTMLElement>("*"))) {
        if (node.children.length > 0) {
          continue;
        }
        const text = (node.textContent ?? "").trim();
        if (!titles.has(text)) {
          continue;
        }
        const top = Math.max(0, node.getBoundingClientRect().top + scrollTop - 16);
        if (found[text] === undefined || top < found[text]) {
          found[text] = top;
        }
      }

      setOffsets(found);
      return Object.keys(found).length >= titles.size;
    }

    function tick() {
      attempts += 1;
      const complete = measure();
      if (!complete && attempts < 40) {
        timer = window.setTimeout(tick, 500);
      }
    }

    const frame = frameRef.current;
    frame?.addEventListener("load", tick);
    tick();

    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
      frame?.removeEventListener("load", tick);
    };
  }, []);

  function openScreen(screen: Screen) {
    setActive(screen.title);
    const top = offsets[screen.title];
    const frame = frameRef.current;
    if (frame?.contentWindow && top !== undefined) {
      frame.contentWindow.scrollTo({ top, behavior: "smooth" });
      return;
    }
    window.open(DECK_SRC, "_blank", "noopener");
  }

  const measured = Object.keys(offsets).length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">MVP 1 wireframes</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Eleven screens, drawn before any of them are built. Pick a screen to jump to it, or open the full deck
            in its own tab. These are a design preview, not the working product.
          </p>
        </div>
        <a href={DECK_SRC} target="_blank" rel="noreferrer" className={buttonStyles()}>
          Open the full deck
        </a>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[20rem_1fr]">
        <nav aria-label="Wireframe screens" className="flex flex-col gap-5">
          {groups.map((group) => (
            <div key={group.name}>
              <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{group.name}</h2>
              <ul className="mt-2 flex flex-col gap-1">
                {group.screens.map((screen) => (
                  <li key={screen.title}>
                    <button
                      type="button"
                      onClick={() => openScreen(screen)}
                      className={cn(
                        "w-full rounded-lg border px-3 py-2 text-left transition",
                        active === screen.title
                          ? "border-primary bg-brand-soft"
                          : "border-transparent hover:border-border hover:bg-muted",
                      )}
                    >
                      <span className="block text-sm font-medium">{screen.label}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{screen.blurb}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            {measured}/{allScreens.length} screens ready in the preview.
          </p>
        </nav>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <iframe
            ref={frameRef}
            src={DECK_SRC}
            title="Tafi MVP 1 wireframes"
            className="h-[70vh] w-full lg:h-[calc(100dvh-12rem)]"
          />
        </div>
      </div>
    </div>
  );
}
