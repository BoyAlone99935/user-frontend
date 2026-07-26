import { FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">

      <div className="footer-top">

        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-dot"></span>
            Spotlight
          </div>
          <p>
            Book real experiences with the artists you love — tickets, meet
            &amp; greets, and access no one else offers.
          </p>

          <div className="footer-socials">
            <a href="#" target="_blank" rel="noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" target="_blank" rel="noreferrer" aria-label="X / Twitter">
              <FaXTwitter />
            </a>
            <a href="#" target="_blank" rel="noreferrer" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>

        <div className="footer-links">

          <div className="footer-column">
            <h4>Explore</h4>
            <Link to="/celebrities">All Celebrities</Link>
            <Link to="/events">Events</Link>
            <Link to="/meet-and-greets">Meet &amp; Greets</Link>
            <Link to="/merchandise">Merchandise</Link>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/press">Press</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-column">
            <h4>Support</h4>
            <Link to="/help">Help Center</Link>
            <Link to="/faq">FAQs</Link>
            <Link to="/refunds">Refund Policy</Link>
            <Link to="/trust-safety">Trust &amp; Safety</Link>
          </div>

        </div>

      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <p>© {year} Spotlight. All rights reserved.</p>

        <div className="footer-legal-links">
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/cookies">Cookie Policy</Link>
        </div>
      </div>

    </footer>
  );
};

export default Footer;