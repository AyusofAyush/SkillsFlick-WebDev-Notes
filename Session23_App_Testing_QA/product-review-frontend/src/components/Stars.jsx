function Stars({ rating, size = 'medium' }) {
  const stars = [];
  const fullStars = Math.floor(rating);

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={`star ${i <= fullStars ? 'filled' : 'empty'}`}
        aria-label={i <= fullStars ? 'filled star' : 'empty star'}
      >
        ★
      </span>
    );
  }

  return (
    <div
      className={`stars stars-${size}`}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {stars}
    </div>
  );
}

export default Stars;
