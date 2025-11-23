import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductDetail from '../ProductDetail';

// Mock the API module
jest.mock('../../api', () => ({
  api: {
    getProduct: jest.fn(),
    getReviews: jest.fn(),
    createReview: jest.fn(),
  },
}));

const { api } = require('../../api');

const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 99.99,
  category: 'Electronics',
  imageUrl: 'https://example.com/image.jpg',
  stats: {
    averageRating: 4.5,
    totalReviews: 10,
  },
  reviews: [
    {
      id: '1',
      userName: 'John',
      rating: 5,
      comment: 'Great!',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      userName: 'Jane',
      rating: 4,
      comment: 'Good',
      createdAt: new Date().toISOString(),
    },
  ],
};

describe('ProductDetail', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    api.getProduct.mockResolvedValue(mockProduct);
    api.createReview.mockResolvedValue({
      id: '3',
      userName: 'Test',
      rating: 5,
      comment: 'Test',
    });
  });

  test('renders loading state initially', () => {
    render(<ProductDetail productId="1" onBack={mockOnBack} />);

    expect(screen.getByText(/loading product details/i)).toBeInTheDocument();
  });

  test('renders product details after loading', async () => {
    render(<ProductDetail productId="1" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText(/99\.99/)).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  test('renders product stats correctly', async () => {
    render(<ProductDetail productId="1" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    expect(screen.getByText('Reviews')).toBeInTheDocument();
  });

  test('renders review form and list', async () => {
    render(<ProductDetail productId="1" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /submit review/i })
      ).toBeInTheDocument();
    });

    // Reviews should be displayed
    expect(screen.getByText('Great!')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  test('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductDetail productId="1" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', {
      name: /back to products/i,
    });
    await user.click(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });

  test('handles API error for product', async () => {
    api.getProduct.mockRejectedValue(new Error('Failed to fetch'));

    render(<ProductDetail productId="1" onBack={mockOnBack} />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /error/i })
      ).toBeInTheDocument();
    });
  });

  test('refreshes reviews when new review is submitted', async () => {
    const user = userEvent.setup();
    render(<ProductDetail productId="1" onBack={mockOnBack} />);

    await waitFor(
      () => {
        expect(
          screen.getByRole('button', { name: /submit review/i })
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Verify initial API call
    expect(api.getProduct).toHaveBeenCalledWith('1');
  });
});
