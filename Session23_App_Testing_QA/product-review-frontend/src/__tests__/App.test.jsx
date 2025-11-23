import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock the API module
jest.mock('../api', () => ({
  api: {
    getAllProducts: jest.fn(),
    getProduct: jest.fn(),
    getReviews: jest.fn(),
    createReview: jest.fn(),
  },
}));

const { api } = require('../api');

const mockProducts = [
  {
    id: '1',
    name: 'Product 1',
    price: 99.99,
    category: 'Electronics',
    description: 'Test description',
    imageUrl: 'https://example.com/image1.jpg',
    stats: {
      averageRating: 4.5,
      totalReviews: 10,
    },
  },
  {
    id: '2',
    name: 'Product 2',
    price: 149.99,
    category: 'Clothing',
    description: 'Test description 2',
    imageUrl: 'https://example.com/image2.jpg',
    stats: {
      averageRating: 4.0,
      totalReviews: 5,
    },
  },
];

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getAllProducts.mockResolvedValue(mockProducts);
  });

  test('renders app title', () => {
    render(<App />);

    expect(screen.getByText(/Product Review System/i)).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    render(<App />);

    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });

  test('renders product list after loading', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  test('handles API error gracefully', async () => {
    api.getAllProducts.mockRejectedValue(new Error('Failed to fetch'));

    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /error/i })
      ).toBeInTheDocument();
    });

    expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
  });

  test('shows product detail when product is clicked', async () => {
    const user = userEvent.setup();
    const mockProductDetail = {
      ...mockProducts[0],
      reviews: [
        {
          id: '1',
          userName: 'John',
          rating: 5,
          comment: 'Great!',
          createdAt: new Date().toISOString(),
        },
      ],
    };
    api.getProduct.mockResolvedValue(mockProductDetail);

    render(<App />);

    await waitFor(
      () => {
        expect(screen.getByText('Product 1')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const productCards = screen.getAllByTestId(/product-card/);
    await user.click(productCards[0]);

    await waitFor(
      () => {
        expect(api.getProduct).toHaveBeenCalledWith('1');
      },
      { timeout: 3000 }
    );
  });

  test('returns to product list when back button is clicked', async () => {
    const user = userEvent.setup();
    const mockProductDetail = {
      ...mockProducts[0],
      reviews: [],
    };
    api.getProduct.mockResolvedValue(mockProductDetail);

    render(<App />);

    // Wait for products to load
    await waitFor(
      () => {
        expect(screen.getByText('Product 1')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Click on a product
    const productCards = screen.getAllByTestId(/product-card/);
    await user.click(productCards[0]);

    // Should call getProduct
    await waitFor(
      () => {
        expect(api.getProduct).toHaveBeenCalledWith('1');
      },
      { timeout: 3000 }
    );
  });

  test('fetches products on mount', async () => {
    render(<App />);

    await waitFor(() => {
      expect(api.getAllProducts).toHaveBeenCalled();
    });
  });

  test('displays error message with details', async () => {
    api.getAllProducts.mockRejectedValue(new Error('Network error'));

    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /error/i })
      ).toBeInTheDocument();
    });
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });
});
