import {Routes , Route} from "react-router-dom";
import Home from "./Pages/Home";
import Celebrity from "./Pages/Celebrity";
import './App.css'
import './index.css'
import EventList from "./Pages/EventList";
import EventDet from './Pages/EventDet'
import CheckoutFlow from "./Pages/CheckOut";
import AuthPage from "./Pages/Auth";
import MeetGreetPage from "./Pages/MeetgreetPage";
import MyTicketsPage from "./components/MyTickets";
import Purchase from "../../src/components/Purchase";
function App() {
 
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/celebrity/:slug" element={<Celebrity/>} />
        <Route
        path="/celebrity/:slug/events"
        element={<EventList />}
      />
       <Route
        path="/event/:id/:celebid/"
        element={<EventDet/>}
      />

         <Route
        path="/checkout"
        element={<CheckoutFlow/>}
      />

       <Route
        path="/auth"
        element={<AuthPage/>}
      />
      
      <Route
        path="/celebrity/:slug/meet-and-greets/:id"
        element={<MeetGreetPage/>}
      />

      <Route
        path="/my-tickets"
        element={<MyTicketsPage/>}
      />
      

      <Route path="/my-tickets/:purchaseId" element={<Purchase />} />
      
    </Routes>
  )
}

export default App


