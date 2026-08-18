import { useEffect, useState } from "react";
import { Copy, Check, X, Landmark } from "lucide-react";
import styles from "../Checkoutflow.module.css";

const API_BASE = "https://fan-platform-backend.onrender.com/api/v1/payment-methods";
const TICKETS_API_BASE = "https://fan-platform-backend.onrender.com/api/v1/tickets";

function formatMoney(n) {
  const isWhole = Math.round(n * 100) % 100 === 0;
  return `$${n.toLocaleString(undefined, {
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

const DETAIL_FIELDS = [
  { key: "accountName", label: "Account Name" },
  { key: "bankName", label: "Bank Name" },
  { key: "accountNumber", label: "Account Number" },
  { key: "iban", label: "IBAN" },
  { key: "swiftCode", label: "SWIFT / BIC" },
  { key: "routingNumber", label: "Routing Number" },
  { key: "sortCode", label: "Sort Code" },
  { key: "transitNumber", label: "Transit Number" },
  { key: "institutionNumber", label: "Institution Number" },
  { key: "bsb", label: "BSB" },
  { key: "email", label: "Email" },
  { key: "phoneNumber", label: "Phone Number" },
];

const BankTransferPanel = ({ amount, event, onConfirm, selectedItems }) => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const res = await fetch(API_BASE);
        const data = await res.json();
        const active = (data.paymentMethods || []).filter((m) => m.active);
        setMethods(active);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMethods();
  }, []);

  useEffect(() => {
    if (!selected) return;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selected]);

  const handleCopy = (key, value) => {
    navigator.clipboard?.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handlePaid = async () => {
    setError("");
    setSubmitting(true);

    try {
      // one request per ticket type, since create-ticket only accepts a
      // single ticketId + quantity per call
      for (const item of selectedItems) {
        const res = await fetch(`${TICKETS_API_BASE}/create-ticket`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // sends the auth cookie automatically
          body: JSON.stringify({
            bookingType: "event",
            eventId: event._id,
            ticketId: item.ticketType._id,
            quantity: item.qty,
            paymentType: "Bank", // matches Ticket schema enum exactly
            arrangedPayment: true,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message ||
              `Failed to create ticket for ${item.ticketType.name}`
          );
        }
      }

      setSelected(null);
      onConfirm();
    } catch (err) {
      setError(err.message || "Something went wrong creating your tickets.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.card}>
        <p className={styles.fieldsNote}>Loading payment options...</p>
      </div>
    );
  }

  if (methods.length === 0) {
    return (
      <div className={styles.card}>
        <p className={styles.fieldsNote}>
          No bank transfer options are available right now. Please choose a
          different payment method.
        </p>
      </div>
    );
  }

  const visibleFields = selected
    ? DETAIL_FIELDS.filter((f) => selected[f.key])
    : [];

  return (
    <div className={styles.card}>
      <h4 className={styles.fieldsTitle}>Choose a Bank Account</h4>
      <p className={styles.fieldsNote}>
        Select an account below to see the full transfer details.
      </p>

      <div className={styles.bankList}>
        {methods.map((method) => (
          <button
            type="button"
            key={method._id}
            className={styles.bankListItem}
            onClick={() => setSelected(method)}
          >
            {method.logo ? (
              <img
                src={method.logo}
                alt={method.provider}
                className={styles.bankLogo}
              />
            ) : (
              <span className={styles.bankLogoFallback}>
                <Landmark size={18} />
              </span>
            )}

            <div className={styles.bankListItemText}>
              <span className={styles.bankListItemName}>
                {method.bankName || method.provider}
              </span>
              {method.currency && (
                <span className={styles.bankListItemMeta}>
                  {method.currency}
                  {method.country ? ` · ${method.country}` : ""}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className={styles.bankModalOverlay}
          onClick={() => setSelected(null)}
        >
          <div
            className={styles.bankModal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Bank transfer details"
          >
            <button
              type="button"
              className={styles.bankModalClose}
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <h3 className={styles.bankModalTitle}>
              {selected.bankName || selected.provider}
            </h3>

            <div className={styles.bankModalAmount}>
              <span>Amount to transfer</span>
              <span>{formatMoney(amount)}</span>
            </div>

            <div className={styles.bankDetailsList}>
              {visibleFields.map((field) => (
                <div className={styles.bankDetailRow} key={field.key}>
                  <div>
                    <span className={styles.bankDetailLabel}>
                      {field.label}
                    </span>
                    <span className={styles.bankDetailValue}>
                      {selected[field.key]}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={() =>
                      handleCopy(field.key, selected[field.key])
                    }
                    aria-label={`Copy ${field.label}`}
                  >
                    {copiedKey === field.key ? (
                      <Check size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {selected.instructions && (
              <p className={styles.bankInstructions}>
                {selected.instructions}
              </p>
            )}

            <p className={styles.bankInstructions}>
              Copy the details above, make the transfer, then come back
              and let us know once you've paid.
            </p>

            {error && <p className={styles.bankError}>{error}</p>}

            <button
              type="button"
              className={styles.payBtn}
              disabled={submitting}
              onClick={handlePaid}
            >
              {submitting ? (
                <>
                  <span className={styles.spinner} /> Confirming...
                </>
              ) : (
                "I've Paid"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankTransferPanel;