import { useEffect, useState } from "react";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const initial = user?.username?.[0]?.toUpperCase() || "?";

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };

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
            <li>
              <Link to="/my-tickets">My Tickets</Link>
            </li>
          </ul>

          <div className="nav-actions">
            {user ? (
              <div className="user-chip">
                <span className="user-avatar">{initial}</span>
                <span className="user-name">{user.username}</span>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button className="login-btn">Login</button>
                <button className="join-btn">Join Fanbase</button>
              </>
            )}
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

        {user && (
          <div className="mobile-user">
            <span className="user-avatar">{initial}</span>
            <div className="mobile-user-info">
              <span className="mobile-user-label">Signed in as</span>
              <span className="mobile-user-name">{user.username}</span>
            </div>
          </div>
        )}

        <div className="mobile-links">
          <a href="#events" onClick={() => setMenuOpen(false)}>Events</a>
          <a href="#meet" onClick={() => setMenuOpen(false)}>Meet & Greet</a>
          <a href="#vip" onClick={() => setMenuOpen(false)}>VIP Meet & Greet</a>
          <a href="#viewed" onClick={() => setMenuOpen(false)}>Fans Also Viewed</a>
        </div>

        <div className="mobile-buttons">
          {user ? (
            <button className="login-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <button className="login-btn">Login</button>
              <button className="join-btn">Join Fanbase</button>
            </>
          )}
        </div>

      </aside>
    </>
  );
};

export default Navbar;