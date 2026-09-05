import { Sparkles, CreditCard, CheckCircle2, Handshake } from "lucide-react";

const STEPS = [
  {
    icon: Sparkles,
    title: "Choose Your Experience",
    text: "Pick this meet & greet and select how many spots you need.",
  },
  {
    icon: CreditCard,
    title: "Make Payment",
    text: "Complete your booking securely with your preferred payment method.",
  },
  {
    icon: CheckCircle2,
    title: "Get Confirmed",
    text: "Receive instant confirmation with everything you need to know.",
  },
  {
    icon: Handshake,
    title: "Meet & Enjoy",
    text: "Arrive on time and enjoy your exclusive meet & greet experience.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="mg-how">

      <div className="mg-how-inner">

        <span className="mg-how-eyebrow">✦ Simple &amp; Secure</span>
        <h2>How It Works</h2>

        <div className="mg-how-steps">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div className="mg-how-step" key={step.title}>
                <div className="mg-how-step-number">{i + 1}</div>
                <div className="mg-how-step-icon">
                  <Icon size={20} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
};

export default HowItWorks;