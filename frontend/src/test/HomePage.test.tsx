import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import HomePage from '../components/HomePage';

const mockBooks = [
  {
    id: 1,
    title: 'Test Book 1',
    author: 'Test Author 1',
    price: 15.99,
    type: 'SELL' as const,
    description: 'A great test book',
    photoUrl: '/api/v1/books/1/photo',
    ownerName: 'John Doe',
    contactMethod: 'EMAIL' as const,
    contactInfo: 'john@example.com'
  },
  {
    id: 2,
    title: 'Free Book',
    author: 'Test Author 2',
    price: 0,
    type: 'GIVEAWAY' as const,
    description: 'A free book for everyone',
    photoUrl: '/api/v1/books/2/photo',
    ownerName: 'Jane Doe',
    contactMethod: 'PHONE' as const,
    contactInfo: '555-1234'
  }
];

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('displays loading state initially', () => {
    // Mock the fetch function
	// Here, new Promise(() => {}) makes it never get resolved so that we can test the loading state
    global.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));
    
    render(<HomePage />);
    
    expect(screen.getByText('Loading books...')).toBeInTheDocument();
  });

  test('displays books after successful API call', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockBooks
    });

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
      expect(screen.getByText('Free Book')).toBeInTheDocument();
    });

    expect(screen.getByText('by Test Author 1')).toBeInTheDocument();
    expect(screen.getByText('💰 $15.99')).toBeInTheDocument();
    expect(screen.getByText('🎁 FREE')).toBeInTheDocument();
  });

  test('handles API error gracefully', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('API Error'));

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.queryByText('Loading books...')).not.toBeInTheDocument();
    });

    // Should not crash and display the main container
    expect(screen.getByText('📚 Community Book Exchange')).toBeInTheDocument();
  });

  test('opens add book modal when FAB is clicked', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockBooks
    });

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    const fabButton = screen.getByTitle('Add a book');
    fireEvent.click(fabButton);

    expect(screen.getByText('📚 List a New Book')).toBeInTheDocument();
  });

  test('opens book details modal when book is clicked', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockBooks
    });

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    const bookCard = screen.getByText('Test Book 1').closest('.book-card');
    if (bookCard) {
      fireEvent.click(bookCard);
    }

    expect(screen.getByText('📧 john@example.com')).toBeInTheDocument();
  });
});