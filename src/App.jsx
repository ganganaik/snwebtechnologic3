
import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

import Admin from "./pages/Admin";
import AdminLogin from "./pages/Adminlogin";
import ProtectedRoute from "./pages/ProtectedRoute";
import CustomerSignup from "./pages/CustomerSignup";
import CustomerLogin from "./pages/CustomerLogin";
import ForgotPassword from "./pages/ForgotPassword";
import CustomerProfile from "./pages/CustomerProfile";
import MyOrders from "./pages/MyOrders";

function Home() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    service: "",
    details: ""
  });

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      setLoggingOut(false);
      alert("Logout failed. Please try again.");
      console.error(error);
    }
  };

  const submitOrder = async () => {
    try {
      await addDoc(collection(db, "orders"), form);

      alert("Order Submitted Successfully!");

      setForm({
        name: "",
        mobile: "",
        email: "",
        service: "",
        details: ""
      });
    } catch (error) {
      alert("Unable to submit order. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h2>SN WEB TECHNOLOGIES</h2>

        <div>
          <a href="#">Home</a>
          <a href="#">Services</a>
          <a href="#">About</a>
          <a href="#">Contact</a>

          <Link to="/customer-profile">My Profile</Link>
          <Link to="/my-orders">My Orders</Link>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </nav>

      <section className="hero">
        <h1>
          Your Vision,
          <br />
          Our Creation
        </h1>

        <p>Premium Website Development Company</p>
        <p>Founder: <b>Ganga Naik</b></p>
        <p>📍 Mayurbhanj, Odisha, India 🇮🇳</p>

        <button>Get Started</button>
      </section>

      <section className="services">
        <h2>Our Services</h2>

        <div className="cards">
          <div>
            <h3>Website Development</h3>
            <p>Modern & Professional Websites</p>
          </div>

          <div>
            <h3>Web Design</h3>
            <p>Premium UI/UX Designs</p>
          </div>

          <div>
            <h3>Business Solutions</h3>
            <p>Grow your business online</p>
          </div>
        </div>
      </section>

      <section className="order">
        <h2>Start Your Project</h2>

        <p>Fill the details and we will contact you.</p>

        <input
          type="text"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="tel"
          placeholder="Mobile Number"
          value={form.mobile}
          onChange={(e) =>
            setForm({ ...form, mobile: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <select
          value={form.service}
          onChange={(e) =>
            setForm({ ...form, service: e.target.value })
          }
        >
          <option value="">Choose Service</option>
          <option>Website Development</option>
          <option>Web Design</option>
          <option>Business Solution</option>
        </select>

        <textarea
          placeholder="Tell us about your project"
          value={form.details}
          onChange={(e) =>
            setForm({ ...form, details: e.target.value })
          }
        />

        <button onClick={submitOrder}>
          Submit Order
        </button>

        <div className="payment">
          <h2>Payment</h2>

          <p>
            UPI ID: <b>7846944419@ybl</b>
          </p>

          <p>Scan QR Code to Pay</p>

          <div className="qr">
            QR CODE WILL BE ADDED SOON
          </div>
        </div>
      </section>

      <footer>
        Made with ❤️ by Ganga Naik
        <br />
        Mayurbhanj, Odisha, India
      </footer>
    </div>
  );
}

function Welcome() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f3f4f6",
      fontFamily: "Arial",
      padding: "20px"
    }}>
      <div style={{
        background: "white",
        padding: "35px",
        borderRadius: "15px",
        width: "100%",
        maxWidth: "400px",
        textAlign: "center",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
      }}>
        <h2>SN WEB TECHNOLOGIES</h2>

        <h3>Welcome!</h3>

        <p>Welcome to our website.</p>

        <p>Already have an account?</p>

        <Link to="/customer-login" style={{
          display: "block",
          padding: "13px",
          background: "#111827",
          color: "white",
          textDecoration: "none",
          borderRadius: "7px",
          marginBottom: "20px"
        }}>
          Customer Login
        </Link>

        <p>New to SN WEB TECHNOLOGIES?</p>

        <Link to="/customer-signup" style={{
          display: "block",
          padding: "13px",
          background: "#2563eb",
          color: "white",
          textDecoration: "none",
          borderRadius: "7px"
        }}>
          Create New Account
        </Link>

        <p style={{ marginTop: "25px" }}>
          <Link to="/admin-login">
            Admin Login
          </Link>
        </p>
      </div>
    </div>
  );
}

function HomeGate() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  if (checking) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  return user ? <Home /> : <Welcome />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeGate />} />

      <Route
        path="/customer-signup"
        element={<CustomerSignup />}
      />

      <Route
        path="/customer-login"
        element={<CustomerLogin />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/customer-profile"
        element={<CustomerProfile />}
      />

      <Route
        path="/my-orders"
        element={<MyOrders />}
      />

      <Route
        path="/admin-login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
