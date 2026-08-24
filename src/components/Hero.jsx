import { FaInstagram, FaYoutube, FaStar } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { CalendarDays, Handshake, TicketIcon } from "lucide-react";
import Ticket from '../assets/ticket.png'
import Networking from '../assets/networking.png'
const Hero = ({ celebrity }) => {
  // rating/reviewCount are optional — falls back gracefully if your data
  // doesn't have them yet
  const rating = celebrity.rating ?? 4.8;
  const reviewCount = celebrity.reviewCount ?? null;
  const truncate = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.slice(0, maxLength)}...`
      : text;
  };

  return (
    <section className="hero">

      <div
        className="hero-banner"
        style={{
          backgroundImage: `url(${celebrity.coverImage})`,
        }}
      >
        <div className="hero-content">

          <div className="hero-identity">
            <img
              src={celebrity.profileImage}
              alt={celebrity.name}
              className="profile-image"
            />
          </div>

          <div className="hero-text">

            <div className="hero-name">
              <h1>{celebrity.name}</h1>

              <span className="verified-badge">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="#1D9BF0"
                >
                  <path d="M22 12l-2.09-2.28.29-3.06-3-.68-1.57-2.63L12 4.5 8.37 3.35 6.8 5.98l-3 .68.29 3.06L2 12l2.09 2.28-.29 3.06 3 .68 1.57 2.63L12 19.5l3.63 1.15 1.57-2.63 3-.68-.29-3.06L22 12zm-11 3.2l-3-3 1.41-1.41L11 12.38l4.59-4.59L17 9.2l-6 6z" />
                </svg>
              </span>
            </div>

            <div className="hero-tags">
              <p className="category-pill">{celebrity.category}</p>
            </div>

            <div>
              <p className="hero-bio">
                {truncate(celebrity.bio, 180)}
              </p>
            </div>

            <div className="hero-actions">

              <button className="events-btn">
                <img src={Ticket} alt="Ticket" style={{width:"20px"}}/>
                <span>View Events</span>
              </button>

              <button className="meet-btn">
                 <img src={Networking} alt="Ticket" style={{width:"20px"}}/>
                <span>Book Meet & Greet</span>
              </button>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
};

export default Hero;