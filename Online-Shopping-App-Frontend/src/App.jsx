import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { createCart } from "./api";

import Navbar from "./Navbar";
import Home from "./Home";
import Cart from "./Cart";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [cartId, setCartId] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = () => {
    setCartCount((prev) => prev);
  };

  useEffect(() => {
    const initializeCart = async () => {
      if (cartId) return;

      try {
        const response = await createCart();
        const newCartId = response.data.id || response.data.cartId;
        setCartId(newCartId);
      } catch (err) {
        console.error("Unable to create cart", err);
      }
    };

    initializeCart();
  }, [cartId]);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <Navbar cartCount={cartCount} />

        <main className="mx-auto max-w-7xl px-6 py-8">
          <Routes>
            {/* Home */}
            <Route
              path="/"
              element={
                <Home
                  cartId={cartId}
                  setCartId={setCartId}
                  cartCount={cartCount}
                  setCartCount={setCartCount}
                  onCartChanged={refreshCartCount}
                />
              }
            />

            {/* Protected Cart */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart
                    cartId={cartId}
                    onCartChanged={refreshCartCount}
                  />
                </ProtectedRoute>
              }
            />

            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
