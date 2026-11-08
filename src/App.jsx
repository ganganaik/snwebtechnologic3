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
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CustomerChat from "./pages/CustomerChat";
import AdminChats from "./pages/AdminChats";

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
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [submissionError, setSubmissionError] = useState(false);
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

    setSubmissionMessage("");
    setSubmissionError(false);

    if (
      !auth.currentUser ||
      form.email.trim().toLowerCase() !==
        auth.currentUser.email?.toLowerCase()
    ) {
      setSubmissionError(true);
      setSubmissionMessage(
        "Please use the email address linked to your account."
      );
      return;
    }

    if (
      !form.name.trim() ||
      !form.mobile.trim() ||
      !form.service ||
      !form.details.trim()
    ) {
      setSubmissionError(true);
      setSubmissionMessage("Please fill in all project details.");
      return;
    }

    if (!/^[0-9+\-\s()]{7,20}$/.test(form.mobile.trim())) {
      setSubmissionError(true);
      setSubmissionMessage("Please enter a valid mobile number.");
      return;
    }

    try {
      setSubmitting(true);

      await addDoc(collection(db, "orders"), {
        ...form,
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        email: auth.currentUser.email,
        details: form.details.trim(),
        createdAt: serverTimestamp(),
      });

      setSubmissionError(false);
      setSubmissionMessage(
        "Your project enquiry has been submitted successfully!"
      );

      setForm({
        name: "",
        mobile: "",
        email: auth.currentUser?.email || "",
        service: "",
        details: "",
      });
    } catch (error) {
      setSubmissionError(true);
      setSubmissionMessage(
        "Unable to submit your enquiry. Please check your connection and try again."
      );
      console.error("Order submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app">
      {/* Diwali Special Banner */}
      <style>{`
        .diwali-banner {
          position: relative !important;
          isolation: isolate !important;
          z-index: 99999 !important;
          display: block !important;
          box-sizing: border-box !important;
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          overflow: hidden !important;
          padding: 13px 10px 12px !important;
          text-align: center !important;
          background: linear-gradient(90deg, #100b04, #241707, #100b04);
          border-bottom: 1px solid rgba(214, 173, 85, 0.45);
          transform: none !important;
          contain: none !important;
        }

        .diwali-banner .diwali-marquee {
          position: relative !important;
          display: block !important;
          box-sizing: border-box !important;
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          height: auto !important;
          min-height: 24px !important;
          overflow: hidden !important;
          white-space: normal !important;
          background: transparent !important;
          transform: none !important;
        }

        .diwali-banner .diwali-marquee span {
          position: static !important;
          display: block !important;
          box-sizing: border-box !important;
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          padding: 0 !important;
          margin: 0 auto !important;
          color: #f5c96b;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 1.5px;
          line-height: 24px;
          text-align: center !important;
          white-space: normal !important;
          transform: none !important;
          -webkit-transform: none !important;
          animation: none !important;
          -webkit-animation: none !important;
          will-change: auto !important;
        }

        .diwali-banner .diwali-quote {
          position: relative !important;
          display: block !important;
          box-sizing: border-box !important;
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          margin: 9px auto 0 !important;
          color: #f0d18b;
          font-size: 13px;
          line-height: 1.65;
          font-weight: 500;
          letter-spacing: 0.2px;
          text-align: center !important;
          overflow-wrap: break-word;
        }

        .diwali-banner .diwali-gm {
          margin-top: 8px;
          color: #d6ad55;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          line-height: 1.1;
          text-align: center;
        }

        .diwali-banner .diwali-founder {
          margin-top: 1px;
          color: #f5c96b;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 1.2px;
          line-height: 1.2;
          text-align: center;
        }

        @media (max-width: 520px) {
          .diwali-banner .diwali-marquee span {
            font-size: 13px;
            letter-spacing: 0.7px;
          }

          .diwali-banner .diwali-quote {
            font-size: 12px;
            line-height: 1.7;
          }
        }

        .diwali-banner::before,
        .diwali-banner::after {
          content: none !important;
          display: none !important;
        }

        .diwali-banner > * {
          position: relative !important;
          z-index: 1 !important;
        }
      `}</style>

      <div className="diwali-banner">
        <div className="diwali-marquee">
          <span>
            🪔 ✨ HAPPY DIWALI FROM OUR SN HUB ✨ 🪔
          </span>
        </div>

        <div className="diwali-quote">
          <div>Pane ko abhi kai mukaam baki hai</div>
          <div>Iss khel ke kai imtehaan baki hai..</div>
          <div>Abhi toh naapi hai apne mutthi bhar zameen</div>
          <div>Abhi toh aage pura asman baki hai</div>
        </div>

        <div className="diwali-gm">(GM)</div>
        <div className="diwali-founder">- Ganga Naik -</div>
      </div>

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
          <Link to="/services" onClick={closeMenu}>Services</Link>
          <Link to="/about" onClick={closeMenu}>About</Link>
          <Link to="/contact" onClick={closeMenu}>Contact</Link>
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

        <section className="why-section section-space">
          <style>{`
            .why-section {
              padding: 85px 7%;
              background: #0d0d0d;
            }

            .why-heading {
              text-align: center;
              max-width: 700px;
              margin: 0 auto 45px;
            }

            .why-heading h2 {
              font-size: clamp(30px, 5vw, 44px);
              margin: 14px 0;
              color: #f8f5ed;
            }

            .why-heading h2 span {
              color: #d6ad55;
            }

            .why-heading p {
              color: #aaa;
              line-height: 1.7;
            }

            .why-grid {
              display: grid;
              grid-template-columns: repeat(4, minmax(0, 1fr));
              gap: 20px;
              max-width: 1200px;
              margin: auto;
            }

            .why-card {
              background: #151515;
              border: 1px solid rgba(214, 173, 85, 0.2);
              border-radius: 14px;
              padding: 28px 22px;
              transition: transform 0.25s ease, border-color 0.25s ease;
            }

            .why-card:hover {
              transform: translateY(-6px);
              border-color: #d6ad55;
            }

            .why-icon {
              width: 48px;
              height: 48px;
              display: grid;
              place-items: center;
              border-radius: 12px;
              background: rgba(214, 173, 85, 0.12);
              color: #d6ad55;
              font-size: 25px;
              margin-bottom: 20px;
            }

            .why-card h3 {
              color: #f8f5ed;
              font-size: 18px;
              margin-bottom: 12px;
            }

            .why-card p {
              color: #aaa;
              font-size: 14px;
              line-height: 1.7;
            }

            @media (max-width: 900px) {
              .why-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
              }
            }

            @media (max-width: 520px) {
              .why-section {
                padding: 60px 5%;
              }

              .why-grid {
                grid-template-columns: 1fr;
              }

              .why-card {
                padding: 24px 20px;
              }
            }
          `}</style>

          <div className="why-heading">
            <span className="eyebrow">THE SN DIFFERENCE</span>
            <h2>Why Choose <span>SN Web Technologies?</span></h2>
            <p>
              We focus on understanding your requirements and creating
              useful digital solutions for your business.
            </p>
          </div>

          <div className="why-grid">
            <article className="why-card">
              <div className="why-icon">⌘</div>
              <h3>Professional Development</h3>
              <p>
                Websites developed with care, quality and attention
                to your business requirements.
              </p>
            </article>

            <article className="why-card">
              <div className="why-icon">✧</div>
              <h3>Modern Responsive Design</h3>
              <p>
                Clean and modern designs made to work across
                mobile phones, tablets and computers.
              </p>
            </article>

            <article className="why-card">
              <div className="why-icon">♡</div>
              <h3>Customer Focused</h3>
              <p>
                Your ideas and requirements guide our approach
                throughout the project.
              </p>
            </article>

            <article className="why-card">
              <div className="why-icon">↗</div>
              <h3>Project Support</h3>
              <p>
                Clear communication and support during the
                project development process.
              </p>
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
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  setSubmissionMessage("");
                }}
              />

              <label htmlFor="customer-mobile">Mobile Number</label>
              <input
                id="customer-mobile"
                type="tel"
                placeholder="Enter your mobile number"
                value={form.mobile}
                onChange={(e) => {
                  setForm({ ...form, mobile: e.target.value });
                  setSubmissionMessage("");
                }}
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
                onChange={(e) => {
                  setForm({ ...form, service: e.target.value });
                  setSubmissionMessage("");
                }}
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
                onChange={(e) => {
                  setForm({ ...form, details: e.target.value });
                  setSubmissionMessage("");
                }}
              />

              {submissionMessage && (
                <div
                  role={submissionError ? "alert" : "status"}
                  aria-live="polite"
                  style={{
                    marginTop: "18px",
                    padding: "13px 15px",
                    borderRadius: "7px",
                    background: submissionError
                      ? "rgba(220, 70, 70, 0.12)"
                      : "rgba(70, 180, 110, 0.12)",
                    border: submissionError
                      ? "1px solid rgba(220, 90, 90, 0.5)"
                      : "1px solid rgba(70, 180, 110, 0.5)",
                    color: submissionError ? "#ff9999" : "#8ee0a8",
                    fontSize: "13px",
                    lineHeight: "1.6",
                  }}
                >
                  {submissionMessage}
                </div>
              )}

              <button
                className="submit-btn"
                onClick={submitOrder}
                disabled={submitting}
                aria-busy={submitting}
              >
                {submitting ? "Submitting your enquiry..." : "Submit Project Enquiry →"}
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
              <strong>gm627@ybl</strong>
            </div>

            <div className="qr">
              <img
                src="/payment-qr.png"
                alt="Payment QR Code for gm627@ybl"
                style={{
                  display: "block",
                  width: "100%",
                  maxWidth: "280px",
                  height: "auto",
                  margin: "0 auto",
                  borderRadius: "10px",
                }}
              />
            </div>

            <small>
              Please verify that the recipient UPI ID is gm627@ybl
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
            <p>
              Email:{" "}
              <a
                href="mailto:twelvefailuresth@gmail.com"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                twelvefailuresth@gmail.com
              </a>
            </p>
          </div>

          <div className="footer-links">
            <strong>Quick Links</strong>
            <a href="#home">Home</a>
            <Link to="/services">Services</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
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

      <Route path="/services" element={<Services />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="/customer-signup" element={<CustomerSignup />} />
      <Route path="/customer-login" element={<CustomerLogin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/customer-profile" element={<CustomerProfile />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/order-history" element={<OrderHistory />} />
      <Route path="/customer-dashboard" element={<CustomerDashboard />} />

      <Route path="/customer-chat" element={<CustomerChat />} />

      <Route path="/admin-login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-chats"
        element={
          <ProtectedRoute>
            <AdminChats />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
