import React, { useState, useEffect } from "react";
import "./App.css";

const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];
const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

function App() {
  const [cart, setCart] = useState([]);

  const subtotal = cart
    .filter((item) => item.id !== FREE_GIFT.id)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const progress = Math.min(100, (subtotal / THRESHOLD) * 100);

  useEffect(() => {
    const hasGift = cart.find((item) => item.id === FREE_GIFT.id);
    if (subtotal >= THRESHOLD && !hasGift) {
      setCart((prev) => [...prev, { ...FREE_GIFT, quantity: 1 }]);
    } else if (subtotal < THRESHOLD && hasGift) {
      setCart((prev) => prev.filter((item) => item.id !== FREE_GIFT.id));
    }
  }, [subtotal]);

  const getQuantity = (id) => {
    const item = cart.find((item) => item.id === id);
    return item ? item.quantity : 0;
  };

  const addToCart = (product) => {
    setCart((prev) => [...prev, { ...product, quantity: 1 }]);
  };

  const updateQuantity = (product, delta) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (!existing) return prev;

      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        return prev.filter((item) => item.id !== product.id);
      }
      return prev.map((item) =>
        item.id === product.id ? { ...item, quantity: newQty } : item
      );
    });
  };

  return (
    <div className="container">
      <h2>Shopping Cart</h2>

      <section className="products-section">
        <h2>Products</h2>
        <div className="products">
          {PRODUCTS.map((product) => {
            const quantity = getQuantity(product.id);
            return (
              <div className="product-card" key={product.id}>
                <p>
                  <strong>{product.name}</strong>
                </p>
                <p>${product.price}</p>
                {quantity === 0 ? (
                  <button onClick={() => addToCart(product)}>Add to Cart</button>
                ) : (
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(product, -1)}>−</button>
                    <span>{quantity}</span>
                    <button onClick={() => updateQuantity(product, 1)}>+</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="cart-summary">
        <h2>Cart Summary</h2>
        <div className="summary-card">
          <div className="subtotal-row">
            <span>Subtotal:</span>
            <span>
              <strong>${subtotal}</strong>
            </span>
          </div>
          <hr />
          <div className="gift-promo">
            <p>
              Add ${Math.max(0, THRESHOLD - subtotal)} more to get a FREE Wireless
              Mouse!
            </p>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <small>Add some products to see them here!</small>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <span>{item.name}</span>
                <span>Qty: {item.quantity}</span>
                <span>${item.price * item.quantity}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
