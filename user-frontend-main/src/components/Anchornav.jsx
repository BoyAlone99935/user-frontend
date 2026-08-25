import { useState, useEffect } from "react";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "included", label: "What's Included" },
  { id: "how-it-works", label: "How It Works" },
  { id: "gallery", label: "Gallery" },
  { id: "location", label: "Location" },
];

const AnchorNav = () => {
  const [active, setActive] = useState(SECTIONS[0].id);

  const scrollToSection = (id) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // keep the active link in sync with whatever section is actually in
  // view while someone scrolls manually, not just on click
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="mg-anchor-nav">
      {SECTIONS.map((section) => (
        <button
          key={section.id}
          type="button"
          className={active === section.id ? "active" : ""}
          onClick={() => scrollToSection(section.id)}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
};

export default AnchorNav;