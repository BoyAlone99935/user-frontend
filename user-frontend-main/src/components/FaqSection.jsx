import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "What time should I arrive?",
    answer:
      "We recommend arriving at least 30 minutes before your scheduled time to allow for check-in and any security procedures at the venue.",
  },
  {
    question: "Can I bring a friend or guest?",
    answer:
      "Each spot booked is for one person. If you'd like to bring someone with you, they'll need their own spot booked separately.",
  },
  {
    question: "Can I take photos and videos?",
    answer:
      "Photos are typically included as part of the experience. Video recording policies can vary by event, so check the What's Included section above for specifics.",
  },
  {
    question: "Is this refundable?",
    answer:
      "Refund eligibility depends on how far in advance you cancel. See our Refund Policy for full details.",
  },
  {
    question: "What happens after I book?",
    answer:
      "You'll receive a confirmation with everything you need to know where to go, what time, and what to bring. Keep an eye on your email.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section id="faq" className="mg-faq">

      <div className="mg-about-label">
        <span className="mg-eyebrow">Good To Know</span>
        <h2>FAQ</h2>
      </div>

      <div className="mg-faq-list">
        {FAQS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div className={`mg-faq-item ${isOpen ? "open" : ""}`} key={item.question}>
              <button
                type="button"
                className="mg-faq-question"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
              >
                {item.question}
                <ChevronDown size={16} className="mg-faq-chevron" />
              </button>

              {isOpen && <p className="mg-faq-answer">{item.answer}</p>}
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default FAQSection;