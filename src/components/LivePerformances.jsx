import { useEffect, useRef, useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import '../Live.css'
import '../Fans.css'

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const LivePerformances = ({ videos = [], celebrityName }) => {
  const [activeVideo, setActiveVideo] = useState(null);
  const trackRef = useRef(null);

  // lock background scroll + allow Escape to close while modal is open
  useEffect(() => {
    if (!activeVideo) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeVideo]);

  const scrollByCard = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(".live-card");
    const cardWidth = card ? card.offsetWidth + 24 : 300;
    track.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  if (videos.length === 0) return null;

  return (
    <section className="live-section">
      <hr className="fv-divider" />
      <div className="live-header">
        <h2>Live Performances</h2>
        <p>Watch {celebrityName || "this artist"} live, right here.</p>
      </div>

      <div className="live-slider">

        <button
          type="button"
          className="live-nav live-nav-prev"
          onClick={() => scrollByCard(-1)}
          aria-label="Previous"
        >
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M12.5 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="live-track" ref={trackRef}>
          {videos.map((video) => (
            <button
              type="button"
              className="live-card"
              key={video._id}
              onClick={() => setActiveVideo(video)}
            >
              <div className="live-thumb">
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                  alt={video.title}
                />

                <span className="live-badge">● Live Performance</span>

                <span className="live-play-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                </span>

                <div className="live-card-overlay">
                  <h3>{video.title}</h3>
                  {(video.venue || video.date) && (
                    <div className="live-meta">
                      {video.date && (
                        <span>
                          <CalendarDays size={13} />
                          {formatDate(video.date)}
                        </span>
                      )}
                      {video.venue && (
                        <span>
                          <MapPin size={13} />
                          {video.venue}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
          <div className="live-track-end-spacer" />
        </div>

        <button
          type="button"
          className="live-nav live-nav-next"
          onClick={() => scrollByCard(1)}
          aria-label="Next"
        >
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M7.5 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

      </div>

      {activeVideo && (
        <div
          className="live-modal-overlay"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="live-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="live-modal-close"
              onClick={() => setActiveVideo(null)}
              aria-label="Close"
            >
              <svg viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <div className="live-modal-player">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="live-modal-info">
              <h3>{activeVideo.title}</h3>
              {(activeVideo.venue || activeVideo.date) && (
                <p>
                  {activeVideo.venue}
                  {activeVideo.venue && activeVideo.date && " • "}
                  {formatDate(activeVideo.date)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default LivePerformances;