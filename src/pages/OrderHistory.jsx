
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { auth, db } from "../firebase";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

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

        setOrders(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
          }))
        );
      } catch (err) {
        console.error("Order History Error:", err);
        setError("Unable to load order history. Please try again.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (filter === "All") return true;

    return (order.status || "Pending") === filter;
  });

  if (loading) {
    return (
      <p style={{ textAlign: "center", padding: "40px" }}>
        Loading order history...
      </p>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h2>SN WEB TECHNOLOGIES</h2>
        <Link to="/customer-dashboard" style={styles.link}>
          Back to Dashboard
        </Link>
      </header>

      <main style={styles.container}>
        <h1>Order History</h1>
        <p>View and track all your previous orders.</p>

        <div style={styles.summary}>
          <div>
            <h2>{orders.length}</h2>
            <p>Total Orders</p>
          </div>
          <div>
            <h2>
              {orders.filter(
                (order) => (order.status || "Pending") === "Completed"
              ).length}
            </h2>
            <p>Completed</p>
          </div>
        </div>

        <h3>Filter Orders</h3>

        <div style={styles.filters}>
          {["All", "Pending", "In Progress", "Completed"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              style={{
                ...styles.filterButton,
                ...(filter === item ? styles.activeFilter : {})
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {!error && filteredOrders.length === 0 && (
          <p style={styles.empty}>
            No orders found in this category.
          </p>
        )}

        {filteredOrders.map((order) => (
          <div key={order.id} style={styles.orderCard}>
            <div style={styles.orderHeading}>
              <h3>{order.service}</h3>
              <span style={styles.status}>
                {order.status || "Pending"}
              </span>
            </div>

            <p><b>Name:</b> {order.name}</p>
            <p><b>Email:</b> {order.email}</p>
            <p><b>Mobile:</b> {order.mobile}</p>
            <p><b>Project Details:</b> {order.details}</p>
          </div>
        ))}
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f6fc",
    color: "#172554",
    fontFamily: "Arial, sans-serif"
  },
  header: {
    background: "white",
    padding: "18px 5%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px"
  },
  link: {
    color: "#0754c7",
    textDecoration: "none",
    fontWeight: "bold"
  },
  container: {
    maxWidth: "850px",
    margin: "auto",
    padding: "25px 18px"
  },
  summary: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "15px",
    margin: "25px 0"
  },
  filters: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    margin: "15px 0 25px"
  },
  filterButton: {
    padding: "10px 15px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    background: "white",
    color: "#172554",
    cursor: "pointer"
  },
  activeFilter: {
    background: "#0754c7",
    color: "white",
    borderColor: "#0754c7"
  },
  orderCard: {
    background: "white",
    padding: "20px",
    marginBottom: "15px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    overflowWrap: "anywhere"
  },
  orderHeading: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px"
  },
  status: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold"
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px",
    borderRadius: "8px"
  },
  empty: {
    textAlign: "center",
    background: "white",
    padding: "25px",
    borderRadius: "10px"
  }
};

export default OrderHistory;
