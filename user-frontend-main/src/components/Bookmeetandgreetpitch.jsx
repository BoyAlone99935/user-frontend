import { useNavigate } from "react-router-dom";
import { Send, Handshake, Mail, CheckCircle2 } from "lucide-react";
import '../Fans.css'
const steps = [
  {
    icon: Send,
    title: "Send Your Request",
    text: "Tell us what you're hoping for — date, occasion, budget. Takes two minutes.",
  },
  {
    icon: Handshake,
    title: "We Handle the Rest",
    text: "Our team reaches out directly to their management and works out the details.",
  },
  {
    icon: Mail,
    title: "Get a Real Offer",
    text: "If it's feasible, you'll get a personalized offer with pricing and terms.",
  },
  {
    icon: CheckCircle2,
    title: "Accept or Decline",
    text: "No pressure, no obligation. Not workable? We'll tell you straight instead of leaving you hanging.",
  },
];

const BookMeetAndGreetPitch = ({ celebrityName, celebrityImage, slug }) => {
  const navigate = useNavigate();

  return (
    <section className="booking-pitch">
      <hr className="fv-divider" />
      <div className="booking-pitch-inner">

        <div className="booking-pitch-copy">
          <div className="booking-pitch-identity">
            {celebrityImage && (
              <img
                src={celebrityImage}
                alt={celebrityName}
                className="booking-pitch-avatar"
              />
            )}
            <span className="booking-pitch-eyebrow">✦ Only On Spotlight</span>
          </div>

          <h2>
            Book a real meet &amp; greet with{" "}
            <span className="gradient-text">{celebrityName || "your favorite artist"}</span>
          </h2>

          <p>
            You're not booking a slot off a shelf — you're asking, and we go make it
            happen. We work directly with {celebrityName ? `${celebrityName}'s` : "their"}{" "}
            management to see what's actually possible, then bring the offer back to you.
            No other platform does this part for you.
          </p>

          <button
            type="button"
            className="booking-pitch-cta"
            onClick={() => navigate(`/celebrity/${slug}/request-meet-and-greet`)}
          >
            Book Meet &amp; Greet
          </button>

          <p className="booking-pitch-note" style={{marginTop:"0.8rem"}}>
            No charge to send a request. You only pay if you accept the offer.
          </p>
        </div>

        <div className="booking-pitch-steps">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div className="booking-step" key={step.title}>
                <div className="booking-step-number">{i + 1}</div>
                <div className="booking-step-icon">
                  <Icon size={20} />
                </div>
                <div className="booking-step-text">
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
};

export default BookMeetAndGreetPitch;