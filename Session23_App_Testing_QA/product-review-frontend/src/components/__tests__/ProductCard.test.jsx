import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '../ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    category: 'Test',
    imageUrl: 'https://example.com/image.jpg',
    stats: {
      averageRating: 4.5,
      totalReviews: 10,
    },
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  test('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} onClick={mockOnClick} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  test('displays product image with correct src and alt', () => {
    render(<ProductCard product={mockProduct} onClick={mockOnClick} />);

    const image = screen.getByAltText('Test Product');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  test('displays placeholder image when imageUrl is not provided', () => {
    const productWithoutImage = { ...mockProduct, imageUrl: null };
    render(<ProductCard product={productWithoutImage} onClick={mockOnClick} />);

    const image = screen.getByAltText('Test Product');
    expect(image.src).toContain('placeholder');
  });

  test('displays rating and review count when reviews exist', () => {
    render(<ProductCard product={mockProduct} onClick={mockOnClick} />);

    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('10 reviews')).toBeInTheDocument();
  });

  test('displays singular "review" for one review', () => {
    const productWithOneReview = {
      ...mockProduct,
      stats: { averageRating: 5, totalReviews: 1 },
    };
    render(
      <ProductCard product={productWithOneReview} onClick={mockOnClick} />
    );

    expect(screen.getByText('1 review')).toBeInTheDocument();
  });

  test('displays "No reviews yet" when no reviews exist', () => {
    const productWithNoReviews = {
      ...mockProduct,
      stats: { averageRating: 0, totalReviews: 0 },
    };
    render(
      <ProductCard product={productWithNoReviews} onClick={mockOnClick} />
    );

    expect(screen.getByText('No reviews yet')).toBeInTheDocument();
  });

  test('calls onClick when card is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} onClick={mockOnClick} />);

    const card = screen.getByTestId('product-card-1');
    await user.click(card);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('calls onClick when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} onClick={mockOnClick} />);

    const card = screen.getByTestId('product-card-1');
    card.focus();
    await user.keyboard('{Enter}');

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('formats price to two decimal places', () => {
    const productWithPrice = { ...mockProduct, price: 50 };
    render(<ProductCard product={productWithPrice} onClick={mockOnClick} />);

    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });
});
