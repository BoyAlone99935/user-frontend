// src/components/loader/Loader.jsx
//
// One component, three ways to use it:
//
//   <Loader />                                inline spinner
//   <Loader size="lg" text="Loading tickets" />  inline, bigger, with label
//   <Loader overlay text="Loading Vantage" />     full-screen overlay
//   <Loader overlay fullScreen={false} />         overlay covering nearest
//                                                  parent with position: relative

import styles from "../Loader.module.css";

const SIZES = { sm: 28, md: 44, lg: 64 };

export default function Loader({
  size = "md",
  text,
  overlay = false,
  fullScreen = true,
  className = "",
}) {
  const px = typeof size === "number" ? size : SIZES[size] || SIZES.md;

  const spinner = (
    <div className={`${styles.wrap} ${className}`} role="status" aria-live="polite">
      <span className={styles.spinner} style={{ "--spinner-size": `${px}px` }}>
        <span className={styles.glow} />
        <span className={styles.track} />
        <span className={styles.arc} />
        <span className={styles.comet} />
      </span>
      {text && <span className={styles.text}>{text}</span>}
      <span className={styles.srOnly}>Loading{text ? `: ${text}` : ""}</span>
    </div>
  );

  if (!overlay) return spinner;

  return (
    <div className={`${styles.overlay} ${fullScreen ? styles.fullScreen : styles.contained}`}>
      {spinner}
    </div>
  );
}