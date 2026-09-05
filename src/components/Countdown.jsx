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

const Countdown = ({ targetDate, label = "Event starts in" }) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="cd-countdown">
      <span className="cd-countdown-label">{label}</span>
      <div className="cd-countdown-grid">
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
  );
};

export default Countdown;