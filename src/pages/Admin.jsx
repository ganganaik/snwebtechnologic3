
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../firebase";

function Admin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("In Progress");
  const [bulkLoading, setBulkLoading] = useState(false);

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
      setSelectedOrderIds([]);
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
      setOrders((previous) =>
        previous.map((order) =>
          order.id === id ? { ...order, status } : order
        )
      );
      setSelectedOrder((previous) =>
        previous?.id === id ? { ...previous, status } : previous
      );
      alert("Order status updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Unable to update order status.");
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await deleteDoc(doc(db, "orders", id));
      setOrders((previous) => previous.filter((order) => order.id !== id));
      setSelectedOrderIds((previous) =>
        previous.filter((orderId) => orderId !== id)
      );
      setSelectedOrder((previous) =>
        previous?.id === id ? null : previous
      );
      alert("Order deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Unable to delete order.");
    }
  };

  const toggleOrderSelection = (id) => {
    setSelectedOrderIds((previous) =>
      previous.includes(id)
        ? previous.filter((orderId) => orderId !== id)
        : [...previous, id]
    );
  };

  const toggleSelectAll = () => {
    const ids = paginatedOrders.map((order) => order.id);
    const allSelected = ids.every((id) => selectedOrderIds.includes(id));

    setSelectedOrderIds((previous) =>
      allSelected
        ? previous.filter((id) => !ids.includes(id))
        : [...new Set([...previous, ...ids])]
    );
  };

  const bulkUpdateStatus = async () => {
    if (selectedOrderIds.length === 0) {
      alert("Please select at least one order.");
      return;
    }

    if (
      !window.confirm(
        `Update ${selectedOrderIds.length} selected orders to "${bulkStatus}"?`
      )
    ) return;

    try {
      setBulkLoading(true);
      const batch = writeBatch(db);

      selectedOrderIds.forEach((id) => {
        batch.update(doc(db, "orders", id), { status: bulkStatus });
      });

      await batch.commit();

      setOrders((previous) =>
        previous.map((order) =>
          selectedOrderIds.includes(order.id)
            ? { ...order, status: bulkStatus }
            : order
        )
      );

      setSelectedOrder((previous) =>
        previous && selectedOrderIds.includes(previous.id)
          ? { ...previous, status: bulkStatus }
          : previous
      );

      setSelectedOrderIds([]);
      alert("All selected orders updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Unable to update selected orders. Please try again.");
    } finally {
      setBulkLoading(false);
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
    const term = search.toLowerCase();
    const matchesSearch =
      (order.name || "").toLowerCase().includes(term) ||
      (order.email || "").toLowerCase().includes(term) ||
      (order.mobile || "").includes(term) ||
      (order.service || "").toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "All" ||
      (order.status || "Pending") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getOrderTime = (order) => {
    const createdAt = order.createdAt;
    if (!createdAt) return null;
    if (typeof createdAt.toMillis === "function") return createdAt.toMillis();
    if (typeof createdAt.seconds === "number") return createdAt.seconds * 1000;
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

    if (timeA === null && timeB === null) return 0;
    if (timeA === null) return 1;
    if (timeB === null) return -1;

    return sortOrder === "oldest" ? timeA - timeB : timeB - timeA;
  });

  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;

  const paginatedOrders = sortedOrders.slice(
    startIndex,
    startIndex + pageSize
  );

  const showingFrom = sortedOrders.length === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(startIndex + pageSize, sortedOrders.length);

  const currentPageIds = paginatedOrders.map((order) => order.id);
  const allCurrentPageSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedOrderIds.includes(id));

  const formatOrderDate = (order) => {
    const timestamp = getOrderTime(order);
    return timestamp === null
      ? "Date not available"
      : new Date(timestamp).toLocaleString();
  };

  const exportOrders = () => {
    if (filteredOrders.length === 0) {
      alert("There are no orders to export.");
      return;
    }

    const headers = [
      "Customer Name",
      "Mobile Number",
      "Email",
      "Service",
      "Project Details",
      "Order Date",
      "Order Status",
      "Order ID",
    ];

    const escapeCSV = (value) => {
      const text = String(value ?? "");
      return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = filteredOrders.map((order) => [
      order.name,
      order.mobile,
      order.email,
      order.service,
      order.details,
      formatOrderDate(order),
      order.status || "Pending",
      order.id,
    ]);

    const csvContent =
      "\uFEFF" +
      [headers, ...rows]
        .map((row) => row.map(escapeCSV).join(","))
        .join("\r\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SN-Web-Technologies-Orders-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const detailRow = (label, value) => (
    <div style={styles.detailRow}>
      <strong style={styles.detailLabel}>{label}</strong>
      <span style={styles.detailValue}>{value || "Not provided"}</span>
    </div>
  );

  const statusStyle = (status) => {
    if (status === "Completed") return styles.completedStatus;
    if (status === "In Progress") return styles.progressStatus;
    return styles.pendingStatus;
  };

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
          <h3 style={styles.sectionTitle}>Order Overview</h3>
          <div style={styles.cards}>
            <div style={styles.card}>
              <p style={styles.cardLabel}>Total Orders</p>
              <h2 style={styles.cardNumber}>{orders.length}</h2>
            </div>
            <div style={styles.card}>
              <p style={styles.cardLabel}>Pending Orders</p>
              <h2 style={{ ...styles.cardNumber, color: "#e5b94b" }}>
                {pendingCount}
              </h2>
            </div>
            <div style={styles.card}>
              <p style={styles.cardLabel}>In Progress</p>
              <h2 style={{ ...styles.cardNumber, color: "#60a5fa" }}>
                {progressCount}
              </h2>
            </div>
            <div style={styles.card}>
              <p style={styles.cardLabel}>Completed Orders</p>
              <h2 style={{ ...styles.cardNumber, color: "#4ade80" }}>
                {completedCount}
              </h2>
            </div>
          </div>
        </section>

        <section style={styles.ordersSection}>
          <h3 style={styles.sectionTitle}>Customer Orders</h3>

          <div style={styles.controls}>
            <input
              type="text"
              placeholder="Search name, mobile, email or service"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
                setSelectedOrderIds([]);
              }}
              style={styles.input}
            />

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
                setSelectedOrderIds([]);
              }}
              style={styles.select}
            >
              <option value="All">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
                setSelectedOrderIds([]);
              }}
              style={styles.select}
            >
              <option value="newest">Latest Orders First</option>
              <option value="oldest">Oldest Orders First</option>
              <option value="nameAsc">Customer Name (A–Z)</option>
              <option value="nameDesc">Customer Name (Z–A)</option>
            </select>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
                setSelectedOrderIds([]);
              }}
              style={styles.select}
              aria-label="Orders per page"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>

            <button onClick={loadOrders} style={styles.refresh}>
              Refresh Orders
            </button>
            <button onClick={exportOrders} style={styles.exportButton}>
              ↓ Export Orders (CSV)
            </button>
          </div>

          <div style={styles.bulkSection}>
            <div style={styles.bulkInfo}>
              <strong>{selectedOrderIds.length}</strong> orders selected
            </div>
            <div style={styles.bulkControls}>
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                style={styles.select}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <button
                onClick={bulkUpdateStatus}
                disabled={selectedOrderIds.length === 0 || bulkLoading}
                style={{
                  ...styles.bulkButton,
                  ...(selectedOrderIds.length === 0 || bulkLoading
                    ? styles.disabledButton
                    : {}),
                }}
              >
                {bulkLoading ? "Updating..." : "Update Selected Orders"}
              </button>
              <button
                onClick={() => setSelectedOrderIds([])}
                disabled={selectedOrderIds.length === 0 || bulkLoading}
                style={{
                  ...styles.clearButton,
                  ...(selectedOrderIds.length === 0 || bulkLoading
                    ? styles.disabledButton
                    : {}),
                }}
              >
                Clear Selection
              </button>
            </div>
          </div>

          {loading ? (
            <p style={styles.message}>Loading orders...</p>
          ) : error ? (
            <div>
              <p style={styles.error}>{error}</p>
              <button onClick={loadOrders} style={styles.refresh}>
                Try Again
              </button>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>
                      <input
                        type="checkbox"
                        checked={allCurrentPageSelected}
                        onChange={toggleSelectAll}
                        aria-label="Select all orders on this page"
                      />
                    </th>
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
                      <td colSpan="9" style={styles.empty}>
                        No matching orders found.
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((order) => (
                      <tr key={order.id}>
                        <td style={styles.td}>
                          <input
                            type="checkbox"
                            checked={selectedOrderIds.includes(order.id)}
                            onChange={() => toggleOrderSelection(order.id)}
                            aria-label={`Select order from ${order.name || "customer"}`}
                          />
                        </td>
                        <td style={styles.td}>{order.name || "Not provided"}</td>
                        <td style={styles.td}>{order.mobile || "Not provided"}</td>
                        <td style={styles.td}>{order.email || "Not provided"}</td>
                        <td style={styles.td}>{order.service || "Not provided"}</td>
                        <td style={styles.td}>
                          {order.details || "No details provided"}
                        </td>
                        <td style={styles.td}>{formatOrderDate(order)}</td>
                        <td style={styles.td}>
                          <select
                            value={order.status || "Pending"}
                            onChange={(e) =>
                              updateOrderStatus(order.id, e.target.value)
                            }
                            style={{
                              ...styles.statusSelect,
                              ...statusStyle(order.status || "Pending"),
                            }}
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

          {!loading && !error && (
            <div style={styles.pagination}>
              <span style={styles.paginationInfo}>
                Showing {showingFrom}–{showingTo} of {sortedOrders.length} orders
              </span>
              <div style={styles.paginationActions}>
                <button
                  onClick={() => setCurrentPage(safeCurrentPage - 1)}
                  disabled={safeCurrentPage === 1}
                  style={{
                    ...styles.pageButton,
                    ...(safeCurrentPage === 1 ? styles.disabledPageButton : {}),
                  }}
                >
                  Previous
                </button>
                <span style={styles.pageNumber}>
                  Page {safeCurrentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(safeCurrentPage + 1)}
                  disabled={safeCurrentPage === totalPages}
                  style={{
                    ...styles.pageButton,
                    ...(safeCurrentPage === totalPages
                      ? styles.disabledPageButton
                      : {}),
                  }}
                >
                  Next
                </button>
              </div>
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
    background: "#080808",
    color: "#f8f5ed",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
  },
  container: { maxWidth: "1200px", margin: "auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "25px",
    padding: "18px 0",
    borderBottom: "1px solid #55451f",
  },
  company: {
    color: "#d4af37",
    fontSize: "22px",
    margin: "0 0 8px",
    letterSpacing: "1px",
  },
  heading: { color: "#ffffff", margin: 0, fontSize: "25px" },
  logout: {
    background: "#321b18",
    color: "#ffb4a9",
    border: "1px solid #a34b3e",
    borderRadius: "7px",
    padding: "11px 20px",
    cursor: "pointer",
  },
  summary: {
    background: "#141414",
    border: "1px solid #55451f",
    padding: "22px",
    borderRadius: "13px",
    marginBottom: "20px",
  },
  sectionTitle: {
    color: "#e5c45f",
    fontSize: "22px",
    margin: "0 0 18px",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))",
    gap: "14px",
  },
  card: {
    background: "linear-gradient(145deg, #202020, #111111)",
    border: "1px solid #514323",
    borderRadius: "10px",
    padding: "18px",
  },
  cardLabel: {
    color: "#c7c0ae",
    fontSize: "14px",
    margin: "0 0 12px",
  },
  cardNumber: {
    color: "#f5d778",
    fontSize: "30px",
    margin: 0,
  },
  ordersSection: {
    background: "#141414",
    border: "1px solid #55451f",
    padding: "22px",
    borderRadius: "13px",
  },
  controls: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  input: {
    flex: "1 1 260px",
    minWidth: "0",
    padding: "13px",
    background: "#090909",
    color: "#ffffff",
    border: "1px solid #69562b",
    borderRadius: "7px",
    boxSizing: "border-box",
    fontSize: "14px",
  },
  select: {
    maxWidth: "100%",
    minWidth: "0",
    padding: "12px",
    background: "#202020",
    color: "#f8f5ed",
    borderRadius: "7px",
    border: "1px solid #69562b",
    fontSize: "14px",
  },
  refresh: {
    background: "#d4af37",
    color: "#080808",
    border: "none",
    borderRadius: "7px",
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  exportButton: {
    background: "#176b42",
    color: "#ffffff",
    border: "1px solid #26945e",
    borderRadius: "7px",
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  bulkSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    background: "#1b1912",
    border: "1px solid #705b2c",
    borderRadius: "9px",
    padding: "15px",
    marginBottom: "18px",
  },
  bulkInfo: { color: "#f3d77e", fontSize: "15px" },
  bulkControls: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  bulkButton: {
    background: "#d4af37",
    color: "#080808",
    border: "none",
    borderRadius: "7px",
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  clearButton: {
    background: "#38332a",
    color: "#f1dfb0",
    border: "1px solid #756039",
    borderRadius: "7px",
    padding: "12px 16px",
    cursor: "pointer",
  },
  disabledButton: { opacity: 0.45, cursor: "not-allowed" },
  tableWrapper: {
    overflowX: "auto",
    borderRadius: "9px",
    border: "1px solid #514323",
    width: "100%",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1100px",
    background: "#101010",
  },
  th: {
    background: "#292314",
    color: "#f3d77e",
    padding: "15px 13px",
    textAlign: "left",
    borderBottom: "2px solid #b08d32",
    whiteSpace: "nowrap",
    fontSize: "14px",
  },
  td: {
    padding: "14px 13px",
    borderBottom: "1px solid #383126",
    color: "#f8f5ed",
    fontSize: "14px",
    verticalAlign: "top",
    lineHeight: 1.6,
    overflowWrap: "anywhere",
  },
  empty: {
    padding: "25px",
    textAlign: "center",
    color: "#d4af37",
  },
  statusSelect: {
    padding: "9px",
    borderRadius: "6px",
    border: "1px solid #76602d",
    background: "#202020",
    color: "#f8f5ed",
    maxWidth: "140px",
  },
  pendingStatus: { color: "#f3c969" },
  progressStatus: { color: "#83baff" },
  completedStatus: { color: "#70d69b" },
  actions: { display: "flex", gap: "7px", flexWrap: "wrap" },
  viewButton: {
    background: "#d4af37",
    color: "#080808",
    border: "none",
    borderRadius: "6px",
    padding: "9px 12px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontWeight: "bold",
  },
  deleteButton: {
    background: "#702c25",
    color: "#ffffff",
    border: "1px solid #a34b3e",
    borderRadius: "6px",
    padding: "9px 12px",
    cursor: "pointer",
  },
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "20px",
  },
  paginationInfo: { color: "#c8c0ad", fontSize: "14px" },
  paginationActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  pageButton: {
    background: "#d4af37",
    color: "#080808",
    border: "none",
    borderRadius: "6px",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  disabledPageButton: {
    background: "#383838",
    color: "#999999",
    cursor: "not-allowed",
  },
  pageNumber: {
    color: "#f3d77e",
    fontSize: "14px",
    fontWeight: "bold",
  },
  message: { color: "#f3d77e", padding: "15px 0" },
  error: { color: "#ff9388", padding: "12px 0" },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.82)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "15px",
    zIndex: 1000,
  },
  modal: {
    background: "#151515",
    border: "1px solid #b08d32",
    color: "#f8f5ed",
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
    borderBottom: "1px solid #55451f",
    paddingBottom: "14px",
  },
  modalTitle: { color: "#e5c45f", margin: 0 },
  closeButton: {
    background: "#38201d",
    color: "#ffb4a9",
    border: "1px solid #a34b3e",
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
    padding: "13px 0",
    borderBottom: "1px solid #383126",
  },
  detailLabel: { color: "#d4af37", fontSize: "13px" },
  detailValue: {
    color: "#ffffff",
    fontSize: "15px",
    overflowWrap: "anywhere",
    whiteSpace: "pre-wrap",
    lineHeight: 1.6,
  },
  closeBottom: {
    width: "100%",
    marginTop: "20px",
    padding: "13px",
    background: "#d4af37",
    color: "#080808",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Admin;
