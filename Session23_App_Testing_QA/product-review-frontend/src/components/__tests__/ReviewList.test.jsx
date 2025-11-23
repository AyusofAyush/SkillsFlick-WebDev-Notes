import { render, screen } from '@testing-library/react';
import ReviewList from '../ReviewList';

// Mock Stars component
jest.mock('../Stars', () => ({ rating }) => (
  <div data-testid="stars-mock">{rating} stars</div>
));

describe('ReviewList', () => {
  const mockReviews = [
    {
      id: '1',
      userName: 'John Doe',
      rating: 5,
      comment: 'Excellent product!',
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      userName: 'Jane Smith',
      rating: 4,
      comment: 'Very good, highly recommend.',
      createdAt: '2024-01-14T15:45:00Z',
    },
    {
      id: '3',
      userName: 'Bob Johnson',
      rating: 3,
      comment: "It's okay, nothing special.",
      createdAt: '2024-01-13T09:15:00Z',
    },
  ];

  test('renders all reviews correctly', () => {
    render(<ReviewList reviews={mockReviews} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  test('renders review comments', () => {
    render(<ReviewList reviews={mockReviews} />);

    expect(screen.getByText('Excellent product!')).toBeInTheDocument();
    expect(
      screen.getByText('Very good, highly recommend.')
    ).toBeInTheDocument();
    expect(screen.getByText("It's okay, nothing special.")).toBeInTheDocument();
  });

  test('renders star ratings for each review', () => {
    render(<ReviewList reviews={mockReviews} />);

    const stars = screen.getAllByTestId('stars-mock');
    expect(stars).toHaveLength(3);
    expect(stars[0]).toHaveTextContent('5 stars');
    expect(stars[1]).toHaveTextContent('4 stars');
    expect(stars[2]).toHaveTextContent('3 stars');
  });

  test('renders formatted dates', () => {
    render(<ReviewList reviews={mockReviews} />);

    // Dates are formatted like "January 15, 2024"
    expect(screen.getByText(/January 15, 2024/)).toBeInTheDocument();
    expect(screen.getByText(/January 14, 2024/)).toBeInTheDocument();
    expect(screen.getByText(/January 13, 2024/)).toBeInTheDocument();
  });

  test('renders empty state when no reviews', () => {
    render(<ReviewList reviews={[]} />);

    expect(screen.getByText(/No reviews yet/)).toBeInTheDocument();
    expect(
      screen.getByText(/Be the first to review this product!/)
    ).toBeInTheDocument();
  });

  test('applies correct CSS classes to review cards', () => {
    const { container } = render(<ReviewList reviews={mockReviews} />);

    const reviewCards = container.querySelectorAll('.review-card');
    expect(reviewCards).toHaveLength(3);
  });

  test('renders review list container', () => {
    const { container } = render(<ReviewList reviews={mockReviews} />);

    const reviewList = container.querySelector('.review-list');
    expect(reviewList).toBeInTheDocument();
  });
});
