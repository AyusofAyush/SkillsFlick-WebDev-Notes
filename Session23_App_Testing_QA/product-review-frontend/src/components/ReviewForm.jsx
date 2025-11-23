import { useState } from 'react';
import { api } from '../api';

function ReviewForm({ productId, onReviewSubmitted }) {
  const [formData, setFormData] = useState({
    userName: '',
    rating: 5,
    comment: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = 'Name is required';
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'Comment is required';
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Comment must be at least 10 characters';
    }

    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      await api.createReview({
        productId,
        ...formData,
      });

      setSubmitSuccess(true);
      setFormData({ userName: '', rating: 5, comment: '' });
      setErrors({});

      // Call parent callback to refresh reviews
      onReviewSubmitted();

      // Clear success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="review-form"
      onSubmit={handleSubmit}
      data-testid="review-form"
    >
      {submitSuccess && (
        <div
          style={{
            padding: '12px',
            background: '#10b981',
            color: 'white',
            borderRadius: '8px',
            marginBottom: '16px',
          }}
        >
          ✓ Review submitted successfully!
        </div>
      )}

      {submitError && (
        <div
          style={{
            padding: '12px',
            background: '#ef4444',
            color: 'white',
            borderRadius: '8px',
            marginBottom: '16px',
          }}
        >
          {submitError}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="userName">Your Name</label>
        <input
          type="text"
          id="userName"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          placeholder="Enter your name"
          disabled={submitting}
        />
        {errors.userName && <div className="form-error">{errors.userName}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="rating">Rating</label>
        <select
          id="rating"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          disabled={submitting}
        >
          <option value={5}>⭐⭐⭐⭐⭐ Excellent (5)</option>
          <option value={4}>⭐⭐⭐⭐ Good (4)</option>
          <option value={3}>⭐⭐⭐ Average (3)</option>
          <option value={2}>⭐⭐ Poor (2)</option>
          <option value={1}>⭐ Terrible (1)</option>
        </select>
        {errors.rating && <div className="form-error">{errors.rating}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="comment">Your Review</label>
        <textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          placeholder="Share your experience with this product..."
          disabled={submitting}
        />
        {errors.comment && <div className="form-error">{errors.comment}</div>}
      </div>

      <button type="submit" className="submit-button" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

export default ReviewForm;
