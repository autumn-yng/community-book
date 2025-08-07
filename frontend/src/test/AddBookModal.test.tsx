import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AddBookModal from '../components/AddBookModal'

describe('AddBookModal Component', () => {
  const mockOnClose = vi.fn()
  const mockOnBookAdded = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
    global.alert = vi.fn()
  })

  it('renders modal with form fields', () => {
    render(
      <AddBookModal 
        onClose={mockOnClose} 
        onBookAdded={mockOnBookAdded} 
      />
    )

    expect(screen.getByText('📚 List a New Book')).toBeInTheDocument()
    expect(screen.getByLabelText('Book Title *')).toBeInTheDocument()
    expect(screen.getByLabelText('Author *')).toBeInTheDocument()
    expect(screen.getByLabelText('Listing Type *')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    render(
      <AddBookModal 
        onClose={mockOnClose} 
        onBookAdded={mockOnBookAdded} 
      />
    )

    const closeButton = screen.getByText('✕')
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('displays all required form elements', () => {
    render(<AddBookModal onClose={mockOnClose} onBookAdded={mockOnBookAdded} />)
    
    // Check all the essential form elements are present
    expect(screen.getByLabelText('Book Photo *')).toBeInTheDocument()
    expect(screen.getByLabelText('Your Name *')).toBeInTheDocument()
    expect(screen.getByLabelText('Your Email *')).toBeInTheDocument()
    expect(screen.getByText('📚 List Book')).toBeInTheDocument()
  })
})
