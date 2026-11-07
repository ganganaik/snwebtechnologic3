
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { Link } from "react-router-dom";
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
        console.error("My Orders Error:", err);
        setError(err.code + ": " + err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const formatOrderDate = (createdAt) => {
    if (!createdAt) return "Date not available";

    try {
      const date = createdAt.toDate
        ? createdAt.toDate()
        : new Date(createdAt);

      if (isNaN(date.getTime())) {
        return "Date not available";
      }

      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "Date not available";
    }
  };

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
      padding: "30px 16px",
      background: "#080808",
      color: "#f8f5ed",
      fontFamily: "Arial, sans-serif"
    },
    container: {
      maxWidth: "850px",
      margin: "auto"
    },
    header: {
      textAlign: "center",
      marginBottom: "30px"
    },
    brand: {
      color: "#d4af37",
      fontSize: "27px",
      marginBottom: "10px",
      letterSpacing: "1px"
    },
    heading: {
      fontSize: "25px",
      marginBottom: "10px"
    },
    subtitle: {
      color: "#aaa",
      fontSize: "14px",
      lineHeight: "1.6"
    },
    navigation: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "12px",
      marginBottom: "30px"
    },
    navLink: {
      color: "#d4af37",
      textDecoration: "none",
      border: "1px solid #806820",
      padding: "10px 16px",
      borderRadius: "7px",
      fontSize: "14px"
    },
    card: {
      background: "#141414",
      border: "1px solid #292929",
      borderRadius: "12px",
      padding: "22px",
      marginBottom: "18px",
      boxShadow: "0 5px 18px rgba(0,0,0,0.2)"
    },
    service: {
      color: "#e4c45c",
      fontSize: "20px",
      marginBottom: "15px",
      overflowWrap: "anywhere"
    },
    info: {
      color: "#ddd",
      fontSize: "14px",
      lineHeight: "1.8",
      overflowWrap: "anywhere",
      marginBottom: "7px"
    },
    details: {
      background: "#1c1c1c",
      borderRadius: "8px",
      padding: "13px",
      marginTop: "12px",
      color: "#ccc",
      fontSize: "14px",
      lineHeight: "1.7",
      overflowWrap: "anywhere"
    },
    status: {
      display: "inline-block",
      padding: "7px 13px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "bold",
      marginTop: "12px"
    },
    message: {
      textAlign: "center",
      background: "#141414",
      border: "1px solid #292929",
      padding: "25px 18px",
      borderRadius: "10px",
      color: "#ccc",
      lineHeight: "1.7"
    },
    error: {
      color: "#fca5a5",
      background: "#351b1b",
      border: "1px solid #713333",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "20px",
      overflowWrap: "anywhere"
    },
    footer: {
      textAlign: "center",
      color: "#777",
      fontSize: "13px",
      marginTop: "45px",
      padding: "20px 0",
      borderTop: "1px solid #292929"
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.message}>
          Loading your orders...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <header style={styles.header}>
          <h2 style={styles.brand}>
            SN WEB TECHNOLOGIES
          </h2>

          <h1 style={styles.heading}>
            My Orders
          </h1>

          <p style={styles.subtitle}>
            View and track all your service orders in one place.
          </p>
        </header>

        <nav style={styles.navigation}>
          <Link to="/customer-dashboard" style={styles.navLink}>
            ← Dashboard
          </Link>

          <Link to="/" style={styles.navLink}>
            Home
          </Link>
        </nav>

        {error && (
          <div style={styles.error}>
            <b>Unable to load orders:</b>
            <p>{error}</p>
          </div>
        )}

        {!error && orders.length === 0 && (
          <div style={styles.message}>
            <h3 style={{ color: "#e4c45c", marginBottom: "12px" }}>
              No Orders Yet
            </h3>

            <p>
              You have not placed any orders yet.
              Your orders will appear here after you submit a service enquiry.
            </p>

            <Link
              to="/"
              style={{
                display: "inline-block",
                marginTop: "18px",
                padding: "11px 20px",
                background: "#d4af37",
                color: "#080808",
                borderRadius: "7px",
                textDecoration: "none",
                fontWeight: "bold"
              }}
            >
              Explore Services
            </Link>
          </div>
        )}

        {!error && orders.length > 0 && (
          <>
            <p style={{
              color: "#aaa",
              marginBottom: "18px",
              fontSize: "14px"
            }}>
              Total Orders: <b style={{ color: "#d4af37" }}>
                {orders.length}
              </b>
            </p>

            {orders.map((order) => (
              <div key={order.id} style={styles.card}>

                <h3 style={styles.service}>
                  {order.service || "Service Order"}
                </h3>

                <p style={styles.info}>
                  <b>Order ID:</b> {order.id}
                </p>

                <p style={styles.info}>
                  <b>Order Date:</b> {formatOrderDate(order.createdAt)}
                </p>

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
                    Order Details:
                  </b>

                  <p style={{ marginTop: "7px" }}>
                    {order.details || "No additional details provided."}
                  </p>
                </div>

                <div>
                  <span style={{
                    ...styles.status,
                    ...getStatusStyle(order.status)
                  }}>
                    {order.status || "Pending"}
                  </span>
                </div>

              </div>
            ))}
          </>
        )}

        <footer style={styles.footer}>
          © {new Date().getFullYear()} SN WEB TECHNOLOGIES. All Rights Reserved.
        </footer>

      </div>
    </div>
  );
}

export default MyOrders;
