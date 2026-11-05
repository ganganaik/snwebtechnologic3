import { Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
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

  const submitOrder = async () => {
    await addDoc(collection(db, "orders"), form);

    alert("Order Submitted Successfully!");

    setForm({
      name: "",
      mobile: "",
      email: "",
      service: "",
      details: ""
    });
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
          <option>Choose Service</option>
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

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
