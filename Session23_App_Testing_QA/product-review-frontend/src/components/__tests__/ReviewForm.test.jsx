import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewForm from '../ReviewForm';
import { api } from '../../api';

jest.mock('../../api');

describe('ReviewForm', () => {
  const mockOnReviewSubmitted = jest.fn();
  const productId = '123';

  beforeEach(() => {
    mockOnReviewSubmitted.mockClear();
    api.createReview.mockClear();
  });

  test('renders form with all fields', () => {
    render(
      <ReviewForm
        productId={productId}
        onReviewSubmitted={mockOnReviewSubmitted}
      />
    );

    expect(screen.getByLabelText('Your Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Rating')).toBeInTheDocument();
    expect(screen.getByLabelText('Your Review')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /submit review/i })
    ).toBeInTheDocument();
  });

  test('shows validation error when name is empty', async () => {
    const user = userEvent.setup();
    render(
      <ReviewForm
        productId={productId}
        onReviewSubmitted={mockOnReviewSubmitted}
      />
    );

    const submitButton = screen.getByRole('button', { name: /submit review/i });
    await user.click(submitButton);

    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(api.createReview).not.toHaveBeenCalled();
  });

  test('shows validation error when comment is empty', async () => {
    const user = userEvent.setup();
    render(
      <ReviewForm
        productId={productId}
        onReviewSubmitted={mockOnReviewSubmitted}
      />
    );

    const nameInput = screen.getByLabelText('Your Name');
    await user.type(nameInput, 'John Doe');

    const submitButton = screen.getByRole('button', { name: /submit review/i });
    await user.click(submitButton);

    expect(screen.getByText('Comment is required')).toBeInTheDocument();
  });

  test('shows validation error when comment is too short', async () => {
    const user = userEvent.setup();
    render(
      <ReviewForm
        productId={productId}
        onReviewSubmitted={mockOnReviewSubmitted}
      />
    );

    const nameInput = screen.getByLabelText('Your Name');
    await user.type(nameInput, 'John Doe');

    const commentInput = screen.getByLabelText('Your Review');
    await user.type(commentInput, 'Short');

    const submitButton = screen.getByRole('button', { name: /submit review/i });
    await user.click(submitButton);

    expect(
      screen.getByText('Comment must be at least 10 characters')
    ).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    const user = userEvent.setup();
    api.createReview.mockResolvedValueOnce({ id: '1' });

    render(
      <ReviewForm
        productId={productId}
        onReviewSubmitted={mockOnReviewSubmitted}
      />
    );

    const nameInput = screen.getByLabelText('Your Name');
    await user.type(nameInput, 'John Doe');

    const ratingSelect = screen.getByLabelText('Rating');
    await user.selectOptions(ratingSelect, '4');

    const commentInput = screen.getByLabelText('Your Review');
    await user.type(commentInput, 'This is a great product!');

    const submitButton = screen.getByRole('button', { name: /submit review/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(api.createReview).toHaveBeenCalledWith({
        productId: '123',
        userName: 'John Doe',
        rating: 4,
        comment: 'This is a great product!',
      });
    });

    expect(mockOnReviewSubmitted).toHaveBeenCalledTimes(1);
  });

  test('shows success message after successful submission', async () => {
    const user = userEvent.setup();
    api.createReview.mockResolvedValueOnce({ id: '1' });

    render(
      <ReviewForm
        productId={productId}
        onReviewSubmitted={mockOnReviewSubmitted}
      />
    );

    const nameInput = screen.getByLabelText('Your Name');
    await user.type(nameInput, 'John Doe');

    const commentInput = screen.getByLabelText('Your Review');
    await user.type(commentInput, 'Excellent product!');

    const submitButton = screen.getByRole('button', { name: /submit review/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/review submitted successfully/i)
      ).toBeInTheDocument();
    });
  });

  test('clears form after successful submission', async () => {
    const user = userEvent.setup();
    api.createReview.mockResolvedValueOnce({ id: '1' });

    render(
      <ReviewForm
        productId={productId}
        onReviewSubmitted={mockOnReviewSubmitted}
      />
    );

    const nameInput = screen.getByLabelText('Your Name');
    await user.type(nameInput, 'John Doe');

    const commentInput = screen.getByLabelText('Your Review');
    await user.type(commentInput, 'Great product!');

    const submitButton = screen.getByRole('button', { name: /submit review/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(commentInput).toHaveValue('');
    });
  });

  test('shows error message when submission fails', async () => {
    const user = userEvent.setup();
    api.createReview.mockRejectedValueOnce(new Error('Network error'));

    render(
      <ReviewForm
        productId={productId}
        onReviewSubmitted={mockOnReviewSubmitted}
      />
    );

    const nameInput = screen.getByLabelText('Your Name');
    await user.type(nameInput, 'John Doe');

    const commentInput = screen.getByLabelText('Your Review');
    await user.type(commentInput, 'Great product!');

    const submitButton = screen.getByRole('button', { name: /submit review/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    expect(mockOnReviewSubmitted).not.toHaveBeenCalled();
  });

  test('disables form during submission', async () => {
    const user = userEvent.setup();
    api.createReview.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(
      <ReviewForm
        productId={productId}
        onReviewSubmitted={mockOnReviewSubmitted}
      />
    );

    const nameInput = screen.getByLabelText('Your Name');
    await user.type(nameInput, 'John Doe');

    const commentInput = screen.getByLabelText('Your Review');
    await user.type(commentInput, 'Great product!');

    const submitButton = screen.getByRole('button', { name: /submit review/i });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(nameInput).toBeDisabled();
  });

  test('clears field error when user starts typing', async () => {
    const user = userEvent.setup();
    render(
      <ReviewForm
        productId={productId}
        onReviewSubmitted={mockOnReviewSubmitted}
      />
    );

    // Trigger validation error
    const submitButton = screen.getByRole('button', { name: /submit review/i });
    await user.click(submitButton);

    expect(screen.getByText('Name is required')).toBeInTheDocument();

    // Start typing
    const nameInput = screen.getByLabelText('Your Name');
    await user.type(nameInput, 'J');

    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
  });
});
