import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TicketStub from "../../user-frontend-main/src/components/TicketStub";
import Navbar from "../../user-frontend-main/src/components/Navbar";

const API_BASE =
  "https://fan-platform-backend.onrender.com/api/v1/tickets";

const Purchase = () => {
  const { purchaseId } = useParams();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${API_BASE}/ticket/${purchaseId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch tickets");
        }

        console.log("Purchase tickets:", data);

        setTickets(data.tickets || []);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (purchaseId) {
      fetchTickets();
    }
  }, [purchaseId]);

  if (loading) {
    return <div>Loading tickets...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
 <>
    <Navbar/>
    <div>
      
      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        tickets.map((ticket) => (
          <TicketStub
            key={ticket._id}
            ticket={ticket}
          />
        ))
      )}
    </div></>
  );
};

export default Purchase;