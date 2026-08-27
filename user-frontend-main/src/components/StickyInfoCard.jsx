import { useEffect, useState } from "react";

const getTimeRemaining = (targetDate) => {
  const total = new Date(targetDate).getTime() - Date.now();
  if (total <= 0) return null;

  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
};

const StickyInfoCard = ({ meetAndGreet, onReserve }) => {
  const [quantity, setQuantity] = useState(1);
  const [timeLeft, setTimeLeft] = useState(() =>
    getTimeRemaining(meetAndGreet.date)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(meetAndGreet.date));
    }, 1000);
    return () => clearInterval(interval);
  }, [meetAndGreet.date]);

  const remaining = Math.max(
    meetAndGreet.capacity - (meetAndGreet.bookedCount || 0),
    0
  );
  const isCritical = remaining > 0 && remaining <= 3;
  const isFull = remaining === 0;

  const changeQty = (delta) => {
    setQuantity((prev) => Math.min(Math.max(prev + delta, 1), remaining || 1));
  };

  const handleReserve = () => {
    if (onReserve) onReserve(quantity);
  };

  return (
    <div className="mg-info-card">

      <span className="mg-info-type">
        {meetAndGreet.type === "vip" ? "VIP Meet & Greet" : "Meet & Greet"}
      </span>

      <div className="mg-info-price">${meetAndGreet.price}</div>

      <p className={`mg-info-spots ${isCritical ? "critical" : ""}`}>
        {isFull
          ? "Fully booked"
          : isCritical
          ? `Only ${remaining} spot${remaining === 1 ? "" : "s"} left`
          : `${remaining} spots left`}
      </p>

      {!isFull && (
        <div className="mg-info-qty">
          <span>Quantity</span>
          <div className="mg-info-stepper">
            <button
              type="button"
              onClick={() => changeQty(-1)}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              onClick={() => changeQty(1)}
              disabled={quantity >= remaining}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className="mg-reserve-btn"
        disabled={isFull}
        onClick={handleReserve}
      >
        {isFull ? "Fully Booked" : "Reserve Spot"}
      </button>

      {timeLeft && (
        <div className="mg-countdown">
          <span className="mg-countdown-label">Event starts in</span>
          <div className="mg-countdown-grid">
            <div>
              <span>{String(timeLeft.days).padStart(2, "0")}</span>
              <small>days</small>
            </div>
            <div>
              <span>{String(timeLeft.hours).padStart(2, "0")}</span>
              <small>hrs</small>
            </div>
            <div>
              <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
              <small>min</small>
            </div>
            <div>
              <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
              <small>sec</small>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StickyInfoCard;