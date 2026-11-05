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
    return <p>Loading profile...</p>;
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f3f4f6",
      fontFamily: "Arial"
    }}>
      <form
        onSubmit={handleSave}
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "400px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          SN WEB TECHNOLOGIES
        </h2>

        <h3 style={{ textAlign: "center" }}>
          My Profile
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
          disabled
          style={inputStyle}
        />

        <textarea
          placeholder="Your Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={inputStyle}
        />

        {message && (
          <p style={{ color: "green" }}>{message}</p>
        )}

        {error && (
          <p style={{ color: "red" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          style={buttonStyle}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: "6px"
};

export default CustomerProfile;
