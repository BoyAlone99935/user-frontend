import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "What time do doors open?",
    answer:
      "Doors typically open 1-2 hours before the listed start time. Check your ticket confirmation for the exact time for this event.",
  },
  {
    question: "Is there an age restriction?",
    answer:
      "Age restrictions vary by event and venue. Check the event details above, or the venue's own policy, before purchasing.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Refund eligibility depends on how far in advance you cancel and the event's specific policy. See our Refund Policy for full details.",
  },
  {
    question: "Where do I find my seat or entry section?",
    answer:
      "For reserved tickets, your seat is assigned automatically and included in your confirmation. For general admission, entry is on a first-come basis within your section.",
  },
  {
    question: "What if the event is cancelled or rescheduled?",
    answer:
      "You'll be notified by email as soon as possible with details on refunds or updated dates.",
  },
];

const EventFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section className="ed-faq">

      <h2>Frequently Asked Questions</h2>

      <div className="ed-faq-list">
        {FAQS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div className={`ed-faq-item ${isOpen ? "open" : ""}`} key={item.question}>
              <button
                type="button"
                className="ed-faq-question"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
              >
                {item.question}
                <ChevronDown size={16} className="ed-faq-chevron" />
              </button>

              {isOpen && <p className="ed-faq-answer">{item.answer}</p>}
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default EventFAQ;