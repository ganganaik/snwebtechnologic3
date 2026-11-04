 
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { auth } from "./firebase";

const ADMIN_UID = "PASTE_ADMIN_UID_HERE";

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Checking authentication...</p>;
  }

  if (!user || user.uid !== ADMIN_UID) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

export default ProtectedRoute;
