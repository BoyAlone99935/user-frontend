import { useState } from "react";
import { Copy, Check, ChevronLeft, AlertTriangle } from "lucide-react";
import styles from "../Checkoutflow.module.css";

function formatMoney(n) {
  const isWhole = Math.round(n * 100) % 100 === 0;
  return `$${n.toLocaleString(undefined, {
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

const API_BASE = "https://fan-platform-backend.onrender.com/api/v1/payment-methods";
const TICKETS_API_BASE = "https://fan-platform-backend.onrender.com/api/v1/tickets";


// TEST DATA — networks and addresses are placeholders while you're still
// wiring up real wallet generation. Replace `address` per network with
// real values (or fetch them) when ready.
const NETWORKS = [
  {
    id: "trc20",
    name: "Tron",
    short: "TRC20",
    color: "#ef0027",
    address: "TXTestAddressTRC20xxxxxxxxxxxxxxxxxxxx",
  },
  {
    id: "erc20",
    name: "Ethereum",
    short: "ERC20",
    color: "#627eea",
    address: "0xTestAddressERC20xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  },
  {
    id: "bep20",
    name: "BNB Smart Chain",
    short: "BEP20",
    color: "#f0b90b",
    address: "0xTestAddressBEP20xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  },
  {
    id: "polygon",
    name: "Polygon",
    short: "MATIC",
    color: "#8247e5",
    address: "0xTestAddressPolygonxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  },
  {
    id: "sol",
    name: "Solana",
    short: "SOL",
    color: "#14f195",
    address: "TestSolanaAddressxxxxxxxxxxxxxxxxxxxxxxxxxx",
  },
];

// stage machine: "networks" -> "generating" -> "address" -> "txid" -> "confirming"
const StablecoinPanel = ({ amount, event, selectedItems, onConfirm, onVerify }) => {
  const [stage, setStage] = useState("networks");
  const [network, setNetwork] = useState(null);
  const [copied, setCopied] = useState(false);
  const [txId, setTxId] = useState("");
  const [error, setError] = useState("");
  const [loading , setLoading] = useState(false)

  const handleSelectNetwork = (net) => {
    setNetwork(net);
    setStage("generating");
    // brief simulated delay before "revealing" the address — swap for a
    // real backend call here later if wallet addresses become dynamic
    setTimeout(() => setStage("address"), 1100);
  };

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText(network.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleConfirmSent = async () => {
    setError("");
    setStage("confirming");

    try {
      if (onVerify) {
        // real verification + ticket creation is the parent's job — this
        // just hands off the details and waits
        await onVerify({
          network: network.id,
          address: network.address,
          txId,
          amount,
          selectedItems,
        });
      } else {
        // no onVerify wired up yet — placeholder so this is still testable
        console.warn(
          "StablecoinPanel: no onVerify prop provided, simulating success. Replace with real verification."
        );
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      // stablecoin is the instant path — verified means confirmed, no
      // pending screen
      onConfirm();
    } catch (err) {
      setError(
        err.message || "We couldn't verify that transaction. Please check the ID and try again."
      );
      setStage("txid");
    }
  };


  const handlePaid = async () => {
    setError("");
    setStage("comfirming");
    setLoading(true)

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
            paymentType: "usdt", // matches Ticket schema enum exactly
            arrangedPayment: false,
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
      setLoading(false)
      onConfirm();
    } catch (err) {
      setError(err.message || "Something went wrong creating your tickets.");
      setLoading(false)
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.card}>

      {/* ---------------- STAGE: choose network ---------------- */}
      {stage === "networks" && (
        <>
          <div className={styles.coinHeader}>
            <span className={styles.coinBadge}>₮ USDT</span>
            <h4 className={styles.fieldsTitle}>Choose a Network</h4>
          </div>
          <p className={styles.fieldsNote}>
            Select the network you'll be sending USDT from.
          </p>

          <div className={styles.networkList}>
            {NETWORKS.map((net) => (
              <button
                type="button"
                key={net.id}
                className={styles.networkItem}
                onClick={() => handleSelectNetwork(net)}
              >
                <span
                  className={styles.networkBadge}
                  style={{ backgroundColor: net.color }}
                >
                  {net.short.slice(0, 3)}
                </span>
                <div className={styles.networkItemText}>
                  <span className={styles.networkItemName}>{net.name}</span>
                  <span className={styles.networkItemMeta}>{net.short}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ---------------- STAGE: generating address ---------------- */}
      {stage === "generating" && (
        <div className={styles.coinLoading}>
          <span className={styles.spinner} />
          <p>Generating wallet address...</p>
        </div>
      )}

      {/* ---------------- STAGE: show address + QR ---------------- */}
      {stage === "address" && network && (
        <>
          <button
            type="button"
            className={styles.linkBtn}
            onClick={() => setStage("networks")}
          >
            <ChevronLeft size={14} /> Change Network
          </button>

          <div className={styles.coinHeader}>
            <span className={styles.coinBadge}>₮ USDT</span>
            <span
              className={styles.networkPill}
              style={{ backgroundColor: network.color }}
            >
              {network.short}
            </span>
          </div>

          <div className={styles.coinAmount}>
            <span>Amount to send</span>
            <span>{formatMoney(amount)} USDT</span>
          </div>

          <div className={styles.coinWarning}>
            <AlertTriangle size={15} />
            <span>
              Only send USDT on the <strong>{network.name} ({network.short})</strong> network.
              Sending on any other network may result in permanent loss of funds.
            </span>
          </div>

          <div className={styles.qrWrap}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                network.address
              )}`}
              alt="Wallet address QR code"
            />
          </div>

          <div className={styles.addressBox}>
            <span className={styles.addressText}>{network.address}</span>
            <button
              type="button"
              className={styles.copyBtn}
              onClick={handleCopyAddress}
              aria-label="Copy wallet address"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>

          <p className={styles.fieldsNote}>
            Copy or scan the address above and make your payment. Once
            you've sent it, come back here and confirm.
          </p>

          <button
            type="button"
            className={styles.payBtn}
            onClick={() => setStage("txid")}
          >
            I've Sent the Payment
          </button>
        </>
      )}

      {/* ---------------- STAGE: enter transaction id ---------------- */}
      {stage === "txid" && network && (
        <>
          <button
            type="button"
            className={styles.linkBtn}
            onClick={() => setStage("address")}
          >
            <ChevronLeft size={14} /> Back
          </button>

          <h4 className={styles.fieldsTitle}>Confirm Your Payment</h4>
          <p className={styles.fieldsNote}>
            Enter the transaction ID (hash) from your payment so we can
            verify it.
          </p>

          <div className={styles.field}>
            <label>Transaction ID</label>
            <input
              type="text"
              placeholder="e.g. 0x8f3a2b..."
              value={txId}
              onChange={(e) => setTxId(e.target.value)}
            />
          </div>

          {error && <p className={styles.bankError}>{error}</p>}

          <button
            type="button"
            className={styles.payBtn}
            disabled={!txId.trim()}
            onClick={handlePaid}
          >
            Confirm
          </button>
        </>
      )}

      {/* ---------------- STAGE: confirming ---------------- */}
      {loading === true && (
        <div className={styles.coinLoading}>
          <span className={styles.spinner} />
          <p>Confirming transaction...</p>
        </div>
      )}

    </div>
  );
};

export default StablecoinPanel;