import { FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import '../About.css'
import '../Fans.css'
const AboutCelebrity = ({ celebrity }) => {
  return (
    <section className="about-section" style={{marginBottom:"2rem"}}>
      <hr className="fv-divider" />
      <div className="about-layout">

        {celebrity?.coverImage && (
          <div className="about-photo">
            <img src={celebrity.coverImage} alt={celebrity?.name} />
          </div>
        )}

        <div className="about-content">

          <h2>About {celebrity?.name}</h2>

          <p className="about-bio">{celebrity?.bio}</p>

          {celebrity?.socialLinks && (
            <div className="about-socials">
              {celebrity.socialLinks.instagram && (
                <a
                  href={celebrity.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
              )}

              {celebrity.socialLinks.twitter && (
                <a
                  href={celebrity.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X / Twitter"
                >
                  <FaXTwitter />
                </a>
              )}

              {celebrity.socialLinks.youtube && (
                <a
                  href={celebrity.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                >
                  <FaYoutube />
                </a>
              )}
            </div>
          )}

        </div>

      </div>

    </section>
  );
};

export default AboutCelebrity;