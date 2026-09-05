import React from 'react'
import EventHero from '../components/Eventhero'
import { useEffect , useState} from 'react'
import {useParams} from 'react-router-dom'
import '../Event.css'
import TicketSelector from '../components/TicketSelector'
import EventDetails from '../components/EventDetails'
import MoreFromArtist from '../components/MoreFromArtist'
import CookieConsent from '../components/CookieConsent'
import Policy from '../components/Policy'
import Loader from '../components/Loader'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Countdown from '../components/CountDown'
import EventFAQ from '../components/EventFaq'
const EventDet = () => {
  const [event , setEvent] = useState([])
  const [loading , setLoading] = useState(true)
  const {id} = useParams()
  useEffect(() => {
   const fetchEventDetails = async () => {
     setLoading(true)
     try {
      const eventDet = await fetch (`https://fan-platform-backend.onrender.com/api/v1/events/${id}`)
        const eventData = await eventDet.json();
        console.log(eventData)
        setEvent(eventData.event);
       setTimeout(() => {
        setLoading(false);
       }, 5000);
     } catch (err) {
      console.log(err)
      setLoading(false);
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
    loading ? <Loader overlay fullScreen={true} text="Finding Tickets" /> :
    <div>
      <Navbar/>
      <EventHero event = {event}/>
      <TicketSelector event = {event} onCheckout={handleCheckout}/>
      <EventDetails event = {event}/>
      <EventFAQ event = {event}/>
      {/* <Policy /> */}
      <MoreFromArtist currentEventId={id}/>
      <CookieConsent/>
    </div>
  )
}

export default EventDet