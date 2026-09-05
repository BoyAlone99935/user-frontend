import { MapPin, Navigation } from "lucide-react";
import LocationSection from "./EventLocation";
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

        <div>
          

          <div>
            <MapPin size={16} />
            <div>
              <LocationSection meetAndGreet={event} />
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};

export default EventDetails;