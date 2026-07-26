import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MeetCard from "./MeetCard";
import "../Meet.css";
import '../Fans.css'

const MeetAndGreet = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  const trackRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const celebrityRes = await fetch(
          `https://fan-platform-backend.onrender.com/api/celebrities/slug/${slug}`
        );
        const celebrityData = await celebrityRes.json();

       
        const experienceRes = await fetch(
          `https://fan-platform-backend.onrender.com/api/v1/meet-and-greets/getAll/${celebrityData.celebrity._id}`
        );
        const experienceData = await experienceRes.json();
        console.log("about to log experience data")
        console.log(experienceData)
        
        setExperiences(experienceData.meetAndGreet || []);
      } catch (error) {
        console.error("Error fetching experiences:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  const scrollByCard = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(".meet-card");
    const cardWidth = card ? card.offsetWidth + 24 : 360;
    track.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  if (loading) {
    return <h2>Loading Exclusive Experiences...</h2>;
  }

  const preview = experiences.slice(0, 6);

  return (
    <section id="exclusive-experiences" className="meet-section">
       <hr className="fv-divider" />
      <div className="section-headers">

        <div>
          <span className="meet-eyebrow">✦ Money Can't Buy This</span>
          <h2>Exclusive Experiences</h2>
          <p>
            Purchase tickets for premium fan experiences, including meet &
            greets, VIP access and exclusive opportunities.
          </p>
        </div>

        {/*experiences.length > 0 && (
          <button
            className="meet-more-btn"
            onClick={() => navigate(`/celebrity/${slug}/meet-and-greets`)}
          >
            View All
          </button>
        )*/}

      </div>

      {preview.length === 0 ? (
        <div className="empty-events">
          <h3>No Exclusive Experiences</h3>
          <p>
            There are currently no exclusive experiences available for this
            celebrity.
          </p>
        </div>
      ) : (
        <div className="meet-slider">

          <button
            type="button"
            className="meet-nav meet-nav-prev"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous"
          >
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M12.5 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="meet-track" ref={trackRef}>
            {preview.map((experience) => (
              <MeetCard key={experience._id} meet={experience} slug={slug} />
            ))}
            <div className="meet-track-end-spacer" />
          </div>

          <button
            type="button"
            className="meet-nav meet-nav-next"
            onClick={() => scrollByCard(1)}
            aria-label="Next"
          >
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M7.5 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

        </div>
      )}

    </section>
  );
};

export default MeetAndGreet;