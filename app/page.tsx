"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [reservationId, setReservationId] = useState("");

  async function fetchProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();

    setProducts(data);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function reserveProduct(productId: string) {
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          warehouseId: "cmpjed9u4000bpbtdj7ro3i8b",
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Reservation Successful");
        setReservationId(data.id);
      } else {
        setMessage("❌ " + data.error);
      }

      fetchProducts();
    } catch (error) {
      setMessage("❌ Something went wrong");
    }
  }

  async function confirmReservation() {
    if (!reservationId) return;

    const res = await fetch(
      `/api/reservations/${reservationId}/confirm`,
      {
        method: "POST",
      }
    );

    if (res.ok) {
      setMessage("✅ Reservation Confirmed");
    } else {
      setMessage("❌ Confirmation failed");
    }
  }

  async function cancelReservation() {
    if (!reservationId) return;

    const res = await fetch(
      `/api/reservations/${reservationId}/release`,
      {
        method: "POST",
      }
    );

    if (res.ok) {
      setMessage("❌ Reservation Cancelled");
      fetchProducts();
    } else {
      setMessage("❌ Cancel failed");
    }
  }

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1>Inventory Reservation System</h1>

      <br />

      {products.map((product: any) => (
        <div
          key={product.id}
          style={{
            border: "1px solid gray",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>{product.name}</h2>

          <p>{product.description}</p>

          <p>
            Available Stock:
            {" "}
            {product.inventory
              ? product.inventory.totalQuantity -
                product.inventory.reservedQuantity
              : 0}
          </p>

          <button
            onClick={() => reserveProduct(product.id)}
            style={{
              padding: "10px 20px",
              backgroundColor: "black",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Reserve
          </button>

          <button
            onClick={confirmReservation}
            style={{
              padding: "10px 20px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Confirm
          </button>

          <button
            onClick={cancelReservation}
            style={{
              padding: "10px 20px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      ))}

      <h3>{message}</h3>
    </div>
  );
}