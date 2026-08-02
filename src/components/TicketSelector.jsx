import { useEffect, useMemo, useState } from "react";
import { ChevronUp, Minus, Plus, X } from "lucide-react";
import TicketSelectorSkeleton from "./TicketSkeleton";
import "../TicketSelector.css";

const ORDER_MAX = 10; // hard cap per order, across all ticket types combined

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const getCapacity = (ticketType) =>
  (ticketType.rows?.length || 0) * (ticketType.seatsPerRow || 0);

const getRemaining = (ticketType) => {
  const capacity = getCapacity(ticketType);
  if (typeof ticketType.sold !== "number") return null;
  return Math.max(capacity - ticketType.sold, 0);
};

const TicketSelector = ({ event, onCheckout, loading = false }) => {
  const [quantities, setQuantities] = useState({});
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");

  const ticketTypes = event?.ticketTypes || [];

  const sortedTicketTypes = useMemo(() => {
    if (sortBy === "price-asc") {
      return [...ticketTypes].sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-desc") {
      return [...ticketTypes].sort((a, b) => b.price - a.price);
    }
    return ticketTypes;
  }, [ticketTypes, sortBy]);

  const totalQty = useMemo(
    () => Object.values(quantities).reduce((sum, q) => sum + q, 0),
    [quantities]
  );

  const changeQty = (ticketType, delta) => {
    setQuantities((prev) => {
      const current = prev[ticketType._id] || 0;
      const remaining = getRemaining(ticketType);
      const perTypeMax = remaining !== null ? remaining : 10;

      if (delta > 0) {
        const roomLeftInOrder = ORDER_MAX - totalQty;
        const maxAllowed = current + Math.max(roomLeftInOrder, 0);
        const next = Math.min(current + delta, perTypeMax, maxAllowed);
        return { ...prev, [ticketType._id]: next };
      }

      const next = Math.max(current + delta, 0);
      return { ...prev, [ticketType._id]: next };
    });
  };

  const removeItem = (ticketTypeId) => {
    setQuantities((prev) => ({ ...prev, [ticketTypeId]: 0 }));
  };

  const selectedItems = useMemo(() => {
    return ticketTypes
      .map((tt) => ({ ticketType: tt, qty: quantities[tt._id] || 0 }))
      .filter((item) => item.qty > 0);
  }, [ticketTypes, quantities]);

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

  useEffect(() => {
    if (!sheetExpanded) return;

    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSheetExpanded(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sheetExpanded]);

  if (loading) {
    return (
      <section id="ticket-selector" className="ts-section">
        <div className="ts-layout">
          <div className="ts-selector">
            <div className="ts-header">
              <h2>Select Tickets</h2>
            </div>
            <TicketSelectorSkeleton />
          </div>
        </div>
      </section>
    );
  }

  if (ticketTypes.length === 0) {
    return (
      <section id="ticket-selector" className="ts-section">
        <div className="ts-empty-state">
          <p>Tickets for this event aren't available yet.</p>
        </div>
      </section>
    );
  }

  const atOrderMax = totalQty >= ORDER_MAX;

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
              <span className="ts-summary-item-right">
                <span className="ts-summary-item-total">
                  ${qty * ticketType.price}
                </span>
                <button
                  type="button"
                  className="ts-summary-remove"
                  onClick={() => removeItem(ticketType._id)}
                  aria-label={`Remove ${ticketType.name}`}
                >
                  <X size={13} />
                </button>
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
        <span>Fees &amp; taxes</span>
        <span>Calculated at checkout</span>
      </div>

      <div className="ts-summary-total">
        <span>Total</span>
        <span>${subtotal}</span>
      </div>

      <span className="sr-only" aria-live="polite">
        {totalQty} ticket{totalQty !== 1 ? "s" : ""} in cart, total ${subtotal}
      </span>

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
            <div className="ts-header-titles">
              <h2>Select Tickets</h2>
              <span className="ts-fees-disclosure">
                Prices shown exclude applicable fees and taxes
              </span>
            </div>

            <div className="ts-header-right">
              {atOrderMax && (
                <span className="ts-order-max-note">
                  Limit {ORDER_MAX} per order
                </span>
              )}

              <label className="ts-sort">
                <span>Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="ts-ticket-list">
            {sortedTicketTypes.map((tt) => {
              const qty = quantities[tt._id] || 0;
              const remaining = getRemaining(tt);
              const isLow = remaining !== null && remaining > 0 && remaining <= 10;
              const isSoldOut = remaining === 0;
              const plusDisabled =
                (remaining !== null && qty >= remaining) || atOrderMax;
              const isVip = tt.cartegory === "vip";

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
                    <div className="ts-row-badges">
                      <span className={`ts-pill ${isVip ? "vip" : "regular"}`}>
                        {isVip ? "VIP" : "Regular"}
                      </span>
                      <span className="ts-pill outline">
                        {tt.ticketType}
                      </span>
                      {tt.section && (
                        <span className="ts-pill outline">
                          Sec {tt.section}
                        </span>
                      )}
                    </div>

                    <span className="ts-row-name">{tt.name}</span>

                    {tt.ticketType === "Reserved" && (
                      <span className="ts-row-note">
                        Best available seat assigned automatically
                      </span>
                    )}
                    {isLow && (
                      <span className="ts-row-low">Only {remaining} left</span>
                    )}
                  </div>

                  <div className="ts-row-price-block">
                    <span className="ts-row-price">${tt.price}</span>
                    <span className="ts-row-price-fees">+ fees</span>
                  </div>

                  {isSoldOut ? (
                    <span className="ts-row-soldout">Sold Out</span>
                  ) : (
                    <div className="ts-stepper">
                      <button
                        type="button"
                        onClick={() => changeQty(tt, -1)}
                        disabled={qty === 0}
                        aria-label={`Decrease quantity for ${tt.name}`}
                      >
                        <Minus size={13} />
                      </button>
                      <span key={qty} className="ts-stepper-value">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => changeQty(tt, 1)}
                        disabled={plusDisabled}
                        aria-label={`Increase quantity for ${tt.name}`}
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

          <div
            className={`ts-sheet ${sheetExpanded ? "expanded" : ""}`}
            role={sheetExpanded ? "dialog" : undefined}
            aria-modal={sheetExpanded ? "true" : undefined}
            aria-label="Order summary"
          >

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
                  <span className="ts-sheet-total">
                    ${subtotal} <span className="ts-sheet-fees-note">+ fees</span>
                  </span>
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