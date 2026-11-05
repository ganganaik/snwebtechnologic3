import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { auth, db } from "../firebase";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "/customer-login";
        return;
      }

      try {
        const ordersQuery = query(
          collection(db, "orders"),
          where("email", "==", user.email)
        );

        const snapshot = await getDocs(ordersQuery);

        const customerOrders = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data()
        }));

        setOrders(customerOrders);
      } catch (err) {
        setError("Unable to load your orders. Please try again.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading your orders...</p>;
  }

  return (
    <div style={{
      minHeight: "100vh",
      padding: "25px",
      background: "#f3f4f6",
      fontFamily: "Arial"
    }}>
      <h2 style={{ textAlign: "center" }}>
        SN WEB TECHNOLOGIES
      </h2>

      <h3 style={{ textAlign: "center" }}>
        My Orders & Order History
      </h3>

      {error && (
        <p style={{ color: "red", textAlign: "center" }}>
          {error}
        </p>
      )}

      {!error && orders.length === 0 && (
        <p style={{ textAlign: "center" }}>
          You have not placed any orders yet.
        </p>
      )}

      <div style={{
        maxWidth: "700px",
        margin: "auto"
      }}>
        {orders.map((order) => (
          <div
            key={order.id}
            style={{
              background: "white",
              padding: "20px",
              marginBottom: "15px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}
          >
            <h3>{order.service}</h3>

            <p><b>Name:</b> {order.name}</p>
            <p><b>Email:</b> {order.email}</p>
            <p><b>Mobile:</b> {order.mobile}</p>
            <p><b>Details:</b> {order.details}</p>

            <p>
              <b>Status:</b>{" "}
              {order.status || "Pending"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;
