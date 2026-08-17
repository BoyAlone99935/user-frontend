// src/components/policies/PolicySection.jsx
//
// Standalone — drop it wherever (checkout page, event page footer, etc).
// Swap POLICIES with your real copy; the [Placeholder] text is layout
// filler, not real legal language.

import { useState } from "react";
import styles from "../Policy.module.css";

const ICONS = {
  resale: (
    <path d="M7 7h10l-2.5-2.5M17 17H7l2.5 2.5M7 7l0 6M17 17l0-6" strokeLinecap="round" strokeLinejoin="round" />
  ),
  refunds: (
    <path d="M4 12a8 8 0 1 1 2.6 5.9M4 12V7M4 12h5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  entry: (
    <>
      <rect x="3.5" y="6" width="17" height="12" rx="2.2" />
      <circle cx="9" cy="12" r="1.8" />
      <path d="M13.5 10.2h4M13.5 13.8h4" strokeLinecap="round" />
    </>
  ),
  fees: (
    <path
      d="M6 3h12v18l-2.5-1.6L13 21l-1-1.6-1 1.6-2.5-1.6L6 21V3Z M9 8h6M9 11.5h6M9 15h3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

const POLICIES = [
  {
    id: "resale",
    title: "Resale & transfer",
    summary: "Where and how tickets can change hands.",
    body:
      "Tickets may only be resold or transferred through the official resale marketplace. Tickets sold above face value through unofficial channels may be cancelled without refund. [Placeholder — replace with your actual resale terms.]",
  },
  {
    id: "refunds",
    title: "Refunds & cancellations",
    summary: "What happens if a show doesn't go on.",
    body:
      "All sales are final. If an event is cancelled or postponed, ticket holders will be notified by email with instructions for a refund or credit. [Placeholder — replace with your actual refund terms.]",
  },
  {
    id: "entry",
    title: "Entry requirements",
    summary: "What to bring on the night.",
    body:
      "A valid photo ID matching the name on the ticket may be required at entry. Doors open one hour before the listed start time. [Placeholder — replace with your actual entry terms.]",
  },
  {
    id: "fees",
    title: "Fees",
    summary: "What the service fee covers.",
    body:
      "A service fee is applied at checkout to cover platform and payment processing costs, shown separately in your order summary before you pay. [Placeholder — replace with your actual fee terms.]",
  },
];

export default function PolicySection() {
  const [openId, setOpenId] = useState(null);

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <span className={styles.eyebrow}>Know before you go</span>
        <h2 className={styles.title}>Policies</h2>
      </div>

      <div className={styles.list}>
        {POLICIES.map((p, i) => {
          const open = openId === p.id;
          return (
            <div className={`${styles.item} ${open ? styles.itemOpen : ""}`} key={p.id}>
              <button
                type="button"
                className={styles.trigger}
                onClick={() => setOpenId(open ? null : p.id)}
                aria-expanded={open}
              >
                <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>

                <span className={styles.iconBadge}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
                    {ICONS[p.id]}
                  </svg>
                </span>

                <span className={styles.triggerText}>
                  <span className={styles.itemTitle}>{p.title}</span>
                  <span className={styles.itemSummary}>{p.summary}</span>
                </span>

                <span className={styles.chevron}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>

              <div className={styles.bodyWrap}>
                <div className={styles.bodyInner}>
                  <p className={styles.body}>{p.body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}