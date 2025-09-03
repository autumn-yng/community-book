import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BookDetailsModal from './BookDetailsModal';
import AddBookModal from './AddBookModal';
import LanguageSelector from './LanguageSelector';

// Define API_URL with Vite env var and fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  type: 'SELL' | 'GIVEAWAY';
  description: string;
  photoUrl: string;
  ownerName: string;
  contactMethod: 'EMAIL' | 'PHONE';
  contactInfo: string;
}

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showAddBookModal, setShowAddBookModal] = useState(false);

  useEffect(() => {
    // Fetch real data from backend /books endpoint
    fetch(`${API_URL}/v1/books`) // be careful: it's the backtick `${API_URL}...`, not quotation mark "${API_URL}..."
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        return response.json();
      })
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setBooks([]);
        setLoading(false);
      });
  }, []);

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  const handleAddBook = () => {
    setShowAddBookModal(true);
  };

  const handleCloseAddBookModal = () => {
    setShowAddBookModal(false);
  };

  const handleBookAdded = (newBook: Book) => {
    setBooks([newBook, ...books]); // Add to the beginning of the list
    setShowAddBookModal(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t('loading.text')}</p>
      </div>
    );
  }

  return (
    <div className="homepage">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-text">
            <h1>{t('header.title')}</h1>
            <p>{t('header.subtitle')}</p>
          </div>
          <LanguageSelector />
        </div>
      </header>

      {/* Book Grid */}
      <main className="books-container">
        <div className="book-grid">
          {books.map(book => (
            <div 
              key={book.id} 
              className="book-card" 
              onClick={() => handleBookClick(book)}
            >
              <div className="book-image">
                <img 
                  src={book.photoUrl && book.photoUrl.startsWith('/api/v1/books/') 
                    ? `${API_URL}${book.photoUrl}` 
                    : `${API_URL}/v1/books/${book.id}/photo`} 
                  alt={book.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2MCIgdmlld0JveD0iMCAwIDIwMCAyNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NSA5NUgxMTVWMTI1SDg1Vjk1WiIgZmlsbD0iI0Q1REJEQiIvPgo8cGF0aCBkPSJNNzAgMTQwSDEzMFYxNTVINzBWMTQwWiIgZmlsbD0iI0Q1REJEQiIvPgo8cGF0aCBkPSJNNzAgMTY1SDEzMFYxODBINzBWMTY1WiIgZmlsbD0iI0Q1REJEQiIvPgo8L3N2Zz4K';
                  }}
                />
                <div className="book-type-badge">
                  {book.type === 'GIVEAWAY' ? t('book.type.free') : `${t('book.type.sale')} $${book.price.toFixed(2)}`}
                </div>
              </div>
              <div className="book-content">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{t('book.by')} {book.author}</p>
                <p className="book-description">
                  {book.description.length > 100 
                    ? `${book.description.substring(0, 100)}...` 
                    : book.description
                  }
                </p>
                <p className="book-owner">{t('book.owner')} {book.ownerName}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Action Button */}
      <button className="fab" onClick={handleAddBook} title={t('fab.tooltip')}>
        ➕
      </button>

      {/* Modals */}
      {selectedBook && (
        <BookDetailsModal 
          book={selectedBook} 
          onClose={handleCloseModal} 
        />
      )}

      {showAddBookModal && (
        <AddBookModal 
          onClose={handleCloseAddBookModal}
          onBookAdded={handleBookAdded}
        />
      )}
    </div>
  );
};

export default HomePage;
