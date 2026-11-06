import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import Admin from "./pages/Admin";
import AdminLogin from "./pages/Adminlogin";
import ProtectedRoute from "./pages/ProtectedRoute";
import CustomerSignup from "./pages/CustomerSignup";
import CustomerLogin from "./pages/CustomerLogin";
import ForgotPassword from "./pages/ForgotPassword";
import CustomerProfile from "./pages/CustomerProfile";
import MyOrders from "./pages/MyOrders";
import CustomerDashboard from "./pages/CustomerDashboard";
import OrderHistory from "./pages/OrderHistory";

function Home() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: auth.currentUser?.email || "",
    service: "",
    details: "",
  });

  const [loggingOut, setLoggingOut] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    if (submitting) return;

    try {
      if (
        !auth.currentUser ||
        form.email.trim().toLowerCase() !==
          auth.currentUser.email?.toLowerCase()
      ) {
        alert("Please use the email address linked to your account.");
        return;
      }

      if (
        !form.name.trim() ||
        !form.mobile.trim() ||
        !form.service ||
        !form.details.trim()
      ) {
        alert("Please fill in all project details.");
        return;
      }

      setSubmitting(true);

      await addDoc(collection(db, "orders"), {
        ...form,
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        details: form.details.trim(),
        createdAt: serverTimestamp(),
      });

      alert("Order Submitted Successfully!");

      setForm({
        name: "",
        mobile: "",
        email: auth.currentUser?.email || "",
        service: "",
        details: "",
      });
    } catch (error) {
      alert("Unable to submit order. Please try again.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-mark">SN</span>
          <span className="brand-name">
            SN WEB
            <small>TECHNOLOGIES</small>
          </span>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <a href="#home" onClick={closeMenu}>Home</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
          <Link to="/customer-dashboard" onClick={closeMenu}>Dashboard</Link>
          <Link to="/customer-profile" onClick={closeMenu}>My Profile</Link>
          <Link to="/my-orders" onClick={closeMenu}>My Orders</Link>

          <button
            className="nav-logout"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </nav>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">
              ✦ DIGITAL INNOVATION & WEB SOLUTIONS
            </span>

            <h1>
              Your Vision,
              <br />
              <span>Our Creation.</span>
            </h1>

            <p className="hero-description">
              We create modern, professional and powerful digital
              experiences that help your business grow online.
            </p>

            <div className="hero-buttons">
              <a href="#contact" className="primary-btn">
                Start Your Project <span>→</span>
              </a>

              <a href="#services" className="secondary-btn">
                Explore Services
              </a>
            </div>

            <div className="hero-trust">
              <span>✦ Professional Solutions</span>
              <span>✦ Modern Designs</span>
              <span>✦ Customer Focused</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-glow"></div>
            <div className="visual-card">
              <div className="visual-top">
                <span className="visual-dot"></span>
                <span className="visual-dot"></span>
                <span className="visual-dot"></span>
                <span className="visual-label">SN DIGITAL STUDIO</span>
              </div>

              <div className="visual-content">
                <div className="visual-icon">SN</div>
                <span className="visual-small">CREATIVE DIGITAL SOLUTIONS</span>
                <h2>Build Your<br /><span>Digital Future.</span></h2>
                <div className="visual-line"></div>
                <div className="visual-bottom">
                  <span>DESIGN</span>
                  <span>DEVELOP</span>
                  <span>GROW</span>
                </div>
              </div>
            </div>
            <div className="floating-badge">
              <span>✦</span> Ideas into Reality
            </div>
          </div>
        </section>

        <section className="services section-space" id="services">
          <div className="section-heading">
            <span className="eyebrow">WHAT WE DO</span>
            <h2>Our <span>Services</span></h2>
            <p>
              Smart digital solutions designed to move your business forward.
            </p>
          </div>

          <div className="cards">
            <article className="service-card">
              <div className="service-icon">⌘</div>
              <h3>Website Development</h3>
              <p>
                Modern and responsive websites built to represent
                your business professionally.
              </p>
              <a href="#contact">Get Started →</a>
            </article>

            <article className="service-card">
              <div className="service-icon">✧</div>
              <h3>Web Design</h3>
              <p>
                Attractive user interfaces and thoughtful designs
                for a better customer experience.
              </p>
              <a href="#contact">Get Started →</a>
            </article>

            <article className="service-card">
              <div className="service-icon">↗</div>
              <h3>Business Solutions</h3>
              <p>
                Digital solutions that help organize your work
                and grow your online presence.
              </p>
              <a href="#contact">Get Started →</a>
            </article>
          </div>
        </section>

        <section className="about-section section-space" id="about">
          <div className="about-decoration">SN</div>

          <div className="about-content">
            <span className="eyebrow">ABOUT OUR COMPANY</span>
            <h2>Creating Digital Experiences That <span>Matter.</span></h2>

            <p>
              SN WEB TECHNOLOGIES focuses on building modern websites,
              creative web designs and useful digital solutions.
              Our goal is to help businesses establish a strong
              and professional online presence.
            </p>

            <div className="about-details">
              <div>
                <strong>Founder</strong>
                <span>Ganga Naik</span>
              </div>
              <div>
                <strong>Location</strong>
                <span>Mayurbhanj, Odisha, India</span>
              </div>
            </div>
          </div>
        </section>

        <section className="order-section section-space" id="contact">
          <div className="section-heading">
            <span className="eyebrow">LET'S WORK TOGETHER</span>
            <h2>Start Your <span>Project</span></h2>
            <p>
              Tell us about your idea. Submit your project details
              and take the first step.
            </p>
          </div>

          <div className="order-layout">
            <div className="order-info">
              <h3>Have an idea?</h3>
              <p>
                We would love to hear about your project.
                Share your requirements using the form.
              </p>

              <div className="info-item">
                <span>✦</span>
                <div>
                  <strong>Professional Work</strong>
                  <small>Modern and thoughtful solutions</small>
                </div>
              </div>

              <div className="info-item">
                <span>✦</span>
                <div>
                  <strong>Customer First</strong>
                  <small>Your requirements matter to us</small>
                </div>
              </div>

              <div className="info-item">
                <span>✦</span>
                <div>
                  <strong>Based in Odisha</strong>
                  <small>Mayurbhanj, Odisha, India</small>
                </div>
              </div>
            </div>

            <div className="order-form">
              <h3>Project Enquiry Form</h3>

              <label htmlFor="customer-name">Your Name</label>
              <input
                id="customer-name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <label htmlFor="customer-mobile">Mobile Number</label>
              <input
                id="customer-mobile"
                type="tel"
                placeholder="Enter your mobile number"
                value={form.mobile}
                onChange={(e) =>
                  setForm({ ...form, mobile: e.target.value })
                }
              />

              <label htmlFor="customer-email">Email Address</label>
              <input
                id="customer-email"
                type="email"
                value={form.email}
                readOnly
              />

              <label htmlFor="customer-service">Choose Service</label>
              <select
                id="customer-service"
                value={form.service}
                onChange={(e) =>
                  setForm({ ...form, service: e.target.value })
                }
              >
                <option value="">Select a service</option>
                <option>Website Development</option>
                <option>Web Design</option>
                <option>Business Solution</option>
              </select>

              <label htmlFor="project-details">Project Details</label>
              <textarea
                id="project-details"
                placeholder="Describe your project and requirements..."
                value={form.details}
                onChange={(e) =>
                  setForm({ ...form, details: e.target.value })
                }
              />

              <button
                className="submit-btn"
                onClick={submitOrder}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Project Enquiry →"}
              </button>

              <small className="form-note">
                Your account email will be used for this enquiry.
              </small>
            </div>
          </div>
        </section>

        <section className="payment-section section-space">
          <div className="payment-card">
            <span className="eyebrow">PAYMENT INFORMATION</span>
            <h2>Simple & Secure <span>Payment</span></h2>
            <p>
              Use the UPI details below for payment.
              Please confirm the project amount before making payment.
            </p>

            <div className="upi-box">
              <span>UPI ID</span>
              <strong>7846944419@ybl</strong>
            </div>

            <div className="qr">
              QR CODE WILL BE ADDED SOON
            </div>

            <small>
              Please verify the recipient details in your payment app
              before confirming any transaction.
            </small>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-main">
          <div>
            <div className="footer-brand">SN WEB TECHNOLOGIES</div>
            <p>
              Building modern digital experiences
              for a better online future.
            </p>
          </div>

          <div className="footer-links">
            <strong>Quick Links</strong>
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-links">
            <strong>Customer Area</strong>
            <Link to="/customer-dashboard">Dashboard</Link>
            <Link to="/customer-profile">My Profile</Link>
            <Link to="/my-orders">My Orders</Link>
            <Link to="/order-history">Order History</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>Made with ❤️ by Ganga Naik</span>
          <span>Mayurbhanj, Odisha, India</span>
          <span>© {new Date().getFullYear()} SN WEB TECHNOLOGIES</span>
        </div>
      </footer>
    </div>
  );
}

function Welcome() {
  return (
    <div className="welcome-page">
      <div className="welcome-card">
        <div className="welcome-logo">SN</div>
        <h2>SN WEB TECHNOLOGIES</h2>
        <span className="eyebrow">WELCOME TO OUR DIGITAL WORLD</span>

        <h3>Welcome!</h3>
        <p>Sign in or create an account to continue.</p>

        <Link to="/customer-login" className="welcome-login">
          Customer Login
        </Link>

        <Link to="/customer-signup" className="welcome-signup">
          Create New Account
        </Link>

        <p className="admin-link">
          <Link to="/admin-login">Admin Login</Link>
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
    return <div className="loading-screen">Loading...</div>;
  }

  return user ? <Home /> : <Welcome />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeGate />} />

      <Route path="/customer-signup" element={<CustomerSignup />} />
      <Route path="/customer-login" element={<CustomerLogin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/customer-profile" element={<CustomerProfile />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/order-history" element={<OrderHistory />} />
      <Route path="/customer-dashboard" element={<CustomerDashboard />} />

      <Route path="/admin-login" element={<AdminLogin />} />

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
