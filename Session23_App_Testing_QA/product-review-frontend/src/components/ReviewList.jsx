import Stars from './Stars';

function ReviewList({ reviews }) {
  if (reviews.length === 0) {
    return (
      <div className="no-reviews">
        <p>No reviews yet</p>
        <p>Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="review-list" data-testid="review-list">
      {reviews.map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="review-card" data-testid={`review-${review.id}`}>
      <div className="review-header">
        <span className="review-author">{review.userName}</span>
        <span className="review-date">{formatDate(review.createdAt)}</span>
      </div>
      <div className="review-rating">
        <Stars rating={review.rating} size="small" />
      </div>
      <p className="review-comment">{review.comment}</p>
    </div>
  );
}

export default ReviewList;
