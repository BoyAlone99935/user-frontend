import { useEffect, useState } from "react";
import OrderCard from "./OrderCard";

const API_BASE = "https://fan-platform-backend.onrender.com/api/v1/tickets";

const MyTicketsPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch(`${API_BASE}/user`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load your tickets");
        }

        setPurchases(data.purchases || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  if (loading) {
    return (
      <div className="my-tickets-status">
        <p>Loading your tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-tickets-status">
        <p>{error}</p>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="my-tickets-status">
        <p>You haven't purchased any tickets yet.</p>
      </div>
    );
  }

  return (
    <div className="my-tickets-page">
      <h1>My Tickets</h1>

      <div className="order-list">
        {purchases.map((purchase) => (
          <OrderCard key={purchase.purchaseId} purchase={purchase} />
        ))}
      </div>
    </div>
  );
};

export default MyTicketsPage;