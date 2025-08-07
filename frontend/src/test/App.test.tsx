import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import App from '../App';

// Mock fetch for the HomePage component
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => []
});

describe('App Integration', () => {
  test('renders main app structure', async () => {
    render(<App />);
    
    // Wait for loading to finish and check that the main header is rendered
    await waitFor(() => {
      expect(screen.getByText('📚 Community Book Exchange')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Share books with your local community')).toBeInTheDocument();
    
    // Check that the FAB is rendered
    expect(screen.getByTitle('Add a book')).toBeInTheDocument();
  });
});
