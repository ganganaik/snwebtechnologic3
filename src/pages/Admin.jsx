
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

function Admin() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const querySnapshot = await getDocs(collection(db, "orders"));

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setOrders(data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateOrderStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), {
      status: status,
    });

    loadOrders();
  };

  const deleteOrder = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    await deleteDoc(doc(db, "orders", id));

    loadOrders();

    alert("Order deleted successfully");
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>SN WEB TECHNOLOGIES</h1>

      <h2>Admin Dashboard</h2>

      <button onClick={handleLogout}>
        Logout
      </button>

      <hr />

      <h3>Customer Orders</h3>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Service</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No Orders Yet
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.name}</td>
                <td>{order.mobile}</td>
                <td>{order.email}</td>
                <td>{order.service}</td>

                <td>
                  <select
                    value={order.status || "Pending"}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>

                <td>
                  <button onClick={() => deleteOrder(order.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
