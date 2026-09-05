import { useNavigate } from "react-router-dom";
import { Ticket as TicketIcon, ChevronRight } from "lucide-react";

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const OrderCard = ({ purchase }) => {
  const navigate = useNavigate();

  const first = purchase.tickets[0];
  const total = purchase.tickets.reduce((sum, t) => sum + (t.amount || 0), 0);
  const isMeetGreet = first.bookingType === "meet_and_greet";

  return (
    <button
      type="button"
      className="order-card"
      onClick={() => navigate(`/my-tickets/${purchase.purchaseId}`)}
    >

      <div className="order-card-icon">
        <TicketIcon size={20} />
      </div>

      <div className="order-card-info">
        <span className="order-card-title">{first.title}</span>
        <span className="order-card-meta">
          {formatDate(first.date)} · {isMeetGreet ? "Meet & Greet" : "Event"}
        </span>
        <span className="order-card-id">Order #{purchase.purchaseId}</span>
      </div>

      <div className="order-card-right">
        <span className="order-card-count">
          {purchase.tickets.length} ticket{purchase.tickets.length !== 1 ? "s" : ""}
        </span>
        <span className="order-card-total">${total}</span>
      </div>

      <ChevronRight size={18} className="order-card-chevron" />

    </button>
  );
};

export default OrderCard;