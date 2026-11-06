import { useEffect, useState } from "react";
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
        setError("Unable to load profile.");
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
      setError("Unable to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <a href="/customer-dashboard" style={styles.backLink}>
          ← Back to Dashboard
        </a>

        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.avatar}>
              {name ? name.charAt(0).toUpperCase() : "U"}
            </div>

            <h2 style={styles.company}>
              SN WEB TECHNOLOGIES
            </h2>

            <h3 style={styles.heading}>My Profile</h3>

            <p style={styles.subtitle}>
              Manage your personal account information
            </p>
          </div>

          <form onSubmit={handleSave}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />

            <label style={styles.label}>Mobile Number</label>
            <input
              type="tel"
              placeholder="Enter your mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              style={styles.input}
            />

            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              style={{ ...styles.input, ...styles.disabledInput }}
            />

            <label style={styles.label}>Your Address</label>
            <textarea
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows="4"
              style={styles.textarea}
            />

            {message && (
              <p style={styles.success}>{message}</p>
            )}

            {error && (
              <p style={styles.error}>{error}</p>
            )}

            <button
              type="submit"
              disabled={saving}
              style={styles.button}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    padding: "35px 15px",
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
    fontFamily: "Arial"
  },
  backLink: {
    display: "inline-block",
    marginBottom: "20px",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "bold"
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 8px 30px rgba(15, 23, 42, 0.08)",
    boxSizing: "border-box"
  },
  header: {
    textAlign: "center",
    marginBottom: "30px"
  },
  avatar: {
    width: "75px",
    height: "75px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "white",
    fontSize: "30px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px"
  },
  company: {
    color: "#1e40af",
    fontSize: "20px",
    margin: "10px 0"
  },
  heading: {
    color: "#111827",
    fontSize: "24px",
    margin: "10px 0"
  },
  subtitle: {
    color: "#64748b",
    fontSize: "14px"
  },
  label: {
    display: "block",
    color: "#334155",
    fontWeight: "bold",
    fontSize: "14px",
    marginBottom: "8px"
  },
  input: {
    width: "100%",
    padding: "13px",
    marginBottom: "20px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "15px",
    boxSizing: "border-box",
    outlineColor: "#2563eb"
  },
  disabledInput: {
    background: "#f1f5f9",
    color: "#64748b"
  },
  textarea: {
    width: "100%",
    padding: "13px",
    marginBottom: "20px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "15px",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "Arial",
    outlineColor: "#2563eb"
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  success: {
    color: "#15803d",
    background: "#dcfce7",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "14px"
  },
  error: {
    color: "#dc2626",
    background: "#fee2e2",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "14px"
  }
};

export default CustomerProfile;
