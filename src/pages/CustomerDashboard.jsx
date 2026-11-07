
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  onAuthStateChanged,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "firebase/auth";
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

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

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

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current password.");
      return;
    }

    if (!user?.email) {
      setPasswordError("User email not available. Please login again.");
      return;
    }

    try {
      setPasswordLoading(true);

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordMessage("Your password has been changed successfully.");
    } catch (err) {
      console.error(err);

      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setPasswordError("Current password is incorrect.");
      } else if (err.code === "auth/weak-password") {
        setPasswordError("Please choose a stronger password.");
      } else if (err.code === "auth/requires-recent-login") {
        setPasswordError("Please logout and login again, then try changing your password.");
      } else {
        setPasswordError("Unable to change password. Please try again.");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const value = (status || "Pending").toLowerCase();

    if (value === "completed") {
      return {
        background: "rgba(34,197,94,0.12)",
        color: "#4ade80",
        border: "1px solid rgba(34,197,94,0.3)"
      };
    }

    if (value === "in progress") {
      return {
        background: "rgba(59,130,246,0.12)",
        color: "#60a5fa",
        border: "1px solid rgba(59,130,246,0.3)"
      };
    }

    return {
      background: "rgba(212,175,55,0.12)",
      color: "#e5c45f",
      border: "1px solid rgba(212,175,55,0.3)"
    };
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingText}>Loading your dashboard...</div>
      </div>
    );
  }

  const customerName =
    profile.name || user?.displayName || "Customer";

  const pendingOrders = orders.filter(
    (order) => (order.status || "Pending").toLowerCase() === "pending"
  ).length;

  const completedOrders = orders.filter(
    (order) => (order.status || "").toLowerCase() === "completed"
  ).length;

  const inProgressOrders = orders.filter(
    (order) => (order.status || "").toLowerCase() === "in progress"
  ).length;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <Link to="/" style={styles.brandLink}>
          <div style={styles.logo}>SN</div>
          <div>
            <h2 style={styles.brand}>SN WEB TECHNOLOGIES</h2>
            <p style={styles.tagline}>CUSTOMER PORTAL</p>
          </div>
        </Link>

        <div style={styles.headerActions}>
          <Link to="/" style={styles.homeLink}>Home</Link>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={styles.headerLogout}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </header>

      <main style={styles.container}>
        <section style={styles.welcome}>
          <div>
            <span style={styles.eyebrow}>CUSTOMER DASHBOARD</span>
            <h1>Welcome Back, {customerName}!</h1>
            <p>
              Manage your account, follow your projects and
              keep track of your orders.
            </p>
          </div>

          <div style={styles.welcomeIcon}>✦</div>
        </section>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>📦</span>
            <div>
              <p style={styles.statLabel}>Total Orders</p>
              <h2 style={styles.statNumber}>{orders.length}</h2>
            </div>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statIcon}>⏳</span>
            <div>
              <p style={styles.statLabel}>Pending</p>
              <h2 style={styles.statNumber}>{pendingOrders}</h2>
            </div>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statIcon}>⚙️</span>
            <div>
              <p style={styles.statLabel}>In Progress</p>
              <h2 style={styles.statNumber}>{inProgressOrders}</h2>
            </div>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statIcon}>✓</span>
            <div>
              <p style={styles.statLabel}>Completed</p>
              <h2 style={styles.statNumber}>{completedOrders}</h2>
            </div>
          </div>
        </section>

        <section style={styles.quickSection}>
          <h2 style={styles.sectionTitle}>Quick Access</h2>

          <div style={styles.quickGrid}>
            <Link to="/customer-profile" style={styles.quickCard}>
              <span style={styles.quickIcon}>👤</span>
              <h3>My Profile</h3>
              <p>View and edit your details</p>
              <span style={styles.cardArrow}>→</span>
            </Link>

            <Link to="/my-orders" style={styles.quickCard}>
              <span style={styles.quickIcon}>📦</span>
              <h3>My Orders</h3>
              <p>Track your current projects</p>
              <span style={styles.cardArrow}>→</span>
            </Link>

            <Link to="/order-history" style={styles.quickCard}>
              <span style={styles.quickIcon}>🕒</span>
              <h3>Order History</h3>
              <p>See your previous orders</p>
              <span style={styles.cardArrow}>→</span>
            </Link>

            <Link to="/customer-chat" style={styles.quickCard}>
              <span style={styles.quickIcon}>💬</span>
              <h3>Customer Support Chat</h3>
              <p>Chat directly with our admin team</p>
              <span style={styles.cardArrow}>→</span>
            </Link>
          </div>
        </section>

        <section style={styles.passwordSection}>
          <div style={styles.panelHeading}>
            <div>
              <span style={styles.panelEyebrow}>ACCOUNT SECURITY</span>
              <h2>Change Password</h2>
            </div>
            <span style={styles.passwordIcon}>🔒</span>
          </div>

          <p style={styles.passwordDescription}>
            Keep your account secure by updating your password.
          </p>

          {passwordMessage && (
            <div style={styles.successMessage}>
              {passwordMessage}
            </div>
          )}

          {passwordError && (
            <div style={styles.error}>
              {passwordError}
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            <div style={styles.passwordField}>
              <label style={styles.passwordLabel}>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                autoComplete="current-password"
                style={styles.passwordInput}
                disabled={passwordLoading}
              />
            </div>

            <div style={styles.passwordField}>
              <label style={styles.passwordLabel}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                autoComplete="new-password"
                style={styles.passwordInput}
                disabled={passwordLoading}
              />
            </div>

            <div style={styles.passwordField}>
              <label style={styles.passwordLabel}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                autoComplete="new-password"
                style={styles.passwordInput}
                disabled={passwordLoading}
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              style={{
                ...styles.passwordButton,
                opacity: passwordLoading ? 0.6 : 1
              }}
            >
              {passwordLoading ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        </section>

        <section style={styles.contentGrid}>
          <div style={styles.panel}>
            <div style={styles.panelHeading}>
              <div>
                <span style={styles.panelEyebrow}>YOUR PROJECTS</span>
                <h2>Recent Orders</h2>
              </div>

              <Link to="/my-orders" style={styles.viewLink}>
                View All →
              </Link>
            </div>

            <p style={styles.orderCount}>
              You have {orders.length} total order{orders.length !== 1 ? "s" : ""}
            </p>

            {orders.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={styles.emptyIcon}>📂</span>
                <h3>No Orders Yet</h3>
                <p>
                  Your project orders will appear here
                  after you submit an enquiry.
                </p>
                <Link to="/" style={styles.emptyButton}>
                  Explore Services →
                </Link>
              </div>
            ) : (
              orders.slice(0, 3).map((order) => (
                <div key={order.id} style={styles.orderItem}>
                  <div style={styles.orderDetails}>
                    <h3>{order.service || "Project Enquiry"}</h3>
                    <p>{order.name || customerName}</p>
                  </div>

                  <span
                    style={{
                      ...styles.status,
                      ...getStatusStyle(order.status)
                    }}
                  >
                    {order.status || "Pending"}
                  </span>
                </div>
              ))
            )}
          </div>

          <div style={styles.panel}>
            <div style={styles.panelHeading}>
              <div>
                <span style={styles.panelEyebrow}>YOUR ACCOUNT</span>
                <h2>Account Information</h2>
              </div>
            </div>

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
              Edit My Profile →
            </Link>
          </div>
        </section>

        <section style={styles.bottomBanner}>
          <div>
            <h2>Have a New Project Idea?</h2>
            <p>Let's turn your idea into a professional digital experience.</p>
          </div>
          <Link to="/" style={styles.bannerButton}>
            Start a Project →
          </Link>
        </section>
      </main>

      <footer style={styles.footer}>
        <strong>SN WEB TECHNOLOGIES</strong>
        <p>Made with ❤️ by Ganga Naik</p>
        <span>© {new Date().getFullYear()} SN WEB TECHNOLOGIES</span>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#080808",
    color: "#f8f5ed",
    fontFamily: "Arial, sans-serif"
  },
  header: {
    background: "#050505",
    padding: "16px 6%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    borderBottom: "1px solid rgba(212,175,55,0.35)"
  },
  brandLink: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "inherit",
    textDecoration: "none"
  },
  logo: {
    width: "45px",
    height: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #d4af37",
    borderRadius: "10px",
    color: "#d4af37",
    fontSize: "20px",
    fontWeight: "bold"
  },
  brand: {
    margin: 0,
    color: "#e5c45f",
    fontSize: "16px"
  },
  tagline: {
    margin: "5px 0 0",
    color: "#969187",
    fontSize: "10px",
    letterSpacing: "2px"
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap"
  },
  homeLink: {
    color: "#d4af37",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "14px"
  },
  headerLogout: {
    padding: "10px 17px",
    background: "transparent",
    color: "#d4af37",
    border: "1px solid #d4af37",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  container: {
    maxWidth: "1200px",
    margin: "auto",
    padding: "35px 20px"
  },
  welcome: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    padding: "35px",
    borderRadius: "15px",
    background: "linear-gradient(120deg, #211b0d, #12110d)",
    border: "1px solid rgba(212,175,55,0.45)",
    marginBottom: "25px"
  },
  eyebrow: {
    color: "#d4af37",
    fontSize: "11px",
    fontWeight: "bold",
    letterSpacing: "2px"
  },
  welcomeTitle: {
    color: "white"
  },
  welcomeIcon: {
    color: "#d4af37",
    fontSize: "65px"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "15px",
    marginBottom: "35px"
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "20px",
    background: "#141414",
    border: "1px solid #39301c",
    borderRadius: "12px"
  },
  statIcon: {
    fontSize: "27px"
  },
  statLabel: {
    margin: "0 0 7px",
    color: "#aaa69d",
    fontSize: "12px"
  },
  statNumber: {
    margin: 0,
    color: "#e5c45f",
    fontSize: "26px"
  },
  quickSection: {
    marginBottom: "35px"
  },
  sectionTitle: {
    color: "#e5c45f",
    fontSize: "22px",
    marginBottom: "18px"
  },
  quickGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "15px"
  },
  quickCard: {
    position: "relative",
    display: "block",
    padding: "22px",
    background: "#141414",
    border: "1px solid #39301c",
    borderRadius: "12px",
    color: "#f8f5ed",
    textDecoration: "none"
  },
  quickIcon: {
    fontSize: "27px"
  },
  quickCardTitle: {
    color: "#e5c45f"
  },
  cardArrow: {
    display: "block",
    marginTop: "12px",
    color: "#d4af37",
    fontWeight: "bold"
  },
  passwordSection: {
    background: "#141414",
    padding: "25px",
    border: "1px solid #39301c",
    borderRadius: "14px",
    marginBottom: "35px",
    maxWidth: "650px"
  },
  passwordIcon: {
    fontSize: "28px"
  },
  passwordDescription: {
    color: "#aaa69d",
    fontSize: "13px",
    margin: "15px 0 22px"
  },
  passwordField: {
    marginBottom: "17px"
  },
  passwordLabel: {
    display: "block",
    color: "#e5c45f",
    fontSize: "13px",
    fontWeight: "bold",
    marginBottom: "8px"
  },
  passwordInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px",
    background: "#080808",
    border: "1px solid #514326",
    borderRadius: "7px",
    color: "#fff",
    fontSize: "14px",
    outline: "none"
  },
  passwordButton: {
    width: "100%",
    padding: "13px",
    background: "#d4af37",
    color: "#080808",
    border: "none",
    borderRadius: "7px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "5px"
  },
  successMessage: {
    background: "rgba(34,197,94,0.12)",
    color: "#4ade80",
    border: "1px solid rgba(34,197,94,0.3)",
    padding: "12px",
    borderRadius: "7px",
    marginBottom: "18px",
    fontSize: "13px"
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px"
  },
  panel: {
    background: "#141414",
    padding: "24px",
    border: "1px solid #39301c",
    borderRadius: "14px",
    minWidth: 0
  },
  panelHeading: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px"
  },
  panelEyebrow: {
    color: "#d4af37",
    fontSize: "10px",
    letterSpacing: "2px"
  },
  panelTitle: {
    color: "#fff"
  },
  viewLink: {
    color: "#d4af37",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "bold"
  },
  orderCount: {
    color: "#969187",
    fontSize: "13px",
    margin: "15px 0"
  },
  orderItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: "15px 0",
    borderBottom: "1px solid #302817"
  },
  orderDetails: {
    minWidth: 0
  },
  status: {
    flexShrink: 0,
    padding: "7px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "bold"
  },
  info: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "15px 0",
    borderBottom: "1px solid #302817",
    overflowWrap: "anywhere",
    fontSize: "13px"
  },
  editButton: {
    display: "block",
    textAlign: "center",
    background: "#d4af37",
    color: "#080808",
    padding: "13px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    marginTop: "20px"
  },
  emptyState: {
    padding: "30px 10px",
    textAlign: "center"
  },
  emptyIcon: {
    fontSize: "35px"
  },
  emptyButton: {
    display: "inline-block",
    marginTop: "12px",
    padding: "11px 17px",
    background: "#d4af37",
    color: "#080808",
    borderRadius: "7px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "13px"
  },
  error: {
    background: "#351515",
    color: "#ffaaaa",
    padding: "13px",
    border: "1px solid #7f2929",
    borderRadius: "8px",
    marginBottom: "20px"
  },
  bottomBanner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    marginTop: "30px",
    padding: "25px",
    background: "#17150e",
    border: "1px solid #5e4d26",
    borderRadius: "12px"
  },
  bannerButton: {
    padding: "12px 18px",
    background: "#d4af37",
    color: "#080808",
    borderRadius: "7px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "13px"
  },
  footer: {
    textAlign: "center",
    padding: "28px 15px",
    background: "#050505",
    borderTop: "1px solid rgba(212,175,55,0.3)",
    color: "#969187",
    fontSize: "12px"
  },
  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#080808"
  },
  loadingText: {
    color: "#d4af37",
    fontSize: "16px"
  }
};

export default CustomerDashboard;
