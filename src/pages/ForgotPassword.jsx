
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link sent to your email!");
      setEmail("");
    } catch (err) {
      console.error("Forgot Password Error:", err);
      setError(err.code + ": " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f3f4f6",
      fontFamily: "Arial",
      padding: "20px",
      boxSizing: "border-box"
    }}>
      <form
        onSubmit={handleReset}
        style={{
          background: "white",
          color: "#111827",
          padding: "30px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "380px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          SN WEB TECHNOLOGIES
        </h2>

        <h3 style={{ textAlign: "center" }}>
          Forgot Password
        </h3>

        <p>Enter your registered email address.</p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            boxSizing: "border-box"
          }}
        />

        {message && (
          <p style={{ color: "green" }}>{message}</p>
        )}

        {error && (
          <p style={{
            color: "red",
            overflowWrap: "anywhere"
          }}>
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
            color: "white",
            border: "none",
            borderRadius: "6px"
          }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
