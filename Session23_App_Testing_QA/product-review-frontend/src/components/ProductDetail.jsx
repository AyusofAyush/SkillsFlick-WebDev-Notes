import { useState, useEffect } from 'react';
import { api } from '../api';
import Stars from './Stars';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

function ProductDetail({ productId, onBack }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProduct(productId);
      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    loadProduct(); // Reload to get updated reviews and stats
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={onBack} className="back-button">
          ← Back to Products
        </button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div>
      <div className="product-detail">
        <button
          onClick={onBack}
          className="back-button"
          data-testid="back-button"
        >
          ← Back to Products
        </button>

        <div className="detail-grid">
          <img
            src={
              product.imageUrl ||
              'https://via.placeholder.com/400x400?text=No+Image'
            }
            alt={product.name}
            className="detail-image"
          />
          <div className="detail-info">
            <span className="product-category">{product.category}</span>
            <h2>{product.name}</h2>
            <p className="product-description">{product.description}</p>

            <div className="detail-stats">
              <div className="stat-item">
                <div className="stat-value">₹{product.price.toFixed(2)}</div>
                <div className="stat-label">Price</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {product.stats.averageRating > 0
                    ? product.stats.averageRating.toFixed(1)
                    : 'N/A'}
                </div>
                <div className="stat-label">Rating</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{product.stats.totalReviews}</div>
                <div className="stat-label">Reviews</div>
              </div>
            </div>

            {product.stats.averageRating > 0 && (
              <div style={{ marginTop: '16px' }}>
                <Stars rating={product.stats.averageRating} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h3>📝 Write a Review</h3>
        <ReviewForm
          productId={productId}
          onReviewSubmitted={handleReviewSubmitted}
        />

        <h3 style={{ marginTop: '32px' }}>
          💬 Customer Reviews ({product.reviews.length})
        </h3>
        <ReviewList reviews={product.reviews} />
      </div>
    </div>
  );
}

export default ProductDetail;
