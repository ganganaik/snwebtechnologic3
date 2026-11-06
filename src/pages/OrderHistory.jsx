
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

  const getStatusStyle = (status) => {
    const currentStatus = (status || "Pending").toLowerCase();

    if (currentStatus === "completed") {
      return {
        background: "#123b2a",
        color: "#6ee7a5"
      };
    }

    if (currentStatus === "in progress") {
      return {
        background: "#3b2d12",
        color: "#facc15"
      };
    }

    return {
      background: "#3b2020",
      color: "#fca5a5"
    };
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#080808",
      color: "#f8f5ed",
      fontFamily: "Arial, sans-serif"
    },
    header: {
      background: "#111",
      borderBottom: "1px solid #292929",
      padding: "18px 5%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "12px"
    },
    brand: {
      color: "#d4af37",
      fontSize: "21px",
      letterSpacing: "0.5px"
    },
    link: {
      color: "#d4af37",
      textDecoration: "none",
      fontWeight: "bold",
      fontSize: "14px",
      border: "1px solid #806820",
      padding: "10px 14px",
      borderRadius: "7px"
    },
    container: {
      maxWidth: "850px",
      margin: "auto",
      padding: "30px 18px"
    },
    heading: {
      color: "#f8f5ed",
      fontSize: "27px",
      marginBottom: "10px"
    },
    subtitle: {
      color: "#aaa",
      fontSize: "14px",
      lineHeight: "1.6"
    },
    summary: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap: "15px",
      margin: "25px 0 30px"
    },
    summaryCard: {
      background: "#141414",
      border: "1px solid #292929",
      borderRadius: "12px",
      padding: "20px",
      textAlign: "center"
    },
    summaryNumber: {
      color: "#d4af37",
      fontSize: "29px",
      marginBottom: "8px"
    },
    summaryLabel: {
      color: "#aaa",
      fontSize: "13px"
    },
    sectionHeading: {
      color: "#e4c45c",
      fontSize: "17px",
      marginBottom: "12px"
    },
    filters: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      margin: "15px 0 25px"
    },
    filterButton: {
      padding: "10px 15px",
      border: "1px solid #444",
      borderRadius: "7px",
      background: "#141414",
      color: "#ddd",
      cursor: "pointer",
      fontSize: "13px"
    },
    activeFilter: {
      background: "#d4af37",
      color: "#080808",
      borderColor: "#d4af37",
      fontWeight: "bold"
    },
    orderCard: {
      background: "#141414",
      border: "1px solid #292929",
      padding: "21px",
      marginBottom: "16px",
      borderRadius: "12px",
      overflowWrap: "anywhere"
    },
    orderHeading: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "12px",
      marginBottom: "16px"
    },
    service: {
      color: "#e4c45c",
      fontSize: "19px"
    },
    status: {
      display: "inline-block",
      padding: "7px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "bold"
    },
    info: {
      color: "#ccc",
      fontSize: "14px",
      lineHeight: "1.8",
      marginBottom: "6px",
      overflowWrap: "anywhere"
    },
    details: {
      background: "#1d1d1d",
      padding: "13px",
      borderRadius: "8px",
      marginTop: "12px",
      color: "#ccc",
      fontSize: "14px",
      lineHeight: "1.7",
      overflowWrap: "anywhere"
    },
    error: {
      background: "#351b1b",
      color: "#fca5a5",
      border: "1px solid #713333",
      padding: "14px",
      borderRadius: "8px",
      marginBottom: "18px"
    },
    empty: {
      textAlign: "center",
      background: "#141414",
      border: "1px solid #292929",
      padding: "28px 18px",
      borderRadius: "10px",
      color: "#aaa",
      lineHeight: "1.7"
    },
    footer: {
      textAlign: "center",
      color: "#777",
      fontSize: "13px",
      marginTop: "40px",
      padding: "22px 10px",
      borderTop: "1px solid #292929"
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#d4af37",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif"
      }}>
        Loading order history...
      </div>
    );
  }

  return (
    <div style={styles.page}>

      <header style={styles.header}>
        <h2 style={styles.brand}>
          SN WEB TECHNOLOGIES
        </h2>

        <Link
          to="/customer-dashboard"
          style={styles.link}
        >
          ← Back to Dashboard
        </Link>
      </header>

      <main style={styles.container}>

        <h1 style={styles.heading}>
          Order History
        </h1>

        <p style={styles.subtitle}>
          View and track all your previous service orders.
        </p>

        <div style={styles.summary}>

          <div style={styles.summaryCard}>
            <h2 style={styles.summaryNumber}>
              {orders.length}
            </h2>
            <p style={styles.summaryLabel}>
              Total Orders
            </p>
          </div>

          <div style={styles.summaryCard}>
            <h2 style={styles.summaryNumber}>
              {orders.filter(
                (order) =>
                  (order.status || "Pending").toLowerCase() === "completed"
              ).length}
            </h2>
            <p style={styles.summaryLabel}>
              Completed
            </p>
          </div>

        </div>

        <h3 style={styles.sectionHeading}>
          Filter Orders
        </h3>

        <div style={styles.filters}>
          {["All", "Pending", "In Progress", "Completed"].map((item) => (
            <button
              key={item}
              type="button"
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

        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}

        {!error && filteredOrders.length === 0 && (
          <div style={styles.empty}>
            <h3 style={{
              color: "#e4c45c",
              marginBottom: "10px"
            }}>
              No Orders Found
            </h3>

            <p>
              No orders found in this category.
              Try selecting another filter.
            </p>

            {orders.length === 0 && (
              <Link
                to="/"
                style={{
                  display: "inline-block",
                  marginTop: "15px",
                  color: "#d4af37",
                  textDecoration: "none",
                  fontWeight: "bold"
                }}
              >
                Explore Services →
              </Link>
            )}
          </div>
        )}

        {!error && filteredOrders.map((order) => (
          <div key={order.id} style={styles.orderCard}>

            <div style={styles.orderHeading}>
              <h3 style={styles.service}>
                {order.service || "Service Order"}
              </h3>

              <span style={{
                ...styles.status,
                ...getStatusStyle(order.status)
              }}>
                {order.status || "Pending"}
              </span>
            </div>

            <p style={styles.info}>
              <b>Name:</b> {order.name || "Not provided"}
            </p>

            <p style={styles.info}>
              <b>Email:</b> {order.email || "Not provided"}
            </p>

            <p style={styles.info}>
              <b>Mobile:</b> {order.mobile || "Not provided"}
            </p>

            <div style={styles.details}>
              <b style={{ color: "#e4c45c" }}>
                Project Details:
              </b>

              <p style={{ marginTop: "7px" }}>
                {order.details || "No additional details provided."}
              </p>
            </div>

          </div>
        ))}

      </main>

      <footer style={styles.footer}>
        © {new Date().getFullYear()} SN WEB TECHNOLOGIES. All Rights Reserved.
      </footer>

    </div>
  );
}

export default OrderHistory;
