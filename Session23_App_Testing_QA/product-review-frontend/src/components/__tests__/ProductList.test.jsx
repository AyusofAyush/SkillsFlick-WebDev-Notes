import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductList from '../ProductList';

describe('ProductList', () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      price: 99.99,
      category: 'Category 1',
      imageUrl: 'https://example.com/image1.jpg',
      stats: { averageRating: 4.5, totalReviews: 10 },
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'Description 2',
      price: 149.99,
      category: 'Category 2',
      imageUrl: 'https://example.com/image2.jpg',
      stats: { averageRating: 0, totalReviews: 0 },
    },
  ];

  const mockOnProductClick = jest.fn();

  beforeEach(() => {
    mockOnProductClick.mockClear();
  });

  test('renders all products', () => {
    render(
      <ProductList
        products={mockProducts}
        onProductClick={mockOnProductClick}
      />
    );

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  test('calls onProductClick with correct product id when product is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ProductList
        products={mockProducts}
        onProductClick={mockOnProductClick}
      />
    );

    const product1 = screen.getByTestId('product-card-1');
    await user.click(product1);

    expect(mockOnProductClick).toHaveBeenCalledWith('1');
  });

  test('displays message when no products available', () => {
    render(<ProductList products={[]} onProductClick={mockOnProductClick} />);

    expect(screen.getByText('No products available')).toBeInTheDocument();
  });

  test('renders product list container', () => {
    render(
      <ProductList
        products={mockProducts}
        onProductClick={mockOnProductClick}
      />
    );

    expect(screen.getByTestId('product-list')).toBeInTheDocument();
  });
});
