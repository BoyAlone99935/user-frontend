import { QrCode } from "lucide-react";
import '../my-tickets.css'
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
};

const STATUS_LABELS = {
  active: "Active",
  used: "Used",
  completed: "Completed",
  cancelled: "Cancelled",
};

const TicketStub = ({ ticket }) => {
  const { date, time } = formatDate(ticket.date);
  const hasSeat = ticket.seat && (ticket.seat.section || ticket.seat.row || ticket.seat.number);
  const isMeetGreet = ticket.bookingType === "meet_and_greet";

  return (
    <div className={`tstub ${ticket.status !== "active" ? "inactive" : ""}`}>

      <div className="tstub-accent" />

      <div className="tstub-header">
        <div>
          <span className="tstub-eyebrow">
            {isMeetGreet ? "Meet & Greet" : "Event Ticket"}
          </span>
          <h3>{ticket.title}</h3>
        </div>
        <span className={`tstub-status ${ticket.status}`}>
          {STATUS_LABELS[ticket.status] || ticket.status}
        </span>
      </div>

      <div className="tstub-meta">
        <div>
          <span className="tstub-meta-label">Date &amp; Time</span>
          <span className="tstub-meta-value">{date}</span>
          <span className="tstub-meta-value">{time}</span>
        </div>
        <div>
          <span className="tstub-meta-label">Venue</span>
          <span className="tstub-meta-value">{ticket.location?.name || "-"}</span>
          <span className="tstub-meta-sub">
            {[ticket.location?.city, ticket.location?.country].filter(Boolean).join(", ")}
          </span>
        </div>
      </div>

      {!isMeetGreet && (
        <div className="tstub-stats">
          {hasSeat ? (
            <>
              <div className="tstub-stat">
                <span>Section</span>
                <strong>{ticket.seat?.section || "-"}</strong>
              </div>
              <div className="tstub-stat">
                <span>Row</span>
                <strong>{ticket.seat?.row || "-"}</strong>
              </div>
              <div className="tstub-stat">
                <span>Seat</span>
                <strong>{ticket.seat?.number || "-"}</strong>
              </div>
            </>
          ) : (
            <div className="tstub-stat wide">
              <span>Admission</span>
              <strong>General Admission</strong>
            </div>
          )}
        </div>
      )}

      {isMeetGreet && ticket.category && (
        <div className="tstub-stats">
          <div className="tstub-stat wide">
            <span>Experience</span>
            <strong>{ticket.category}</strong>
          </div>
        </div>
      )}

      <div className="tstub-perforation">
        <span className="tstub-notch left" />
        <span className="tstub-dashes" />
        <span className="tstub-notch right" />
      </div>

      <div className="tstub-stub">
        <div>
          <span className="tstub-meta-label">Ticket Number</span>
          <span className="tstub-number">{ticket.ticketNumber}</span>
          <p className="tstub-note">Present this at the entrance. One scan per ticket.</p>
        </div>

        <div className="tstub-qr">
          {ticket.qrCode ? (
            <img src={ticket.qrCode} alt={`QR code for ${ticket.ticketNumber}`} />
          ) : (
            <QrCode size={64} strokeWidth={1} />
          )}
        </div>
      </div>

    </div>
  );
};

export default TicketStub;