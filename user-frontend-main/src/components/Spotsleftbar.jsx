import { Flame, Users } from "lucide-react";

const SpotsLeftBar = ({ capacity, bookedCount = 0 }) => {
  const remaining = Math.max(capacity - bookedCount, 0);
  const percentRemaining = capacity > 0 ? (remaining / capacity) * 100 : 0;

  let severity = "normal";
  if (remaining === 0) severity = "full";
  else if (percentRemaining <= 15) severity = "critical";
  else if (percentRemaining <= 50) severity = "low";

  const messages = {
    normal: `${remaining} spots available`,
    low: `Filling fast — ${remaining} spots left`,
    critical: `Only ${remaining} spot${remaining === 1 ? "" : "s"} left`,
    full: "Fully booked",
  };

  return (
    <div className={`mg-spots-bar ${severity}`}>
      <div className="mg-spots-bar-top">
        <span className="mg-spots-bar-text">
          {severity === "critical" && <Flame size={15} />}
          {severity !== "critical" && <Users size={15} />}
          {messages[severity]}
        </span>
        <span className="mg-spots-bar-count">
          {bookedCount} / {capacity} booked
        </span>
      </div>

      <div className="mg-spots-bar-track">
        <div
          className="mg-spots-bar-fill"
          style={{ width: `${Math.min((bookedCount / capacity) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default SpotsLeftBar;