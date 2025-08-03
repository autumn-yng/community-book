import React, { useState, useEffect } from 'react';
import BookDetailsModal from './BookDetailsModal';
import AddBookModal from './AddBookModal';

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
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showAddBookModal, setShowAddBookModal] = useState(false);

  useEffect(() => {
    // Fetch real data from backend /books endpoint
    fetch("http://localhost:8080/api/v1/books")
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
    //
    // Mock data (commented out):
    // setTimeout(() => {
    //   setBooks([...]);
    //   setLoading(false);
    // }, 1000);
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
        <p>Loading books...</p>
      </div>
    );
  }

  return (
    <div className="homepage">
      {/* Header */}
      <header className="app-header">
        <h1>📚 Community Book Exchange</h1>
        <p>Share books with your local community</p>
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
                <img src={book.photoUrl} alt={book.title} />
                <div className="book-type-badge">
                  {book.type === 'GIVEAWAY' ? '🎁 FREE' : `💰 $${book.price.toFixed(2)}`}
                </div>
              </div>
              <div className="book-content">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <p className="book-description">
                  {book.description.length > 100 
                    ? `${book.description.substring(0, 100)}...` 
                    : book.description
                  }
                </p>
                <p className="book-owner">📍 {book.ownerName}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Action Button */}
      <button className="fab" onClick={handleAddBook} title="Add a book">
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
