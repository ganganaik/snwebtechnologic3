
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function CustomerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/customer-dashboard";
    } catch (error) {
      setError("Email or password is incorrect.");
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
        boxSizing: "border-box"
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: "#ffffff",
          padding: "30px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "380px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          boxSizing: "border-box"
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#111827",
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "15px"
          }}
        >
          SN WEB TECHNOLOGIES
        </h2>

        <h3
          style={{
            textAlign: "center",
            color: "#111827",
            fontSize: "22px",
            marginBottom: "20px"
          }}
        >
          Customer Login
        </h3>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            ...inputStyle,
            color: "#111827",
            background: "#ffffff",
            border: "1px solid #9ca3af"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            ...inputStyle,
            color: "#111827",
            background: "#ffffff",
            border: "1px solid #9ca3af"
          }}
        />

        <div style={{ textAlign: "right", marginBottom: "15px" }}>
          <a
            href="/forgot-password"
            style={{
              color: "#2563eb",
              fontSize: "14px",
              textDecoration: "none",
              fontWeight: "bold"
            }}
          >
            Forgot Password?
          </a>
        </div>

        {error && (
          <p style={{ color: "#dc2626", fontSize: "14px" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? "Logging In..." : "Login"}
        </button>

        <style>{`
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
  borderRadius: "6px",
  fontSize: "16px"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#111827",
  color: "#ffffff",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  cursor: "pointer"
};

export default CustomerLogin;
