import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../Fans.css'

const MAX_SHOWN = 10;

// Fisher-Yates shuffle — unbiased, unlike sort(() => Math.random() - 0.5)
const shuffle = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const FansAlsoViewed = ({ currentSlug }) => {
  const navigate = useNavigate();

  const [celebrities, setCelebrities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCelebrities = async () => {
      try {
        const res = await fetch("https://fan-platform-backend.onrender.com/api/celebrities");
        const data = await res.json();

        const all = data.celebrities || [];
        const others = all.filter((c) => c.slug !== currentSlug);

        // shuffle first, THEN cap — capping before shuffling would always
        // show the same first N celebrities in whatever order the DB
        // returned them, defeating the point of shuffling at all
        const shuffled = shuffle(others).slice(0, MAX_SHOWN);

        setCelebrities(shuffled);
      } catch (error) {
        console.error("Error fetching celebrities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCelebrities();
  }, [currentSlug]);

  if (loading || celebrities.length === 0) return null;

  return (
    <section className="fv-section">

      <hr className="fv-divider" />

      <div className="fv-header">
        <h2>Fans Also Viewed</h2>
      </div>

      <div className="fv-grid">
        {celebrities.map((celeb, i) => (
          <button
            type="button"
            className="fv-card"
            key={celeb._id}
            style={{ "--tilt": `${(i % 2 === 0 ? 1 : -1) * 2}deg` }}
            onClick={() => navigate(`/celebrity/${celeb.slug}`)}
          >
            <div className="fv-photo">
              <img
                src={celeb.profileImage || "https://via.placeholder.com/300"}
                alt={celeb.name}
              />

              <div className="fv-overlay">
                <span className="fv-name">{celeb.name}</span>
                {celeb.category && (
                  <span className="fv-category">{celeb.category}</span>
                )}
                <span className="fv-view-link">
                  View Profile
                  <svg viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

    </section>
  );
};

export default FansAlsoViewed;