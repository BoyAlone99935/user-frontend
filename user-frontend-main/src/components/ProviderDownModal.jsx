// src/components/checkout-flow/ProviderDownModal.jsx
//
// Usage inside CheckoutFlow:
//
//   const [providerDown, setProviderDown] = useState(false);
//
//   // wherever a provider call fails:
//   setProviderDown(true);
//
//   <ProviderDownModal
//     open={providerDown}
//     secondsLeft={secondsLeft}          // reuse the same hold timer state
//     onChangeMethod={() => {
//       setProviderDown(false);
//       setStep("review");               // send them back to pick a method
//     }}
//   />

import { CloudOff } from "lucide-react";
import styles from "../ProviderDownModal.module.css";

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ProviderDownModal({ open, secondsLeft, onChangeMethod }) {
  if (!open) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="provider-down-title">
      <div className={styles.modal}>
        <span className={styles.icon}>
          <CloudOff size={26} />
        </span>

        <h2 id="provider-down-title" className={styles.title}>
          This payment method is temporarily unavailable
        </h2>




        <p className={styles.body}>
            We're unable to connect to this payment provider at the moment. Your tickets are still reserved
            for{" "}
            <strong className={styles.countdown}>{formatTime(secondsLeft)}</strong>. To complete your
            purchase before your reservation expires, please choose one of the available payment methods
            below.
            </p>

        <button type="button" className={styles.changeBtn} onClick={onChangeMethod}>
          Change Payment Method
        </button>
      </div>
    </div>
  );
}