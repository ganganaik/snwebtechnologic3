
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

function CustomerSignup() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "customers", result.user.uid), {
        name,
        mobile,
        email: result.user.email,
        createdAt: serverTimestamp(),
      });

      window.location.href = "/customer-dashboard";

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f4f6",
        fontFamily: "Arial",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <form
        onSubmit={handleSignup}
        style={{
          background: "#ffffff",
          padding: "30px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "380px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#111827",
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "15px",
          }}
        >
          SN WEB TECHNOLOGIES
        </h2>

        <h3
          style={{
            textAlign: "center",
            color: "#111827",
            fontSize: "22px",
            marginBottom: "20px",
          }}
        >
          Customer Signup
        </h3>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="tel"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password (Minimum 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
          style={inputStyle}
        />

        {error && (
          <p style={{ color: "#dc2626", fontSize: "14px" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: "#111827",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <style>{`
          input {
            color: #111827 !important;
            background: #ffffff !important;
            border: 1px solid #9ca3af;
            border-radius: 6px;
            font-size: 16px;
          }

          input::placeholder {
            color: #6b7280 !important;
            opacity: 1;
          }
        `}</style>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  boxSizing: "border-box",
};

export default CustomerSignup;
