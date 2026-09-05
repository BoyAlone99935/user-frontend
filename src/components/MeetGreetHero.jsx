import { useNavigate, Link } from "react-router-dom";
import { CalendarDays, Clock, MapPin } from "lucide-react";

const formatDateLong = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const MeetGreetHero = ({ meetAndGreet, celebrity }) => {
  const navigate = useNavigate();

  return (
    <div className="mgh-wrap">

      <button type="button" className="mgh-back" onClick={() => navigate(-1)}>
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M12.5 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>

      <h1>{meetAndGreet.title}</h1>

      {celebrity && (
        <Link
          to={celebrity.slug ? `/celebrity/${celebrity.slug}` : "#"}
          className="mgh-celebrity"
        >
          with {celebrity.name}
        </Link>
      )}

      {meetAndGreet.description && (
        <p className="mgh-description">{meetAndGreet.description}</p>
      )}

      {meetAndGreet.images?.[0] && (
        <img
          src={meetAndGreet.images[0]}
          alt={meetAndGreet.title}
          className="mgh-photo"
        />
      )}

      <div className="mgh-meta">
        <span>
          <CalendarDays size={15} />
          {formatDateLong(meetAndGreet.date)}
        </span>
        <span>
          <Clock size={15} />
          {formatTime(meetAndGreet.date)}
        </span>
        <span>
          <MapPin size={15} />
          {meetAndGreet.location?.name}
          {meetAndGreet.location?.city ? `, ${meetAndGreet.location.city}` : ""}
        </span>
      </div>

    </div>
  );
};

export default MeetGreetHero;