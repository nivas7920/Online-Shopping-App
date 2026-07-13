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
    const token = localStorage.getItem("token");

    if (!token) return;

    const initializeCart = async () => {
      if (cartId) return;

      const response = await createCart();
      setCartId(response.data.id || response.data.cartId);
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
                <ProtectedRoute>
                  <Home
                    cartId={cartId}
                    setCartId={setCartId}
                    cartCount={cartCount}
                    setCartCount={setCartCount}
                    onCartChanged={refreshCartCount}
                  />
                </ProtectedRoute>
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
