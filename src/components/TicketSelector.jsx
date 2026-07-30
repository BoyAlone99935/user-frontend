import { useMemo, useState } from "react";
import { ChevronUp, Minus, Plus, X } from "lucide-react";

const getCapacity = (ticketType) =>
  (ticketType.rows?.length || 0) * (ticketType.seatsPerRow || 0);

const getRemaining = (ticketType) => {
  const capacity = getCapacity(ticketType);
  if (typeof ticketType.sold !== "number") return null;
  return Math.max(capacity - ticketType.sold, 0);
};

const TicketSelector = ({ event, onCheckout }) => {
  const [quantities, setQuantities] = useState({});
  const [sheetExpanded, setSheetExpanded] = useState(false);

  const ticketTypes = event?.ticketTypes || [];

  const changeQty = (ticketType, delta) => {
    setQuantities((prev) => {
      const current = prev[ticketType._id] || 0;
      const remaining = getRemaining(ticketType);
      const max = remaining !== null ? remaining : 10;
      const next = Math.min(Math.max(current + delta, 0), max);
      return { ...prev, [ticketType._id]: next };
    });
  };

  const selectedItems = useMemo(() => {
    return ticketTypes
      .map((tt) => ({ ticketType: tt, qty: quantities[tt._id] || 0 }))
      .filter((item) => item.qty > 0);
  }, [ticketTypes, quantities]);

  const totalQty = selectedItems.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = selectedItems.reduce(
    (sum, i) => sum + i.qty * i.ticketType.price,
    0
  );

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout(selectedItems);
    } else {
      console.log("Proceeding to checkout with:", selectedItems);
    }
  };

  if (ticketTypes.length === 0) return null;

  const SummaryContent = () => (
    <>
      {selectedItems.length === 0 ? (
        <div className="ts-summary-empty">
          <p>No tickets selected yet</p>
        </div>
      ) : (
        <div className="ts-summary-items">
          {selectedItems.map(({ ticketType, qty }) => (
            <div className="ts-summary-item" key={ticketType._id}>
              <span className="ts-summary-item-name">
                {ticketType.name} <span>× {qty}</span>
              </span>
              <span className="ts-summary-item-total">
                ${qty * ticketType.price}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="ts-summary-divider" />

      <div className="ts-summary-row">
        <span>Subtotal</span>
        <span>${subtotal}</span>
      </div>
      <div className="ts-summary-row muted">
        <span>Fees</span>
        <span>Calculated at checkout</span>
      </div>

      <div className="ts-summary-total">
        <span>Total</span>
        <span>${subtotal}</span>
      </div>

      <button
        type="button"
        className="ts-checkout-btn"
        onClick={handleCheckout}
        disabled={totalQty === 0}
      >
        Checkout ({totalQty})
      </button>
    </>
  );

  return (
    <section id="ticket-selector" className="ts-section">

      <div className="ts-layout">

        {/* ================= TICKET LIST ================= */}
        <div className="ts-selector">

          <div className="ts-header">
            <h2>Select Tickets</h2>
          </div>

          <div className="ts-ticket-list">
            {ticketTypes.map((tt) => {
              const qty = quantities[tt._id] || 0;
              const remaining = getRemaining(tt);
              const isLow = remaining !== null && remaining > 0 && remaining <= 10;
              const isSoldOut = remaining === 0;

              return (
                <div
                  key={tt._id}
                  className={`ts-row ${qty > 0 ? "selected" : ""} ${isSoldOut ? "sold-out" : ""}`}
                >
                  <img
                    src={tt.image || "https://via.placeholder.com/80"}
                    alt={tt.name}
                    className="ts-row-image"
                  />

                  <div className="ts-row-info">
                    <span className="ts-row-name">{tt.name}</span>
                    <span className="ts-row-meta">
                      {tt.cartegory === "vip" ? "VIP" : "Regular"} · {tt.ticketType}
                      {tt.section && ` · Section ${tt.section}`}
                    </span>
                    {tt.ticketType === "Reserved" && (
                      <span className="ts-row-note">
                        Best available seat assigned automatically
                      </span>
                    )}
                    {isLow && (
                      <span className="ts-row-low">Only {remaining} left</span>
                    )}
                  </div>

                  <span className="ts-row-price">${tt.price}</span>

                  {isSoldOut ? (
                    <span className="ts-row-soldout">Sold Out</span>
                  ) : (
                    <div className="ts-stepper">
                      <button
                        type="button"
                        onClick={() => changeQty(tt, -1)}
                        disabled={qty === 0}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span>{qty}</span>
                      <button
                        type="button"
                        onClick={() => changeQty(tt, 1)}
                        disabled={remaining !== null && qty >= remaining}
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* ================= DESKTOP SUMMARY ================= */}
        <aside className="ts-summary">
          <div className="ts-summary-card">
            <h3>Order Summary</h3>
            <SummaryContent />
          </div>
        </aside>

      </div>

      {/* ================= MOBILE BOTTOM SHEET ================= */}
      {totalQty > 0 && (
        <>
          <div
            className={`ts-sheet-backdrop ${sheetExpanded ? "show" : ""}`}
            onClick={() => setSheetExpanded(false)}
          />

          <div className={`ts-sheet ${sheetExpanded ? "expanded" : ""}`}>

            <button
              type="button"
              className="ts-sheet-handle"
              onClick={() => setSheetExpanded((prev) => !prev)}
              aria-label={sheetExpanded ? "Collapse order summary" : "Expand order summary"}
            >
              <span className="ts-sheet-bar" />
            </button>

            {!sheetExpanded ? (
              <div
                className="ts-sheet-collapsed"
                onClick={() => setSheetExpanded(true)}
              >
                <div className="ts-sheet-collapsed-info">
                  <span>{totalQty} Ticket{totalQty > 1 ? "s" : ""}</span>
                  <span className="ts-sheet-total">${subtotal}</span>
                </div>
                <ChevronUp size={18} />
              </div>
            ) : (
              <div className="ts-sheet-expanded">
                <div className="ts-sheet-expanded-header">
                  <h3>Order Summary</h3>
                  <button
                    type="button"
                    onClick={() => setSheetExpanded(false)}
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
                <SummaryContent />
              </div>
            )}

          </div>
        </>
      )}

    </section>
  );
};

export default TicketSelector;