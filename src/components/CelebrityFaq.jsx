import { useState } from "react";
import { ChevronDown } from "lucide-react";

const buildFAQs = (name) => {
  const artist = name || "this artist";

  return [
    {
      question: `Is Spotlight officially connected to ${artist}?`,
      answer: `We work directly with ${artist}'s management team to offer verified tickets, meet & greets, and experiences. Everything listed on this page comes from that relationship, not a third party reselling unofficial access.`,
    },
    {
      question: "How do you sell tickets and meet & greets for artists?",
      answer:
        "Standard event tickets come from verified organizers and venues. Meet & greets work differently — when you submit a request, our team reaches out directly to the artist's management to arrange it, then brings the offer back to you.",
    },
    {
      question: "Is it safe to pay through Spotlight?",
      answer:
        "Yes. Payments are processed securely, and every listing on this page is reviewed before it goes live. We never share your payment details with the artist's team directly.",
    },
    {
      question: "What if my meet & greet request can't be arranged?",
      answer:
        "You're not charged until you accept a confirmed offer. If it turns out not to be feasible, we'll tell you directly instead of leaving you waiting.",
    },
    {
      question: "Who do I contact if something goes wrong?",
      answer:
        "Our support team is available directly through the platform — reach out any time before or after booking and we'll help sort it out.",
    },
  ];
};

const CelebrityFAQ = ({ celebrityName }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = buildFAQs(celebrityName);

  const toggle = (i) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section className="cf-faq">

      <h2>Frequently Asked Questions</h2>

      <div className="cf-faq-list">
        {faqs.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div className={`cf-faq-item ${isOpen ? "open" : ""}`} key={item.question}>
              <button
                type="button"
                className="cf-faq-question"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
              >
                {item.question}
                <ChevronDown size={16} className="cf-faq-chevron" />
              </button>

              {isOpen && <p className="cf-faq-answer">{item.answer}</p>}
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default CelebrityFAQ;