import React, { useEffect, useState } from "react";
import AllData from "./AllData";
import { fetchOrders, addTrackingEvent } from "../api/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState(null);
  const [showTrackingFor, setShowTrackingFor] = useState(null);
  const [trackingStatus, setTrackingStatus] = useState("");
  const [trackingMessage, setTrackingMessage] = useState("");
  const [trackingPartner, setTrackingPartner] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    fetchOrders().then(setOrders);
  };

  const handleAddTracking = async (orderId) => {
    if (!trackingStatus) {
      alert("Please select a status.");
      return;
    }

    try {
      await addTrackingEvent(orderId, {
        status: trackingStatus,
        message: trackingMessage,
        courierPartner: trackingPartner,
        trackingNumber: trackingNumber,
      });

      setShowTrackingFor(null);
      setTrackingStatus("");
      setTrackingMessage("");
      setTrackingPartner("");
      setTrackingNumber("");
      loadOrders();
    } catch (err) {
      console.error(err);
      alert("Could not add tracking event.");
    }
  };

  return (
    <div>
      <AllData
        title="Orders"
        data={orders}
        columns={[
          { key: "_id", header: "Order ID" },
          {
            key: "userId",
            header: "User",
            render: (o) => o.userId.email,
          },
          {
            key: "createdAt",
            header: "Date",
            render: (o) => new Date(o.createdAt).toLocaleString(),
          },
          { key: "totalAmount", header: "Total (₹)" },
          { key: "status", header: "Current Status" },
          {
            key: "courierPartner",
            header: "Courier",
            render: (o) => o.courierPartner || "—",
          },
          {
            key: "trackingNumber",
            header: "Track #",
            render: (o) => o.trackingNumber || "—",
          },
          {
            key: "trackingHistory",
            header: "Tracking History",
            render: (order) =>
              order.tracking?.length ? (
                <ul style={{ fontSize: "0.85rem", paddingLeft: 16 }}>
                  {order.tracking.map((t, i) => (
                    <li key={i} style={{ marginBottom: "0.25rem" }}>
                      <strong>{t.status}</strong> — {t.message || "No message"}
                      <br />
                      <small style={{ color: "#555" }}>
                        {new Date(t.timestamp).toLocaleString()}
                      </small>
                    </li>
                  ))}
                </ul>
              ) : (
                <span style={{ color: "#aaa" }}>No tracking yet</span>
              ),
          },
          {
            key: "items",
            header: "Items",
            render: (o) => (
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {o.items.map((it, idx) => {
                  const p = it.productId;
                  if (!p) {
                    return (
                      <li key={idx} style={{ marginBottom: "0.5rem" }}>
                        <em>Product data not available</em>
                      </li>
                    );
                  }
                  const unitPrice = p.discount
                    ? (p.price * (1 - p.discount / 100)).toFixed(2)
                    : p.price.toFixed(2);

                  return (
                    <li key={idx} style={{ marginBottom: "0.5rem" }}>
                      {p.images?.[0] && (
                        <img
                          src={`https://e-backend-rf04.onrender.com${p.images[0]}`}
                          alt={p.title}
                          style={{
                            width: 40,
                            marginRight: 8,
                            verticalAlign: "middle",
                          }}
                        />
                      )}
                      <strong>{p.title}</strong>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "#555",
                          marginLeft: 8,
                        }}
                      >
                        ({p.category?.name} / {p.subcategory?.name})
                      </span>
                      <div style={{ fontSize: "0.9rem", marginTop: 2 }}>
                        Unit: ₹{unitPrice}
                        {p.discount > 0 && (
                          <span
                            style={{
                              marginLeft: 8,
                              color: "#c0392b",
                            }}
                          >
                            ({p.discount}% off)
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.9rem", marginTop: 2 }}>
                        Qty: {it.qty}
                        {it.size && `, Size: ${it.size}`}
                        {it.color && `, Color: ${it.color}`}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ),
          },
          {
            key: "shipping",
            header: "Shipping Info",
            render: (o) => (
              <div style={{ fontSize: "0.9rem", lineHeight: 1.4 }}>
                <div>
                  <strong>{o.shipping.name}</strong> (<em>{o.shipping.email}</em>)
                </div>
                <div>
                  {o.shipping.address}, {o.shipping.city}, {o.shipping.country} –{" "}
                  {o.shipping.postalCode}
                </div>
                <div>Contact: {o.shipping.contact}</div>
              </div>
            ),
          },
          {
            key: "actions",
            header: "Actions",
            render: (order) => (
              <div>
                <button
                  onClick={() => {
                    setShowTrackingFor(order._id);
                    setTrackingStatus("");
                    setTrackingMessage("");
                    setTrackingPartner(order.courierPartner || "");
                    setTrackingNumber(order.trackingNumber || "");
                  }}
                  style={{
                    backgroundColor: "#4a90e2",
                    color: "#fff",
                    border: "none",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Add Tracking
                </button>

                {showTrackingFor === order._id && (
                  <div
                    style={{
                      marginTop: "0.5rem",
                      padding: "0.75rem",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <select
                      value={trackingStatus}
                      onChange={(e) => setTrackingStatus(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.4rem",
                        marginBottom: "0.5rem",
                        fontSize: "1rem",
                      }}
                    >
                      <option value="">-- Select Status --</option>
                      <option value="Order Placed">Order Placed</option>
                      <option value="Order Confirmed">Order Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      {/* <option value="In Hub">In Hub</option>
                      <option value="Out For Delivery">Out For Delivery</option> */}
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Returned">Returned</option>
                    </select>

                    <textarea
                      value={trackingMessage}
                      onChange={(e) => setTrackingMessage(e.target.value)}
                      placeholder="Optional: A brief message"
                      style={{
                        width: "100%",
                        padding: "0.4rem",
                        marginBottom: "0.5rem",
                        fontSize: "0.9rem",
                        minHeight: "2.5rem",
                      }}
                    />

                    <input
                      type="text"
                      value={trackingPartner}
                      onChange={(e) => setTrackingPartner(e.target.value)}
                      placeholder="Courier Partner (optional)"
                      style={{
                        width: "100%",
                        padding: "0.4rem",
                        marginBottom: "0.5rem",
                        fontSize: "0.9rem",
                      }}
                    />
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Tracking Number (optional)"
                      style={{
                        width: "100%",
                        padding: "0.4rem",
                        marginBottom: "0.5rem",
                        fontSize: "0.9rem",
                      }}
                    />

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        disabled={!trackingStatus}
                        onClick={() => handleAddTracking(order._id)}
                        style={{
                          backgroundColor: trackingStatus ? "#2ecc71" : "#95a5a6",
                          color: "#fff",
                          cursor: trackingStatus ? "pointer" : "not-allowed",
                          border: "none",
                          padding: "0.4rem 0.75rem",
                          borderRadius: "4px",
                          fontSize: "0.9rem",
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setShowTrackingFor(null)}
                        style={{
                          backgroundColor: "#e74c3c",
                          color: "#fff",
                          border: "none",
                          padding: "0.4rem 0.75rem",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
