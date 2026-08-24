import { MapPin, Navigation } from "lucide-react";

const EventDetails = ({ event }) => {
  if (!event) return null;

  const { description, location } = event;

  const fullAddress = [
    location?.name,
    location?.address,
    location?.city,
    location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    fullAddress
  )}`;

  return (
    <section className="ed-section">

      <div className="ed-layout">

        <div className="ed-about">
          <h2>About This Event</h2>
          <p>{description || "No description available for this event yet."}</p>
        </div>

        <div className="ed-venue-card">
          <h3>Venue</h3>

          <div className="ed-venue-info">
            <MapPin size={16} />
            <div>
              <span className="ed-venue-name">{location?.name}</span>
              <span className="ed-venue-address">
                {location?.address}
                {location?.address && <br />}
                {location?.city}, {location?.country}
              </span>
            </div>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="ed-directions-btn"
          >
            <Navigation size={15} />
            Get Directions
          </a>
        </div>

      </div>

    </section>
  );
};

export default EventDetails;