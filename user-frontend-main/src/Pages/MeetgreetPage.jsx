import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MeetGreetHero from "../components/MeetGreetHero";
import AnchorNav from "../components/Anchornav";
import AboutSection from "../components/AboutSection";
import WhatsIncluded from "../components/WhatsIncluded";
import HowItWorks from "../components/HowItWorks";
import Navbar from "../components/Navbar";
import Gallery from "../components/Gallery";
import LocationSection from "../components/EventLocation";
import "../meet-greet-hero.css";

// assumed mount path, matching your other v1 routers — adjust if different
const API_BASE = "https://fan-platform-backend.onrender.com/api/v1/meet-and-greets";

const MeetGreetPage = () => {
  const { id } = useParams();

  const [meetAndGreet, setMeetAndGreet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMeetAndGreet = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${API_BASE}/get/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Meet & greet not found");
        }

        setMeetAndGreet(data.meetAndGreet);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMeetAndGreet();
  }, [id]);

  if (loading) {
    return (
      <div className="mg-page-status">
        <p>Loading experience...</p>
      </div>
    );
  }

  if (error || !meetAndGreet) {
    return (
      <div className="mg-page-status">
        <p>{error || "We couldn't find this experience."}</p>
      </div>
    );
  }

  const celebrity =
    typeof meetAndGreet.celebrity === "object" ? meetAndGreet.celebrity : null;

  return (
    <div className="mg-page">
      
      <MeetGreetHero meetAndGreet={meetAndGreet} celebrity={celebrity} />
      <AnchorNav/>
      <AboutSection meetAndGreet={meetAndGreet} />
      <WhatsIncluded meetAndGreet={meetAndGreet} />
      <HowItWorks/>
      <Gallery meetAndGreet={meetAndGreet} />
      <LocationSection meetAndGreet={meetAndGreet} />
    </div>
  );
};

export default MeetGreetPage;