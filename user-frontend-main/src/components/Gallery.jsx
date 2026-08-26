import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const Gallery = ({ meetAndGreet }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  // hero already used the first image — gallery shows the rest
  const photos = (meetAndGreet?.images || []).slice(1);

  useEffect(() => {
    if (activeIndex === null) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const goPrev = () => {
    setActiveIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
  };

  const goNext = () => {
    setActiveIndex((i) => (i === photos.length - 1 ? 0 : i + 1));
  };

  if (photos.length === 0) return null;

  return (
    <section id="gallery" className="mg-gallery">

      <div className="mg-about-label">
        <span className="mg-eyebrow">See It For Yourself</span>
        <h2>Gallery</h2>
      </div>

      <div className="mg-gallery-grid">
        {photos.map((src, i) => (
          <button
            type="button"
            key={src}
            className="mg-gallery-item"
            onClick={() => setActiveIndex(i)}
          >
            <img src={src} alt={`${meetAndGreet.title} photo ${i + 1}`} />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className="mg-lightbox-overlay"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            className="mg-lightbox-close"
            onClick={() => setActiveIndex(null)}
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {photos.length > 1 && (
            <button
              type="button"
              className="mg-lightbox-nav prev"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          <img
            src={photos[activeIndex]}
            alt={`${meetAndGreet.title} photo ${activeIndex + 1}`}
            className="mg-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />

          {photos.length > 1 && (
            <button
              type="button"
              className="mg-lightbox-nav next"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Next photo"
            >
              <ChevronRight size={22} />
            </button>
          )}

          <span className="mg-lightbox-count">
            {activeIndex + 1} / {photos.length}
          </span>
        </div>
      )}

    </section>
  );
};

export default Gallery;