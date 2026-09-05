import { Quote } from "lucide-react";

const AboutSection = ({ meetAndGreet }) => {
  if (!meetAndGreet?.description) return null;

  return (
    <section id="about" className="mg-about">

      <div className="mg-about-label">
        <span className="mg-eyebrow">The Experience</span>
        <h2>About</h2>
      </div>

      <div className="mg-about-body">
        <Quote className="mg-about-quote" size={40} strokeWidth={1.5} />
        <p>{meetAndGreet.description}</p>
      </div>

    </section>
  );
};

export default AboutSection;