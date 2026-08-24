import { useState } from "react";
import { useAuth } from "../components/AuthContext";
import GoogleButton from "../components/GoogleButton";
import {useNavigate , useLocation} from 'react-router-dom'
import styles from "../Auth.module.css";

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Generates a display-only serial number for the ticket motif. Purely cosmetic.
function useSerial() {
  const [serial] = useState(() =>
    Math.random().toString(36).slice(2, 8).toUpperCase()
  );
  return serial;
}

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const { login, signup, loginWithGoogle, pending, error, clearError } = useAuth();
  const navigate = useNavigate()
  const location = useLocation()
  const serial = useSerial();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (fieldErrors[key]) setFieldErrors((fe) => ({ ...fe, [key]: null }));
  }

  function validate() {
    const errs = {};
    if (mode === "signup" && !form.name.trim()) errs.name = "Enter your name.";
    if (!form.email.trim()) errs.email = "Enter your email.";
    else if (!validateEmail(form.email)) errs.email = "That email doesn't look right.";
    if (!form.password) errs.password = "Enter a password.";
    else if (mode === "signup" && form.password.length < 8) {
      errs.password = "Use at least 8 characters.";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
                await signup({
        username: form.name,
        email: form.email,
        password: form.password,
});
      }
      const from = location.state?.from?.pathname || "/";
    navigate(from, { replace: true });
    } catch {
      // error is already captured in context's `error` state
    }
  }

  function handleGoogleClick() {
    window.location.href =
    "https://fan-platform-backend.onrender.com/api/auth/google";
  }

  function switchMode() {
    clearError();
    setFieldErrors({});
    setMode((m) => (m === "login" ? "signup" : "login"));
  }

  return (
    <div className={styles.page}>
      <aside className={styles.brandPanel}>
        <div>
          <span className={styles.eyebrow}>Admit One</span>
          <div className={styles.brandMark} style={{ marginTop: "0.6rem" }}>
            Vantage
          </div>
        </div>

        <div className={styles.heroCopy}>
          <h1 className={styles.heroTitle}>
            Every great night <em>starts</em> with a good seat.
          </h1>
          <p className={styles.heroSub}>
            Sign in to hold your place at the shows, openings, and
            evenings worth clearing your calendar for.
          </p>
        </div>

        <div className={styles.stubFooter}>
          <div className={styles.stubStat}>
            <span>Access</span>
            <span>All venues</span>
          </div>
          <div className={styles.stubStat}>
            <span>Transfer</span>
            <span>Unrestricted</span>
          </div>
          <div className={styles.stubStat}>
            <span>Valid</span>
            <span>Tonight</span>
          </div>
        </div>
      </aside>

      <main className={styles.formPanel}>
        <form className={styles.ticket} onSubmit={handleSubmit} noValidate>
          <div className={styles.ticketHead}>
            <span className={styles.admitOne}>
              {mode === "login" ? "Returning guest" : "New guest"}
            </span>
            <span className={styles.serial}>No. {serial}</span>
          </div>

          <h2 className={styles.formTitle}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className={styles.formSub}>
            {mode === "login"
              ? "Sign in to view your tickets and upcoming events."
              : "Takes under a minute — no ticket left behind."}
          </p>

          {error && (
            <div className={styles.formError} role="alert">
              {error}
            </div>
          )}

          {mode === "signup" && (
            <div className={`${styles.field} ${fieldErrors.name ? styles.invalid : ""}`}>
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Ada Lovelace"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
              {fieldErrors.name && <span className={styles.fieldError}>{fieldErrors.name}</span>}
            </div>
          )}

          <div className={`${styles.field} ${fieldErrors.email ? styles.invalid : ""}`}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
            {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
          </div>

          <div className={`${styles.field} ${fieldErrors.password ? styles.invalid : ""}`}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder={mode === "login" ? "Your password" : "At least 8 characters"}
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
            />
            {fieldErrors.password && <span className={styles.fieldError}>{fieldErrors.password}</span>}
          </div>

          {mode === "login" && (
            <div className={styles.rowBetween}>
              <label className={styles.checkboxRow}>
                <input type="checkbox" defaultChecked />
                Keep me signed in
              </label>
              <button type="button" className={styles.linkButton}>
                Forgot password?
              </button>
            </div>
          )}

          <button type="submit" className={styles.submit} disabled={pending}>
            {pending
              ? mode === "login" ? "Signing in…" : "Creating account…"
              : mode === "login" ? "Sign in" : "Create account"}
          </button>

          <div className={styles.divider}>or</div>

          <GoogleButton onClick={handleGoogleClick} disabled={pending} />

          <p className={styles.switchRow}>
            {mode === "login" ? "New here?" : "Already have an account?"}{" "}
            <button type="button" className={styles.linkButton} onClick={switchMode}>
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>

          <div className={styles.barcode} aria-hidden="true" />
        </form>
      </main>
    </div>
  );
}