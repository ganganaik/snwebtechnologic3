
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

function CustomerProfile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
          const data = profileSnap.data();
          setName(data.name || "");
          setMobile(data.mobile || "");
          setEmail(data.email || currentUser.email || "");
          setAddress(data.address || "");
        } else {
          setError("Customer profile not found.");
        }
      } catch (err) {
        console.error("Profile Loading Error:", err);
        setError("Unable to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!user) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      await updateDoc(doc(db, "customers", user.uid), {
        name,
        mobile,
        address
      });

      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Profile Update Error:", err);
      setError("Unable to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#080808",
      color: "#f8f5ed",
      padding: "30px 15px",
      fontFamily: "Arial, sans-serif",
      boxSizing: "border-box"
    },
    container: {
      maxWidth: "550px",
      margin: "0 auto"
    },
    loading: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#080808",
      color: "#d4af37",
      fontFamily: "Arial, sans-serif",
      fontSize: "17px"
    },
    backLink: {
      display: "inline-block",
      marginBottom: "22px",
      color: "#d4af37",
      textDecoration: "none",
      fontWeight: "bold",
      fontSize: "14px"
    },
    card: {
      background: "#141414",
      border: "1px solid #292929",
      padding: "30px",
      borderRadius: "15px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
      boxSizing: "border-box"
    },
    header: {
      textAlign: "center",
      marginBottom: "30px"
    },
    avatar: {
      width: "78px",
      height: "78px",
      borderRadius: "50%",
      background: "#d4af37",
      color: "#080808",
      fontSize: "32px",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 16px",
      border: "3px solid #806820"
    },
    company: {
      color: "#d4af37",
      fontSize: "21px",
      margin: "10px 0",
      letterSpacing: "0.5px"
    },
    heading: {
      color: "#f8f5ed",
      fontSize: "25px",
      margin: "12px 0"
    },
    subtitle: {
      color: "#aaa",
      fontSize: "14px",
      lineHeight: "1.6"
    },
    label: {
      display: "block",
      color: "#e4c45c",
      fontWeight: "bold",
      fontSize: "14px",
      marginBottom: "9px"
    },
    input: {
      width: "100%",
      padding: "13px",
      marginBottom: "21px",
      background: "#1d1d1d",
      color: "#f8f5ed",
      border: "1px solid #444",
      borderRadius: "8px",
      fontSize: "15px",
      boxSizing: "border-box",
      outlineColor: "#d4af37"
    },
    disabledInput: {
      background: "#252525",
      color: "#999",
      cursor: "not-allowed"
    },
    textarea: {
      width: "100%",
      padding: "13px",
      marginBottom: "20px",
      background: "#1d1d1d",
      color: "#f8f5ed",
      border: "1px solid #444",
      borderRadius: "8px",
      fontSize: "15px",
      boxSizing: "border-box",
      resize: "vertical",
      fontFamily: "Arial, sans-serif",
      outlineColor: "#d4af37"
    },
    button: {
      width: "100%",
      padding: "14px",
      background: saving ? "#806820" : "#d4af37",
      color: "#080808",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: saving ? "not-allowed" : "pointer"
    },
    success: {
      color: "#6ee7a5",
      background: "#123b2a",
      border: "1px solid #246b46",
      padding: "12px",
      borderRadius: "7px",
      fontSize: "14px",
      marginBottom: "18px"
    },
    error: {
      color: "#fca5a5",
      background: "#351b1b",
      border: "1px solid #713333",
      padding: "12px",
      borderRadius: "7px",
      fontSize: "14px",
      marginBottom: "18px"
    },
    footer: {
      textAlign: "center",
      color: "#777",
      fontSize: "13px",
      marginTop: "30px",
      padding: "20px 0",
      borderTop: "1px solid #292929"
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        Loading your profile...
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <Link
          to="/customer-dashboard"
          style={styles.backLink}
        >
          ← Back to Dashboard
        </Link>

        <div style={styles.card}>

          <div style={styles.header}>
            <div style={styles.avatar}>
              {name ? name.charAt(0).toUpperCase() : "U"}
            </div>

            <h2 style={styles.company}>
              SN WEB TECHNOLOGIES
            </h2>

            <h1 style={styles.heading}>
              My Profile
            </h1>

            <p style={styles.subtitle}>
              Manage your personal account information
            </p>
          </div>

          <form onSubmit={handleSave}>

            <label style={styles.label}>
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setMessage("");
              }}
              required
              style={styles.input}
            />

            <label style={styles.label}>
              Mobile Number
            </label>

            <input
              type="tel"
              placeholder="Enter your mobile number"
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value);
                setMessage("");
              }}
              required
              style={styles.input}
            />

            <label style={styles.label}>
              Email Address
            </label>

            <input
              type="email"
              value={email}
              disabled
              style={{
                ...styles.input,
                ...styles.disabledInput
              }}
            />

            <label style={styles.label}>
              Your Address
            </label>

            <textarea
              placeholder="Enter your address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setMessage("");
              }}
              rows={4}
              style={styles.textarea}
            />

            {message && (
              <p style={styles.success}>
                {message}
              </p>
            )}

            {error && (
              <p style={styles.error}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              style={styles.button}
            >
              {saving ? "Saving Profile..." : "Save Profile"}
            </button>

          </form>
        </div>

        <footer style={styles.footer}>
          © {new Date().getFullYear()} SN WEB TECHNOLOGIES. All Rights Reserved.
        </footer>

      </div>
    </div>
  );
}

export default CustomerProfile;
