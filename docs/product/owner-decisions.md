# Owner Decisions

> **OWNER TO CONFIRM.** We provide a recommendation and reasoning, but the decision is the owner's.
> Nothing here is approved yet. Status values: `OWNER TO CONFIRM` → `DECIDED`.

| # | Decision | Options | Our recommendation | Why | Owner decision | Status |
|---|---|---|---|---|---|---|
| 1 | Primary Tafi customer | Parent / School / Operator | School (for MVP) | School owns data & process; fastest to real value | — | OWNER TO CONFIRM |
| 2 | Product direction | Parent WhatsApp / School ops / Staged both | Staged: school ops first, parent layer next | Marketing promises parent value; ops core must exist first | — | OWNER TO CONFIRM |
| 3 | MVP customer | School / Parent / Operator | A single pilot school | Smallest scope to prove value | — | OWNER TO CONFIRM |
| 4 | MVP workflow | Onboard → roster+route → notify / Billing-first / Tracking-first | Onboard → manage roster & routes → bill | Matches existing code; clear value | — | OWNER TO CONFIRM |
| 5 | Required channels | WhatsApp / SMS / Email / In-app only | WhatsApp (+SMS fallback later) | Market expectation in Kenya | — | OWNER TO CONFIRM |
| 6 | Business model | Per-student/month / Per-school / Free pilot | Per-student/month (pilot free) | Competitors price this way (UBUS ~KES 100) | — | OWNER TO CONFIRM |
| 7 | School/operator model | Single-school / Multi-school | Single-school for MVP | Lower complexity | — | OWNER TO CONFIRM |
| 8 | Driver workflow | Scan-based / Manual / None in MVP | Manual now, scan later | Avoid hardware delay | — | OWNER TO CONFIRM |
| 9 | Parent workflow | WhatsApp bot / Link view / App / None in MVP | WhatsApp message + link (no app) | Matches competitor pattern | — | OWNER TO CONFIRM |
| 10 | Tracking/safety requirements | Live GPS / Status only / QR only | Status + QR first; live later | Live GPS needs data/hardware | — | OWNER TO CONFIRM |
| 11 | Payments | Auto M-Pesa / Manual record | Manual record for MVP | Avoid integration risk | — | OWNER TO CONFIRM |
| 12 | Data/privacy expectations | Kenya DPA / GDPR-level / Basic | Kenya DPA 2019 baseline | Legal + trust | — | OWNER TO CONFIRM |
| 13 | Launch expectations | Pilot / Public / Internal demo | Single-school pilot | Validate before scale | — | OWNER TO CONFIRM |
| 14 | Success metrics | Retention / Notifications delivered / Fees collected | Define 1 primary metric with owner | Need a yardstick | — | OWNER TO CONFIRM |

## How to use this page

1. Owner reviews each row and writes a decision (or "defer").
2. We update `Status` to `DECIDED` and copy confirmed items into [`../DECISIONS.md`](../DECISIONS.md).
3. Items 1–2 unblock everything else; confirm those first.
