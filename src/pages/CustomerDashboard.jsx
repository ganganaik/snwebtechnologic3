
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where
} from "firebase/firestore";
import { auth, db } from "../firebase";

function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        window.location.href = "/customer-login";
        return;
      }

      setUser(currentUser);

      try {
        const profileRef = doc(db, "customers", currentUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        }

        const ordersQuery = query(
          collection(db, "orders"),
          where("email", "==", currentUser.email)
        );

        const snapshot = await getDocs(ordersQuery);

        setOrders(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
          }))
        );
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut(auth);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setLoggingOut(false);
      alert("Logout failed. Please try again.");
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center", padding: "40px" }}>
      Loading your dashboard...
    </p>;
  }

  const customerName =
    profile.name || user?.displayName || "Customer";

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h2 style={styles.brand}>SN WEB TECHNOLOGIES</h2>
          <p style={styles.tagline}>Your Digital Growth Partner</p>
        </div>

        <Link to="/" style={styles.homeLink}>Home</Link>
      </header>

      <main style={styles.container}>
        <section style={styles.welcome}>
          <h1>Welcome Back, {customerName}!</h1>
          <p>Manage your account and track your orders from here.</p>
        </section>

        {error && (
          <p style={styles.error}>{error}</p>
        )}

        <section style={styles.cards}>
          <Link to="/customer-profile" style={styles.card}>
            <span style={styles.icon}>👤</span>
            <h3>My Profile</h3>
            <p>View and edit details</p>
          </Link>

          <Link to="/my-orders" style={styles.card}>
            <span style={styles.icon}>📦</span>
            <h3>My Orders</h3>
            <p>Track your orders</p>
          </Link>

          <Link to="/my-orders" style={styles.card}>
            <span style={styles.icon}>🕒</span>
            <h3>Order History</h3>
            <p>View all past orders</p>
          </Link>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={styles.logoutCard}
          >
            <span style={styles.icon}>🚪</span>
            <h3>{loggingOut ? "Logging out..." : "Logout"}</h3>
            <p>Sign out securely</p>
          </button>
        </section>

        <section style={styles.contentGrid}>
          <div style={styles.panel}>
            <div style={styles.panelHeading}>
              <h2>My Orders</h2>
              <Link to="/my-orders">View All →</Link>
            </div>

            <p style={styles.orderCount}>
              Total Orders: {orders.length}
            </p>

            {orders.length === 0 ? (
              <p>You have not placed any orders yet.</p>
            ) : (
              orders.slice(0, 3).map((order) => (
                <div key={order.id} style={styles.orderItem}>
                  <div>
                    <h3>{order.service}</h3>
                    <p>{order.name}</p>
                  </div>

                  <span style={styles.status}>
                    {order.status || "Pending"}
                  </span>
                </div>
              ))
            )}
          </div>

          <div style={styles.panel}>
            <h2>Account Information</h2>

            <div style={styles.info}>
              <b>Name</b>
              <span>{profile.name || "Not added"}</span>
            </div>

            <div style={styles.info}>
              <b>Email</b>
              <span>{user?.email || "Not available"}</span>
            </div>

            <div style={styles.info}>
              <b>Mobile</b>
              <span>{profile.mobile || "Not added"}</span>
            </div>

            <div style={styles.info}>
              <b>Address</b>
              <span>{profile.address || "Not added"}</span>
            </div>

            <Link to="/customer-profile" style={styles.editButton}>
              Edit Profile
            </Link>
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        Made with ❤️ by Ganga Naik
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f6fc",
    fontFamily: "Arial, sans-serif",
    color: "#172554"
  },
  header: {
    background: "white",
    padding: "18px 5%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)"
  },
  brand: {
    margin: 0,
    color: "#0645ad"
  },
  tagline: {
    margin: "5px 0 0",
    color: "#64748b"
  },
  homeLink: {
    color: "#0645ad",
    textDecoration: "none",
    fontWeight: "bold"
  },
  container: {
    maxWidth: "1200px",
    margin: "auto",
    padding: "25px 18px"
  },
  welcome: {
    padding: "35px",
    borderRadius: "15px",
    background: "linear-gradient(120deg, #073b80, #2586d8)",
    color: "white",
    marginBottom: "25px"
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "15px",
    marginBottom: "25px"
  },
  card: {
    background: "#e4efff",
    padding: "22px",
    borderRadius: "12px",
    textDecoration: "none",
    color: "#172554",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  },
  icon: {
    fontSize: "30px"
  },
  logoutCard: {
    background: "#fee7e7",
    padding: "22px",
    borderRadius: "12px",
    color: "#991b1b",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    font: "inherit"
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px"
  },
  panel: {
    background: "white",
    padding: "22px",
    borderRadius: "14px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    minWidth: 0
  },
  panelHeading: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px"
  },
  orderCount: {
    color: "#64748b"
  },
  orderItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    padding: "12px 0",
    borderBottom: "1px solid #e2e8f0"
  },
  status: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "7px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold"
  },
  info: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "15px 0",
    borderBottom: "1px solid #e2e8f0",
    overflowWrap: "anywhere"
  },
  editButton: {
    display: "block",
    textAlign: "center",
    background: "#0754c7",
    color: "white",
    padding: "13px",
    borderRadius: "8px",
    textDecoration: "none",
    marginTop: "20px"
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px",
    borderRadius: "8px"
  },
  footer: {
    textAlign: "center",
    padding: "25px",
    color: "#64748b"
  }
};

export default CustomerDashboard;
