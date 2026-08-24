import { CalendarDays, MapPin, } from "lucide-react";
import Ticket from '../assets/ticket.png'
import Events from "./Events";
import {useNavigate , useLocation} from 'react-router-dom'
import { useAuth } from "./AuthContext";
const EventCard = ({ event }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const lowestPrice = Math.min(
    ...event.ticketTypes.map(ticket => ticket.price)
  );
  console.log(event)
  const {user} = useAuth()

  console.log(user)
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

          <button onClick={() => {
            user !== null ? navigate(`/event/${event._id}/${event.celebrity}`) : navigate('/auth' , {
              state : {
                from : location
              }
            })
          }}>

           <img src={Ticket} alt="" style={{width:"20px"}}/>

            Buy Tickets

          </button>

        </div>

      </div>

    </article>
  );
};

export default EventCard;