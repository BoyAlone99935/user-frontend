import { MapPin, Navigation } from "lucide-react";

const LocationSection = ({ meetAndGreet }) => {
  const location = meetAndGreet?.location;
  if (!location) return null;

  const fullAddress = [location.name, location.address, location.city, location.country]
    .filter(Boolean)
    .join(", ");

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    fullAddress
  )}`;

  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    fullAddress
  )}&output=embed`;

  return (
    <section id="location" className="mg-location">

      <div className="mg-about-label">
        <span className="mg-eyebrow">Where To Go</span>
        <h2>Location</h2>
      </div>

      <div className="mg-location-content">

        <div className="mg-location-details">
          <div className="mg-location-address">
            <MapPin size={18} />
            <div>
              <span className="mg-location-name">{location.name}</span>
              <span className="mg-location-line">
                {location.address}
                {location.address && <br />}
                {location.city}, {location.country}
              </span>
            </div>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mg-location-directions"
          >
            <Navigation size={15} />
            Get Directions
          </a>
        </div>

        <div className="mg-location-map">
          <iframe
            title="Venue location"
            src={embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

      </div>

    </section>
  );
};

export default LocationSection;