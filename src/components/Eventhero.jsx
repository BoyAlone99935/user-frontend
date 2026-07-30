import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Share2, Heart } from "lucide-react";
import { useState } from "react";

const formatDateShort = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const getStartingPrice = (ticketTypes) => {
  if (!ticketTypes || ticketTypes.length === 0) return null;
  return Math.min(...ticketTypes.map((t) => t.price));
};

const scrollToTickets = () => {
  document.getElementById("ticket-selector")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const EventHeader = ({ event }) => {
  const [saved, setSaved] = useState(false);

  if (!event) return null;

  const startingPrice = getStartingPrice(event.ticketTypes);
  const celebrity =
    typeof event.celebrity === "object" ? event.celebrity : null;

  return (
    <header className="event-header-strip">
      <div className="event-header-inner">

        <div className="event-header-left">
          <img
            src={event.bannerImage}
            alt={event.title}
            className="event-header-thumb"
          />

          <div className="event-header-info">
            <h1>{event.title}</h1>

            {celebrity && (
              <Link
                to={celebrity.slug ? `/celebrity/${celebrity.slug}` : "#"}
                className="event-header-celebrity"
              >
                {celebrity.name}
              </Link>
            )}

            <div className="event-header-meta">
              <span>
                <CalendarDays size={14} />
                {formatDateShort(event.eventDate)} · {formatTime(event.eventDate)}
              </span>
              <span>
                <MapPin size={14} />
                {event.location?.name}, {event.location?.city}
              </span>
            </div>
          </div>
        </div>

        <div className="event-header-right">

          <div className="event-header-icon-actions">
            <button
              type="button"
              className={`event-header-icon-btn ${saved ? "active" : ""}`}
              onClick={() => setSaved((prev) => !prev)}
              aria-label="Save event"
            >
              <Heart size={17} fill={saved ? "currentColor" : "none"} />
            </button>
            <button
              type="button"
              className="event-header-icon-btn"
              aria-label="Share event"
            >
              <Share2 size={17} />
            </button>
          </div>

          {event.isSoldOut ? (
            <span className="event-header-badge sold-out">Sold Out</span>
          ) : (
            <>
              {startingPrice !== null && (
                <div className="event-header-price-block">
                  <span className="event-header-price">${startingPrice}</span>
                  <span className="event-header-price-label">from</span>
                </div>
              )}

              <button
                type="button"
                className="event-header-cta"
                onClick={scrollToTickets}
              >
                Get Tickets
              </button>
            </>
          )}

        </div>

      </div>
    </header>
  );
};

export default EventHeader;