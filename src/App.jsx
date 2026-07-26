import {Routes , Route} from "react-router-dom";
import Home from "./Pages/Home";
import Celebrity from "./Pages/Celebrity";
import './App.css'
import './index.css'
import EventList from "./Pages/EventList";
function App() {
 
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/celebrity/:slug" element={<Celebrity/>} />
        <Route
        path="/celebrity/:slug/events"
        element={<EventList />}
      />

    </Routes>
  )
}

export default App


