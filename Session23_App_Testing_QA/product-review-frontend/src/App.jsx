import { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import { api } from './api';

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = productId => {
    setSelectedProductId(productId);
  };

  const handleBackToList = () => {
    setSelectedProductId(null);
    loadProducts(); // Reload to get updated stats
  };

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="loading">
          <div className="spinner" />
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <Header />
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button
            onClick={loadProducts}
            className="submit-button"
            style={{ maxWidth: '200px', margin: '20px auto 0' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      {selectedProductId ? (
        <ProductDetail
          productId={selectedProductId}
          onBack={handleBackToList}
        />
      ) : (
        <ProductList products={products} onProductClick={handleProductClick} />
      )}
    </div>
  );
}

function Header() {
  return (
    <header className="header">
      <h1>🛍️ Product Review System</h1>
      <p>Session 23: Comprehensive Testing & Quality Assurance</p>
    </header>
  );
}

export default App;
