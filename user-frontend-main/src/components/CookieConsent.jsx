import { useEffect, useState } from "react";

const CONSENT_KEY = "cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState({
    essential: true, // always on, can't be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${CONSENT_KEY}=`));

    if (!stored) setVisible(true);
  }, []);

  const saveConsent = (consent) => {
    // 1 year expiry
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `${CONSENT_KEY}=${JSON.stringify(
      consent
    )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    setVisible(false);
  };

  const acceptAll = () => {
    saveConsent({ essential: true, analytics: true, marketing: true });
  };

  const rejectNonEssential = () => {
    saveConsent({ essential: true, analytics: false, marketing: false });
  };

  const saveCustom = () => {
    saveConsent(prefs);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-banner-inner">

        {!showDetails ? (
          <>
            <div className="cookie-banner-text">
              <p>
                We use cookies to keep the platform running smoothly and,
                with your permission, to understand how it's used. You can
                accept everything, reject non-essential cookies, or choose
                exactly what you're comfortable with.
              </p>
            </div>

            <div className="cookie-banner-actions">
              <button
                type="button"
                className="cookie-btn-ghost"
                onClick={() => setShowDetails(true)}
              >
                Manage Preferences
              </button>
              <button
                type="button"
                className="cookie-btn-outline"
                onClick={rejectNonEssential}
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                className="cookie-btn-primary"
                onClick={acceptAll}
              >
                Accept All
              </button>
            </div>
          </>
        ) : (
          <div className="cookie-banner-details">

            <div className="cookie-pref-row">
              <div>
                <span className="cookie-pref-title">Essential</span>
                <span className="cookie-pref-desc">
                  Required for login, checkout, and core site function.
                  Cannot be turned off.
                </span>
              </div>
              <label className="cookie-toggle disabled">
                <input type="checkbox" checked disabled readOnly />
                <span className="cookie-toggle-track">
                  <span className="cookie-toggle-thumb" />
                </span>
              </label>
            </div>

            <div className="cookie-pref-row">
              <div>
                <span className="cookie-pref-title">Analytics</span>
                <span className="cookie-pref-desc">
                  Helps us understand how the platform is used, so we can
                  improve it.
                </span>
              </div>
              <label className="cookie-toggle">
                <input
                  type="checkbox"
                  checked={prefs.analytics}
                  onChange={(e) =>
                    setPrefs((p) => ({ ...p, analytics: e.target.checked }))
                  }
                />
                <span className="cookie-toggle-track">
                  <span className="cookie-toggle-thumb" />
                </span>
              </label>
            </div>

            <div className="cookie-pref-row">
              <div>
                <span className="cookie-pref-title">Marketing</span>
                <span className="cookie-pref-desc">
                  Used to show relevant offers and measure their
                  effectiveness.
                </span>
              </div>
              <label className="cookie-toggle">
                <input
                  type="checkbox"
                  checked={prefs.marketing}
                  onChange={(e) =>
                    setPrefs((p) => ({ ...p, marketing: e.target.checked }))
                  }
                />
                <span className="cookie-toggle-track">
                  <span className="cookie-toggle-thumb" />
                </span>
              </label>
            </div>

            <div className="cookie-banner-actions">
              <button
                type="button"
                className="cookie-btn-ghost"
                onClick={() => setShowDetails(false)}
              >
                Back
              </button>
              <button
                type="button"
                className="cookie-btn-primary"
                onClick={saveCustom}
              >
                Save Preferences
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default CookieConsent;