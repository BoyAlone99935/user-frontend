import { useNavigate } from "react-router-dom";
import { CalendarDays, MapPin, Sparkles } from "lucide-react";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const MeetCard = ({ meet, slug }) => {
  const navigate = useNavigate();

  const {
    _id,
    title,
    type,
    price,
    capacity,
    bookedCount,
    date,
    location,
    images,
    perks,
  } = meet;

  const coverImage = images?.[0] || "https://via.placeholder.com/500x650";
  const spotsLeft = capacity - (bookedCount || 0);
  const isVip = type === "vip";
  const isLowAvailability = spotsLeft > 0 && spotsLeft <= 5;
  const isFull = spotsLeft <= 0;

  return (
    <div className={`meet-card ${isVip ? "meet-card-vip" : ""}`}>

      <div
        className="meet-card-image"
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        <span className={`meet-badge ${isVip ? "vip" : "regular"}`}>
          {isVip ? "✦ VIP Access" : "Meet & Greet"}
        </span>

        {isLowAvailability && (
          <span className="meet-scarcity-badge">
            Only {spotsLeft} spot{spotsLeft === 1 ? "" : "s"} left
          </span>
        )}
        {isFull && <span className="meet-scarcity-badge full">Sold Out</span>}

        <div className="meet-card-overlay">

          <h3>{title}</h3>

          <div className="meet-meta">
            <span>
              <CalendarDays size={15} />
              {formatDate(date)}
            </span>
            <span>
              <MapPin size={15} />
              {location?.city}
            </span>
          </div>

          {perks?.length > 0 && (
            <div className="meet-perks-row">
              {perks.slice(0, 2).map((perk) => (
                <span key={perk} className="meet-perk-tag">
                  <Sparkles size={12} />
                  {perk}
                </span>
              ))}
              {perks.length > 2 && (
                <span className="meet-perk-tag meet-perk-more">
                  +{perks.length - 2} more
                </span>
              )}
            </div>
          )}

          <div className="meet-card-footer">
            <div className="meet-price-block">
              <span className="meet-price">${price}</span>
              <span className="meet-price-label">per fan</span>
            </div>

            <button
              type="button"
              className="meet-reserve-btn"
              disabled={isFull}
              onClick={() =>
                navigate(`/celebrity/${slug}/meet-and-greets/${_id}`)
              }
            >
              {isFull ? "Sold Out" : "Reserve Spot"}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default MeetCard;