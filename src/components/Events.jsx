import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EventCard from "./EventCard";

const Events = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch celebrity first
        const celebrityRes = await fetch(
          `https://fan-platform-backend.onrender.com/api/celebrities/slug/${slug}`
        );

        const celebrityData = await celebrityRes.json();

        // Fetch events using celebrity ID
        const eventsRes = await fetch(
          `https://fan-platform-backend.onrender.com/api/v1/events/getEvents/${celebrityData.celebrity._id}`
        );

        const eventsData = await eventsRes.json();

        setEvents(eventsData.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  if (loading) {
    return <h2>Loading events...</h2>;
  }

  return (
    <section id="events" className="events-section">

      <div className="section-header">
      

        <div className="section-heading">
            <span className="section-eyebrow">✦ Live Now</span>
            <h2>
                Upcoming <span className="gradient-text">Events</span>
            </h2>
            <p>Discover upcoming performances and live shows.</p>
        </div>

        {events.length > 0 && (
          <button
            onClick={() => navigate(`/celebrity/${slug}/events`)}
          >
            More
          </button>
        )}
      </div>

      <div className="events-grid">
        {events.length === 0 ? (
          <div className="empty-events">
            <h3>No Upcoming Events</h3>
            <p>This celebrity doesn't have any scheduled events yet.</p>
          </div>
        ) : (
          events
            .slice(0, 3)
            .map((event) => (
              <EventCard
                key={event._id}
                event={event}
              />
            ))
        )}
      </div>

    </section>
  );
};

export default Events;