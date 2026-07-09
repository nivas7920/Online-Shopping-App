import { useEffect, useState } from 'react';
import { addCartItem, createCart, getCartSummary } from './api';
import AddProduct from './AddProduct';
import ProductList from './ProductList';
import PurchaseSummary from './PurchaseSummary';

const Home = ({ cartId, setCartId, cartCount, setCartCount, onCartChanged }) => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const initializeCart = async () => {
      try {
        const response = await createCart();
        const newCartId = response.data.id || response.data.cartId;

        setCartId(newCartId);
        onCartChanged();
      } catch (err) {
        console.error('Unable to create cart', err);
      }
    };

    if (!cartId) {
      initializeCart();
    }
  }, [cartId, onCartChanged, setCartId]);

  useEffect(() => {
    const loadSummary = async () => {
      if (!cartId) return;

      try {
        const response = await getCartSummary(cartId);
        setSummary(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadSummary();
  }, [cartId, cartCount]);

  const handleAddToCart = async (product) => {
    if (!cartId) return;

    try {
      // ✅ Correct API call
      await addCartItem(cartId, product.id, 1);

      setCartCount((count) => count + 1);
      onCartChanged();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 p-8 text-white shadow-lg">
            <h1 className="text-3xl font-semibold">
              Welcome to your online store
            </h1>
            <p className="mt-2 text-cyan-50">
              Browse products, manage your cart, and review your purchase summary.
            </p>
          </div>

          <ProductList onAddToCart={handleAddToCart} />
        </div>

        <div className="space-y-6">
          <AddProduct onProductAdded={() => window.location.reload()} />
          <PurchaseSummary summary={summary} />
        </div>
      </div>
    </div>
  );
};

export default Home;