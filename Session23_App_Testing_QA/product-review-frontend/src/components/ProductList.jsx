import ProductCard from './ProductCard';

function ProductList({ products, onProductClick }) {
  if (products.length === 0) {
    return (
      <div className="no-reviews">
        <p>No products available</p>
      </div>
    );
  }

  return (
    <div className="product-list" data-testid="product-list">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onProductClick(product.id)}
        />
      ))}
    </div>
  );
}

export default ProductList;
