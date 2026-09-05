import { ShieldCheck, BadgeCheck, Headphones, Heart } from "lucide-react";

const BADGES = [
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    text: "Your payment and data are fully protected.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Experiences",
    text: "Every listing is reviewed before it goes live.",
  },
  {
    icon: Headphones,
    title: "Real Support",
    text: "We're here to help if anything comes up.",
  },
  {
    icon: Heart,
    title: "Fan First",
    text: "Built around getting you the real experience.",
  },
];

const TrustBadgeStrip = () => {
  return (
    <section className="mg-trust">
      {BADGES.map((badge) => {
        const Icon = badge.icon;
        return (
          <div className="mg-trust-item" key={badge.title}>
            <span className="mg-trust-icon">
              <Icon size={18} />
            </span>
            <div>
              <span className="mg-trust-title">{badge.title}</span>
              <span className="mg-trust-text">{badge.text}</span>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default TrustBadgeStrip;