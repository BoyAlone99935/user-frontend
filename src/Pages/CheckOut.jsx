// src/components/checkout-flow/CheckoutFlow.jsx
//
// Expects to be navigated to with ticket data in router state, from
// wherever the user hit "Checkout" (e.g. your TicketSelector's onCheckout):
//
//   navigate("/checkout", {
//     state: {
//       event,           // { id, name, dateLabel, venue, image }
//       selectedItems,   // [{ ticketType: { _id, name, price }, qty }]
//     },
//   });
//
// Everything happens on this one page — review, payment, and confirmation
// are just three internal `step` states, never separate routes.

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MasterCardLogo from '../assets/Mastercard_logo.webp'
import Visa from '../assets/visa.svg'
import StableCoin from '../assets/usdt.png'
import BankTransfer from '../assets/bank-transfer.png'
import Chat from '../assets/online-chat.png'
import {
  ChevronLeft,
  ShieldCheck,
  Calendar,
  MapPin,
  Check,
  Copy,
  Lock,
  CreditCard,
  Coins,
  Landmark,
  MessageCircle,
  Clock,
  Headphones,
} from "lucide-react";
import BankTransferPannel from "../components/BankTransferPannel";
import CardPayment from "../components/CardPayment";
import Crypto from "../components/Crypto";  
import styles from "../Checkoutflow.module.css";
import Loader from "../components/Loader";
import ProviderDownModal from "../components/ProviderDownModal";


const FEE_RATE = 0.071; // adjust to match your real fee structure
const HOLD_SECONDS = 10 * 60; // 10 minute reservation hold

const STEPS = [
  { key: "review", label: "Review" },
  { key: "payment", label: "Payment" },
  { key: "confirmation", label: "Confirmation" },
];

const PAYMENT_METHODS = [
  {
    id: "card",
    label: "Card",
    description: "Pay securely with Visa, Mastercard and more",
    icon: Visa,
    instant: true,
  },
  {
    id: "stablecoin",
    label: "Stablecoins",
    description: "Pay with USDT, USDC and other stablecoins",
    icon: StableCoin,
    instant: true,
  },
  {
    id: "bank",
    label: "Bank Transfer",
    description: "Pay directly from your bank account",
    icon: BankTransfer,
    instant: false,
  },
  {
    id: "arrange",
    label: "Arrange Payment",
    description: "Chat with our support team to complete payment",
    icon: Chat,
    instant: false,
  },
];

function formatMoney(n) {
  const isWhole = Math.round(n * 100) % 100 === 0;
  return `$${n.toLocaleString(undefined, {
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function generateOrderNumber() {
  const rand = () => Math.floor(1000 + Math.random() * 9000);
  return `SPT-${rand()}-${rand()}`;
}

export default function CheckoutFlow() {
  const location = useLocation();
  const navigate = useNavigate();
  const { event, selectedItems = [] } = location.state || {};

  const [step, setStep] = useState("review");
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [agreed, setAgreed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(HOLD_SECONDS);
  const [paymentResult, setPaymentResult] = useState(null); // "success" | "pending"
  const [orderNumber, setOrderNumber] = useState(null);
  const [cardFields, setCardFields] = useState({ number: "", expiry: "", cvc: "" });
  const [cardProvider , setCardProvider] = useState(false)
  const [providerDown, setProviderDown] = useState(false);
  const [loading , setLoading] = useState(false)

  const subtotal = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.qty * i.ticketType.price, 0),
    [selectedItems]
  );
  const fee = useMemo(() => subtotal * FEE_RATE, [subtotal]);
  const total = subtotal + fee;

  // 10-minute reservation hold, ticking across all steps until payment completes
  useEffect(() => {
    if (step === "confirmation") return; // stop counting once paid
    if (secondsLeft <= 0) {
      navigate(event?.id ? `/events/${event.id}` : "/", {
        state: { holdExpired: true },
      });
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, step, navigate, event]);

  function handleBack() {
    if (step === "payment") setStep("review");
    else navigate(-1);
  }

  function handleContinueToPayment() {
    if (!agreed) return;
    setStep("payment");
  }

  function handleInstantPay() {
    setOrderNumber(generateOrderNumber());
    setPaymentResult("success");
    setStep("confirmation");
  }

   
  function handleCard() {
    setTimeout(() => {
      setCardProvider(true)
    }, 3000);
  }


  function handleBankConfirm() {
    setPaymentResult("pending");
    setStep("confirmation");
  }

  function handleProviderFailure() {
   setLoading(true)
   setTimeout(() => {
    setLoading(false)
     setProviderDown(true);
   } , 4000)
}

  const method = PAYMENT_METHODS.find((m) => m.id === selectedMethod);
  const cardReady = cardFields.number.length >= 16 && cardFields.expiry.length >= 5 && cardFields.cvc.length >= 3;

  if (!event) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <p className={styles.emptyNotice}>
            No order found. Head back and pick your tickets first.
          </p>
          <button type="button" className={styles.payBtn} onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (cardProvider) {
    <Loader />
  }


  if (setLoading) {
     <Loader overlay text="Processing Transaction"/>
  }

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <button type="button" className={styles.backBtn} onClick={handleBack} aria-label="Back">
          <ChevronLeft size={22} />
        </button>
        <h1 className={styles.pageTitle}>Checkout</h1>
        <span className={styles.secureBadge}>
          <ShieldCheck size={15} /> Secure Checkout
        </span>
      </header>

      <ol className={styles.stepper}>
        {STEPS.map((s, i) => {
          const currentIndex = STEPS.findIndex((x) => x.key === step);
          const isDone = i < currentIndex;
          const isActive = s.key === step;
          return (
            <li className={styles.stepperItem} key={s.key}>
              <span
                className={`${styles.stepCircle} ${isActive ? styles.stepCircleActive : ""} ${isDone ? styles.stepCircleDone : ""}`}
              >
                {isDone ? <Check size={14} /> : i + 1}
              </span>
              <span className={`${styles.stepLabel} ${isActive ? styles.stepLabelActive : ""}`}>{s.label}</span>
              {i < STEPS.length - 1 && (
                <span className={`${styles.stepLine} ${isDone ? styles.stepLineDone : ""}`} />
              )}
            </li>
          );
        })}
      </ol>

      {step !== "confirmation" && (
        <div className={styles.holdTimer}>
          <Clock size={14} />
          Tickets held for <strong>{formatTime(secondsLeft)}</strong>
        </div>
      )}

      {/* ---------------- EVENT CARD ---------------- */}
      <div className={styles.card}>
        <div className={styles.eventRow}>
          <img src={event.bannerImage} alt={event.name} className={styles.eventImage} />
          <div className={styles.eventInfo}>
            <h2 className={styles.eventName}>{event.title}</h2>
            <span className={styles.eventMeta}>
              <Calendar size={14} /> {event.eventDate}
            </span>
            <span className={styles.eventMeta}>
              <MapPin size={14} /> {event.venue}
            </span>
            {event.id && (
              <a href={`/events/${event.id}`} className={styles.viewDetails}>
                View Event Details →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ---------------- ORDER SUMMARY ---------------- */}
      <div className={styles.summaryHeader}>
        <h3>Order Summary</h3>
        {step === "payment" && (
          <button type="button" className={styles.linkBtn} onClick={() => setStep("review")}>
            Edit
          </button>
        )}
      </div>

      <div className={styles.card}>
        {selectedItems.map((i) => (
          <div className={styles.summaryLine} key={i.ticketType._id}>
            <span>
              {i.ticketType.name} <span className={styles.muted}>× {i.qty}</span>
            </span>
            <span>{formatMoney(i.qty * i.ticketType.price)}</span>
          </div>
        ))}
 
        <div className={styles.divider} />

        <div className={styles.summaryLine}>
          <span>Subtotal</span>
          <span>{formatMoney(subtotal)}</span>
        </div>
        <div className={`${styles.summaryLine} ${styles.muted}`}>
          <span>Fees &amp; Taxes</span>
          <span>{step === "review" ? "Calculated at checkout" : formatMoney(fee)}</span>
        </div>

        <div className={styles.divider} />

        <div className={styles.totalLine}>
          <span>Total</span>
          <span>{formatMoney(step === "review" ? subtotal : total)}</span>
        </div>
      </div>

      {/* ---------------- STEP: REVIEW ---------------- */}
      {step === "review" && (
        <>
          <h3 className={styles.sectionTitle}>Payment Method</h3>
          <p className={styles.sectionSub}>Choose how you'd like to pay.</p>

          <div className={styles.methodList}>
            {PAYMENT_METHODS.map((m) => {
              const Icon = m.icon;
              const active = selectedMethod === m.id;
              return (
                <button
                  type="button"
                  key={m.id}
                  className={`${styles.methodRow} ${active ? styles.methodRowActive : ""}`}
                  onClick={() => setSelectedMethod(m.id)}
                >
                  <span className={`${styles.radio} ${active ? styles.radioActive : ""}`} />
                  <span className={styles.methodIcon}>
                    <img src={Icon} alt={m.label} style={{width:"40px"}}/>
                  </span>
                  <span className={styles.methodText}>
                    <span className={styles.methodLabel}>{m.label}</span>
                    <span className={styles.methodDesc}>{m.description}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <label className={styles.agreeRow}>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>
              I agree to the <a href="/terms">Terms of Service</a> and{" "}
              <a href="/refund-policy">Refund Policy</a>
            </span>
          </label>

          <button
            type="button"
            className={styles.payBtn}
            disabled={!agreed}
            onClick={handleContinueToPayment}
          >
            Continue to Payment →
          </button>

          <p className={styles.secureNote}>
            <Lock size={12} /> Your payment is secure and encrypted
          </p>
        </>
      )}

      {/* ---------------- STEP: PAYMENT ---------------- */}
      {step === "payment" && (
        <>
         <div className={styles.summaryHeader}>
            <h3>Payment Method</h3>
            <button type="button" className={styles.linkBtn} onClick={() => setStep("review")}>
              Change
            </button>
          </div>

          <div className={styles.card}>
            <div className={styles.methodSummaryRow}>
              <span className={styles.methodIcon}>
                <img src={method.icon} alt={method.label} style={{width:"40px"}}/>
              </span>
              <span className={styles.methodLabel}>{method.label}</span>
            </div>
          </div>

          {selectedMethod === "card" && (
            <div className={styles.card}>
              <h4 className={styles.fieldsTitle}>Card Details</h4>
              <div className={styles.field}>
                <label>Card Number</label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={cardFields.number}
                  onChange={(e) => setCardFields((f) => ({ ...f, number: e.target.value }))}
                />
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="08 / 27"
                    value={cardFields.expiry}
                    onChange={(e) => setCardFields((f) => ({ ...f, expiry: e.target.value }))}
                  />
                </div>
                <div className={styles.field}>
                  <label>CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardFields.cvc}
                    onChange={(e) => setCardFields((f) => ({ ...f, cvc: e.target.value }))}
                  />
                </div>
              </div>
              <button
                type="button"
                className={styles.payBtn}
                disabled={!cardReady}
                onClick={handleProviderFailure}
              >
                <Lock size={14} /> Pay {formatMoney(total)}
              </button>
            </div>
          )}

          {selectedMethod === "stablecoin" && (
            <div className={styles.card}>
              <p className={styles.fieldsNote}>
                You'll be prompted to complete payment with USDT, USDC, or another supported
                stablecoin.
              </p>
              <button type="button" className={styles.payBtn} onClick={handleInstantPay}>
                <Lock size={14} /> Pay {formatMoney(total)}
              </button>
            </div>
          )}

          {selectedMethod === "bank" && (
            <BankTransferPanel amount={total} event={event} onConfirm={handleBankConfirm} />
          )}

          {selectedMethod === "arrange" && (
            <div className={styles.card}>
              <p className={styles.fieldsNote}>
                Chat with our support team to arrange payment for this order. We'll confirm your
                tickets once payment is verified.
              </p>
              <button type="button" className={styles.payBtn} onClick={handleBankConfirm}>
                <Headphones size={14} /> Contact Support
              </button>
            </div>
          )}

          <p className={styles.secureNote}>
            <Lock size={12} /> Your payment is secure and encrypted
          </p>
        </>
      )}

      {/* ---------------- STEP: CONFIRMATION ---------------- */}
      {step === "confirmation" && (
        <div className={styles.confirmWrap}>
          {paymentResult === "success" ? (
            <>
              <span className={styles.successIcon}>
                <Check size={32} />
              </span>
              <h2 className={styles.confirmTitle}>Payment Successful!</h2>
              <p className={styles.confirmSub}>
                Your tickets are confirmed. We've sent the details to your email.
              </p>

              <div className={styles.orderNumberRow}>
                <div>
                  <span className={styles.orderNumberLabel}>Order Number</span>
                  <span className={styles.orderNumberValue}>{orderNumber}</span>
                </div>
                <button
                  type="button"
                  className={styles.copyBtn}
                  onClick={() => navigator.clipboard?.writeText(orderNumber)}
                  aria-label="Copy order number"
                >
                  <Copy size={15} />
                </button>
              </div>
            </>
          ) : (
            <>
              <span className={styles.pendingIcon}>
                <Clock size={32} />
              </span>
              <h2 className={styles.confirmTitle}>We're confirming your payment</h2>
              <p className={styles.confirmSub}>
                Your tickets will be issued once we've verified your payment.
              </p>
            </>
          )}

          <div className={styles.card}>
            <div className={styles.eventRow}>
              <img src={event.image} alt={event.name} className={styles.eventImage} />
              <div className={styles.eventInfo}>
                <h2 className={styles.eventName}>{event.name}</h2>
                <span className={styles.eventMeta}>
                  <Calendar size={14} /> {event.dateLabel}
                </span>
                <span className={styles.eventMeta}>
                  <MapPin size={14} /> {event.venue}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            {selectedItems.map((i) => (
              <div className={styles.summaryLine} key={i.ticketType._id}>
                <span>{i.ticketType.name}</span>
                <span className={styles.muted}>× {i.qty}</span>
              </div>
            ))}
          </div>

          <div className={styles.infoBox}>
            {paymentResult === "success" && (
              <p className={styles.infoLine}>
                Your tickets will be available in "My Tickets" once the event gets closer.
              </p>
            )}
            <p className={styles.infoLine}>
              Need help? <a href="/support">Contact our support team.</a>
            </p>
          </div>

          {paymentResult === "success" && (
            <button type="button" className={styles.payBtn} onClick={() => navigate("/my-tickets")}>
              View My Tickets
            </button>
          )}
          <button
            type="button"
            className={paymentResult === "success" ? styles.secondaryBtn : styles.payBtn}
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      )}

        <ProviderDownModal
  open={providerDown}
  secondsLeft={secondsLeft}
  onChangeMethod={() => {
    setProviderDown(false);
    setStep("review");
  }}
/>
    </div>
  );
}