
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (error) {
      setError("Invalid email or password. Please try again.");
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
        onSubmit={handleLogin}
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
          Admin Login
        </h3>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          {loading ? "Logging in..." : "Login"}
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

export default AdminLogin;
