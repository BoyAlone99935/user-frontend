import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Events from "../components/Events";
import MeetAndGreet from "../components/MeetAndGreet";
import BookMeetAndGreetPitch from "../components/Bookmeetandgreetpitch";
import AboutCelebrity from "../components/AboutCelebrity";
import LivePerformances from "../components/LivePerformances";
import CelebrityFaq from "../components/CelebrityFaq";
import FansAlsoViewed from "../components/FanAlsoViewed";
import Footer from "../components/Footer";

const Celebrity = () => {
  const { slug } = useParams();
  const [celebrity, setCelebrity] = useState(null);
  const [loading, setLoading] = useState(true);
  
  localStorage.setItem("slug" , slug)

  useEffect(() => {
    const fetchCelebrity = async () => {
      try {
        const res = await fetch(
          `https://fan-platform-backend.onrender.com/api/celebrities/slug/${slug}`
        );

        const data = await res.json();

        setCelebrity(data.celebrity);
        console.log(data.celebrity)
      } catch (error) {
        console.error("Error fetching celebrity:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCelebrity();
    }
  }, [slug]);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
        <Navbar/>
        <Hero celebrity={celebrity} />
        <section className="celeb-tabs">

            <div className="tabs-wrapper">

                <a href="#events" className="active">
                    Events
                </a>

                <a href="#meet-greet">
                    Meet & Greet
                </a>

                <a href="#book-meet-greet">
                    Book Meet & Greet
                </a>

                <a href="#about">
                    About
                </a>

                <a href="#fans-also-viewed">
                    Fans Also Viewed
                </a>

            </div>

        </section>
       <Events/>
       <MeetAndGreet/>
       <BookMeetAndGreetPitch
        celebrityName={celebrity.name}
        celebrityImage={celebrity.profileImage}
        slug={slug}
      />
      <AboutCelebrity celebrity={celebrity} />
      <LivePerformances
        videos={celebrity.performanceVideos}
        celebrityName={celebrity.name}
      />
      <CelebrityFaq faqs={celebrity.faq} />
      <FansAlsoViewed currentSlug={slug} />
      <Footer/>
    </div>
  );
};

export default Celebrity;