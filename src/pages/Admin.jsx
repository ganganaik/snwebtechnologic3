
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const querySnapshot = await getDocs(
        collection(db, "orders")
      );

      const data = querySnapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateOrderStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "orders", id), {
        status: status,
      });

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === id ? { ...order, status } : order
        )
      );

      alert("Order status updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Unable to update order status.");
    }
  };

  const deleteOrder = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "orders", id));

      setOrders((previousOrders) =>
        previousOrders.filter((order) => order.id !== id)
      );

      alert("Order deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Unable to delete order.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/admin-login";
    } catch (err) {
      console.error(err);
      alert("Logout failed. Please try again.");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (order.name || "").toLowerCase().includes(searchText) ||
      (order.email || "").toLowerCase().includes(searchText) ||
      (order.mobile || "").includes(searchText) ||
      (order.service || "").toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      (order.status || "Pending") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{
      padding: "20px",
      fontFamily: "Arial",
      maxWidth: "1200px",
      margin: "auto"
    }}>
      <h1>SN WEB TECHNOLOGIES</h1>

      <h2>Admin Dashboard</h2>

      <button onClick={handleLogout}>
        Logout
      </button>

      <hr />

      <h3>Customer Orders</h3>

      <h4>Total Orders: {orders.length}</h4>

      <div style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        marginBottom: "20px"
      }}>
        <input
          type="text"
          placeholder="Search name, mobile, email or service"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "12px",
            flex: "1",
            minWidth: "220px"
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "12px" }}
        >
          <option value="All">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button onClick={loadOrders}>
          Refresh Orders
        </button>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <div>
          <p style={{ color: "red" }}>{error}</p>
          <button onClick={loadOrders}>Try Again</button>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            border="1"
            cellPadding="10"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "850px"
            }}
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Service</th>
                <th>Project Details</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No matching orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.name}</td>
                    <td>{order.mobile}</td>
                    <td>{order.email}</td>
                    <td>{order.service}</td>
                    <td>{order.details || "No details provided"}</td>

                    <td>
                      <select
                        value={order.status || "Pending"}
                        onChange={(e) =>
                          updateOrderStatus(
                            order.id,
                            e.target.value
                          )
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>

                    <td>
                      <button
                        onClick={() => deleteOrder(order.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Admin;
