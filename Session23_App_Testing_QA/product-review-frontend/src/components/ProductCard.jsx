import Stars from './Stars';

function ProductCard({ product, onClick }) {
  const { name, description, price, category, imageUrl, stats } = product;

  return (
    <div
      className="product-card"
      onClick={onClick}
      data-testid={`product-card-${product.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <img
        src={imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
        alt={name}
        className="product-image"
      />
      <div className="product-content">
        <span className="product-category">{category}</span>
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{description}</p>
        <div className="product-footer">
          <div className="product-price">${price.toFixed(2)}</div>
          <div className="product-stats">
            {stats.totalReviews > 0 ? (
              <>
                <div className="rating">
                  <Stars rating={stats.averageRating} size="small" />
                  <span>{stats.averageRating.toFixed(1)}</span>
                </div>
                <div className="review-count">
                  {stats.totalReviews}{' '}
                  {stats.totalReviews === 1 ? 'review' : 'reviews'}
                </div>
              </>
            ) : (
              <div className="review-count">No reviews yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
