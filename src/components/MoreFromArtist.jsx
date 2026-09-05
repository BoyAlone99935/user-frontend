import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, MapPin } from "lucide-react";
import {useParams} from 'react-router-dom'
const formatDateShort = (dateStr) => {
 
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const getStartingPrice = (ticketTypes) => {
  if (!ticketTypes || ticketTypes.length === 0) return null;
  return Math.min(...ticketTypes.map((t) => t.price));
};

const formatMoney = (amount) => {
  return Number(amount).toLocaleString("en-US");
};


const MoreFromArtist = ({currentEventId }) => {
  const {celebid} = useParams()
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `https://fan-platform-backend.onrender.com/api/v1/events/getEvents/${celebid}`
        );
        const data = await res.json();

        const others = (data.events || []).filter(
          (event) => event._id !== currentEventId
        );

        setEvents(others);
      } catch (error) {
        console.error("Error fetching more events:", error);
      } finally {
        setLoading(false);
      }
    };

    if (celebid) fetchEvents();
  }, [celebid , currentEventId]);

  if (loading || events.length === 0) return null;

  return (
    <section className="mfa-section">

      <div className="mfa-header">
        <h2>More From This Artist</h2>
      </div>

      <div className="mfa-grid">
        {events.map((event) => {
          const startingPrice = getStartingPrice(event.ticketTypes);

          return (
            <button
              type="button"
              className="mfa-card"
              key={event._id}
              onClick={() => navigate(`/events/${event._id}`)}
            >
              <img
                src={event.bannerImage}
                alt={event.title}
                className="mfa-card-image"
              />

              <div className="mfa-card-body">
                <h3>{event.title}</h3>

                <div className="mfa-card-meta">
                  <span>
                    <CalendarDays size={13} />
                    {formatDateShort(event.eventDate)}
                  </span>
                  <span>
                    <MapPin size={13} />
                    {event.location?.city}
                  </span>
                </div>

                {startingPrice !== null && !event.isSoldOut ? (
                  <span className="mfa-card-price">From ${formatMoney(startingPrice)}</span>
                ) : (
                  event.isSoldOut && (
                    <span className="mfa-card-soldout">Sold Out</span>
                  )
                )}
              </div>
            </button>
          );
        })}
      </div>

    </section>
  );
};

export default MoreFromArtist;