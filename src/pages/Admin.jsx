import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function Admin() {const [orders, setOrders] = useState([]);

useEffect(() => {
  loadOrders();
}, []);

const loadOrders = async () => {
  const querySnapshot = await getDocs(collection(db, "orders"));

  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  setOrders(data);
};

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>SN WEB TECHNOLOGIES</h1>

      <h2>Admin Dashboard</h2>

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
          </tr>
        </thead>

        <tbody>
  {orders.length === 0 ? (
    <tr>
      <td colSpan="5" style={{ textAlign: "center" }}>
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
        <td>Pending</td>
      </tr>
    ))
  )}
</tbody>

      </table>
    </div>
  );
}

export default Admin;
