import React from 'react'
import EventHero from '../components/Eventhero'
import { useEffect , useState} from 'react'
import {useParams} from 'react-router-dom'
import '../Event.css'
import TicketSelector from '../components/TicketSelector'
import EventDetails from '../components/EventDetails'
import MoreFromArtist from '../components/MoreFromArtist'
const CheckOut = () => {
  const [event , setEvent] = useState([])
  const {id} = useParams()
  useEffect(() => {
   const fetchEventDetails = async () => {
     try {
      const eventDet = await fetch (`https://fan-platform-backend.onrender.com/api/v1/events/${id}`)
        const eventData = await eventDet.json();
        console.log(eventData)
        setEvent(eventData.event);
     } catch (err) {
      console.log(err)
     }
   }

   fetchEventDetails()
  }, []);

  const handleCheckout = () => {
  if (onCheckout) {
    onCheckout(selectedItems);
  } else {
    console.log("Proceeding to checkout with:", selectedItems);
  }
};
  return (
    <div>
      <EventHero event = {event}/>
      <TicketSelector event = {event} onCheckout={handleCheckout}/>
      <EventDetails event = {event}/>
      <MoreFromArtist/>
    </div>
  )
}

export default CheckOut