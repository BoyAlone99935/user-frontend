const WhatsIncluded = ({ meetAndGreet }) => {
  if (!meetAndGreet?.perks || meetAndGreet.perks.length === 0) return null;

  return (
    <section id="included" className="mg-included">

      <div className="mg-about-label">
        <span className="mg-eyebrow">What You Get</span>
        <h2>What's Included</h2>
      </div>

      <ol className="mg-included-list">
        {meetAndGreet.perks.map((perk, i) => (
          <li key={perk} className="mg-included-item">
            <span className="mg-included-index">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="mg-included-text">{perk}</span>
          </li>
        ))}
      </ol>

    </section>
  );
};

export default WhatsIncluded;