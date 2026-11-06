
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
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const querySnapshot = await getDocs(collection(db, "orders"));

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
      await updateDoc(doc(db, "orders", id), { status });

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === id ? { ...order, status } : order
        )
      );

      setSelectedOrder((previousOrder) =>
        previousOrder?.id === id
          ? { ...previousOrder, status }
          : previousOrder
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

      setSelectedOrder((previousOrder) =>
        previousOrder?.id === id ? null : previousOrder
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

  const pendingCount = orders.filter(
    (order) => (order.status || "Pending") === "Pending"
  ).length;

  const progressCount = orders.filter(
    (order) => order.status === "In Progress"
  ).length;

  const completedCount = orders.filter(
    (order) => order.status === "Completed"
  ).length;

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

  const getOrderTime = (order) => {
    const createdAt = order.createdAt;

    if (!createdAt) return null;

    if (typeof createdAt.toMillis === "function") {
      return createdAt.toMillis();
    }

    if (typeof createdAt.seconds === "number") {
      return createdAt.seconds * 1000;
    }

    return null;
  };

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortOrder === "nameAsc") {
      return (a.name || "").localeCompare(b.name || "");
    }

    if (sortOrder === "nameDesc") {
      return (b.name || "").localeCompare(a.name || "");
    }

    const timeA = getOrderTime(a);
    const timeB = getOrderTime(b);

    // Orders without a saved date stay at the bottom.
    if (timeA === null && timeB === null) return 0;
    if (timeA === null) return 1;
    if (timeB === null) return -1;

    if (sortOrder === "oldest") {
      return timeA - timeB;
    }

    return timeB - timeA;
  });

  const formatOrderDate = (order) => {
    const timestamp = getOrderTime(order);

    if (timestamp === null) return "Date not available";

    return new Date(timestamp).toLocaleString();
  };

  const detailRow = (label, value) => (
    <div style={styles.detailRow}>
      <strong style={styles.detailLabel}>{label}</strong>
      <span style={styles.detailValue}>
        {value || "Not provided"}
      </span>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.company}>SN WEB TECHNOLOGIES</h1>
            <h2 style={styles.heading}>Admin Dashboard</h2>
          </div>

          <button onClick={handleLogout} style={styles.logout}>
            Logout
          </button>
        </header>

        <section style={styles.summary}>
          <h3>Order Overview</h3>

          <div style={styles.cards}>
            <div style={styles.card}>
              <p style={styles.cardLabel}>Total Orders</p>
              <h2 style={styles.cardNumber}>{orders.length}</h2>
            </div>

            <div style={styles.card}>
              <p style={styles.cardLabel}>Pending Orders</p>
              <h2 style={{ ...styles.cardNumber, color: "#d97706" }}>
                {pendingCount}
              </h2>
            </div>

            <div style={styles.card}>
              <p style={styles.cardLabel}>In Progress</p>
              <h2 style={{ ...styles.cardNumber, color: "#2563eb" }}>
                {progressCount}
              </h2>
            </div>

            <div style={styles.card}>
              <p style={styles.cardLabel}>Completed Orders</p>
              <h2 style={{ ...styles.cardNumber, color: "#16a34a" }}>
                {completedCount}
              </h2>
            </div>
          </div>
        </section>

        <section style={styles.ordersSection}>
          <h3>Customer Orders</h3>

          <div style={styles.controls}>
            <input
              type="text"
              placeholder="Search name, mobile, email or service"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.input}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={styles.select}
            >
              <option value="All">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={styles.select}
            >
              <option value="newest">Latest Orders First</option>
              <option value="oldest">Oldest Orders First</option>
              <option value="nameAsc">Customer Name (A–Z)</option>
              <option value="nameDesc">Customer Name (Z–A)</option>
            </select>

            <button onClick={loadOrders} style={styles.refresh}>
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
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Mobile</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Service</th>
                    <th style={styles.th}>Project Details</th>
                    <th style={styles.th}>Order Date</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedOrders.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={styles.empty}>
                        No matching orders found.
                      </td>
                    </tr>
                  ) : (
                    sortedOrders.map((order) => (
                      <tr key={order.id}>
                        <td style={styles.td}>{order.name}</td>
                        <td style={styles.td}>{order.mobile}</td>
                        <td style={styles.td}>{order.email}</td>
                        <td style={styles.td}>{order.service}</td>
                        <td style={styles.td}>
                          {order.details || "No details provided"}
                        </td>
                        <td style={styles.td}>
                          {formatOrderDate(order)}
                        </td>
                        <td style={styles.td}>
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
                        <td style={styles.td}>
                          <div style={styles.actions}>
                            <button
                              onClick={() => setSelectedOrder(order)}
                              style={styles.viewButton}
                            >
                              View Details
                            </button>

                            <button
                              onClick={() => deleteOrder(order.id)}
                              style={styles.deleteButton}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {selectedOrder && (
        <div
          style={styles.overlay}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Order Details</h2>

              <button
                onClick={() => setSelectedOrder(null)}
                style={styles.closeButton}
              >
                ×
              </button>
            </div>

            {detailRow("Customer Name", selectedOrder.name)}
            {detailRow("Mobile Number", selectedOrder.mobile)}
            {detailRow("Email Address", selectedOrder.email)}
            {detailRow("Service", selectedOrder.service)}
            {detailRow("Project Details", selectedOrder.details)}
            {detailRow("Order Date", formatOrderDate(selectedOrder))}
            {detailRow("Order Status", selectedOrder.status || "Pending")}
            {detailRow("Order ID", selectedOrder.id)}

            <button
              onClick={() => setSelectedOrder(null)}
              style={styles.closeBottom}
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  container: { maxWidth: "1200px", margin: "auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "25px",
  },
  company: { color: "#1d4ed8", fontSize: "24px" },
  heading: { color: "#111827" },
  logout: {
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "7px",
    padding: "11px 20px",
    cursor: "pointer",
  },
  summary: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
    marginTop: "15px",
  },
  card: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "15px",
  },
  cardLabel: {
    color: "#64748b",
    fontSize: "14px",
    margin: "0 0 10px",
  },
  cardNumber: {
    color: "#111827",
    fontSize: "28px",
    margin: 0,
  },
  ordersSection: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
  },
  controls: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  input: {
    flex: "1",
    minWidth: "220px",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    boxSizing: "border-box",
  },
  select: {
    padding: "12px",
    borderRadius: "7px",
    border: "1px solid #cbd5e1",
    maxWidth: "100%",
  },
  refresh: {
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "7px",
    padding: "12px 18px",
    cursor: "pointer",
  },
  tableWrapper: { overflowX: "auto", borderRadius: "10px" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1200px",
  },
  th: {
    background: "#1e40af",
    color: "white",
    padding: "13px",
    textAlign: "left",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #e2e8f0",
  },
  empty: { padding: "25px", textAlign: "center" },
  actions: { display: "flex", gap: "7px" },
  viewButton: {
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "9px 12px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  deleteButton: {
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "9px 12px",
    cursor: "pointer",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.65)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "15px",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    width: "100%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflowY: "auto",
    padding: "25px",
    borderRadius: "14px",
    boxSizing: "border-box",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  modalTitle: { color: "#1e40af", margin: 0 },
  closeButton: {
    background: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: "50%",
    width: "35px",
    height: "35px",
    fontSize: "24px",
    cursor: "pointer",
  },
  detailRow: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    padding: "12px 0",
    borderBottom: "1px solid #e2e8f0",
  },
  detailLabel: { color: "#64748b", fontSize: "13px" },
  detailValue: {
    color: "#111827",
    fontSize: "15px",
    overflowWrap: "anywhere",
    whiteSpace: "pre-wrap",
  },
  closeBottom: {
    width: "100%",
    marginTop: "20px",
    padding: "12px",
    background: "#1e40af",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
  },
};

export default Admin;
