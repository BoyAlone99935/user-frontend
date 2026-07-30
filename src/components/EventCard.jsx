import { CalendarDays, MapPin, } from "lucide-react";
import Ticket from '../assets/ticket.png'
import Events from "./Events";
import {useNavigate} from 'react-router-dom'
const EventCard = ({ event }) => {
  const navigate = useNavigate()
  const lowestPrice = Math.min(
    ...event.ticketTypes.map(ticket => ticket.price)
  );
  console.log(event)
  return (
    <article className="event-card">

      <div className="event-image">

        <img
          src={event.bannerImage}
          alt={event.title}
        />

        <span className="event-date">
          <CalendarDays size={15} />
          {new Date(event.eventDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>

      </div>

      <div className="event-body">

        <h3>{event.title}</h3>

        <p className="event-location">
          <MapPin size={16} />
          {event.location.name}
        </p>

        <div className="ticket-types">

          {event.ticketTypes.map(ticket => (
            <span key={ticket._id}>
              {ticket.category}
            </span>
          ))}

        </div>

        <div className="event-footer">

          <div>

            <small>Starting From</small>

            <h2>${lowestPrice}</h2>

          </div>

          <button onClick={() => navigate(`/event/${event._id}/${event.celebrity}`)}>

           <img src={Ticket} alt="" style={{width:"20px"}}/>

            Buy Tickets

          </button>

        </div>

      </div>

    </article>
  );
};

export default EventCard;