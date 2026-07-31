import { useEffect, useState } from "react";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import { useAuth } from "./AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const {user} = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={scrolled ? "scrolled" : ""}>
        <div className="navbar-container">

          <div className="logo">
            <span className="logo-dot"></span>
            Spotlight
          </div>

          <ul className="nav-links">
            <li><a href="#events">Events</a></li>
            <li><a href="#meet">Meet & Greet</a></li>
            <li><a href="#vip">VIP Meet & Greet</a></li>
            <li><a href="#viewed">Fans Also Viewed</a></li>
          </ul>

          <div className="nav-actions">
            <button className="login-btn">
              Login
            </button>

            <button className="join-btn">
              Join Fanbase
            </button>
          </div>

          <button
            className="menu-btn"
            onClick={() => setMenuOpen(true)}
          >
            <HiOutlineMenuAlt3 />
          </button>

        </div>
      </nav>

      <div
        className={`overlay ${menuOpen ? "show-overlay" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      <aside className={`mobile-menu ${menuOpen ? "show-menu" : ""}`}>

        <div className="mobile-top">

          <h2>Spotlight</h2>

          <button onClick={() => setMenuOpen(false)}>
            <HiOutlineX />
          </button>

        </div>

        <div className="mobile-links">
          <a href="#events" onClick={() => setMenuOpen(false)}>Events</a>
          <a href="#meet" onClick={() => setMenuOpen(false)}>Meet & Greet</a>
          <a href="#vip" onClick={() => setMenuOpen(false)}>VIP Meet & Greet</a>
          <a href="#viewed" onClick={() => setMenuOpen(false)}>Fans Also Viewed</a>
        </div>

        <div className="mobile-buttons">
          <button className="login-btn">
            Login
          </button>

          <button className="join-btn">
            Join Fanbase
          </button>
        </div>

      </aside>
    </>
  );
};

export default Navbar;