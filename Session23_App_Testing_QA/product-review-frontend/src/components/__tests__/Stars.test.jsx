import { render, screen } from '@testing-library/react';
import Stars from '../Stars';

describe('Stars Component', () => {
  test('renders 5 filled stars for rating 5', () => {
    render(<Stars rating={5} />);

    const filledStars = screen.getAllByLabelText('filled star');
    expect(filledStars).toHaveLength(5);
  });

  test('renders correct filled and empty stars for rating 3', () => {
    render(<Stars rating={3} />);

    const filledStars = screen.getAllByLabelText('filled star');
    const emptyStars = screen.getAllByLabelText('empty star');

    expect(filledStars).toHaveLength(3);
    expect(emptyStars).toHaveLength(2);
  });

  test('renders no filled stars for rating 0', () => {
    render(<Stars rating={0} />);

    const emptyStars = screen.getAllByLabelText('empty star');
    expect(emptyStars).toHaveLength(5);
  });

  test('renders correct aria-label with rating', () => {
    render(<Stars rating={4.5} />);

    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      '4.5 out of 5 stars'
    );
  });

  test('floors decimal ratings', () => {
    render(<Stars rating={3.8} />);

    const filledStars = screen.getAllByLabelText('filled star');
    expect(filledStars).toHaveLength(3);
  });

  test('applies correct size class', () => {
    const { container } = render(<Stars rating={5} size="small" />);

    expect(container.querySelector('.stars-small')).toBeInTheDocument();
  });

  test('uses medium size by default', () => {
    const { container } = render(<Stars rating={5} />);

    expect(container.querySelector('.stars-medium')).toBeInTheDocument();
  });
});
