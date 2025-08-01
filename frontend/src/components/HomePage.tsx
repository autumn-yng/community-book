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
    // This will call the Spring Boot API once it's implemented
    // For now, we'll use mock data
    setTimeout(() => {
      setBooks([
        {
          id: 1,
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          price: 5.00,
          type: "SELL",
          description: "Classic American novel in good condition. Some wear on the cover but all pages are intact and readable. A timeless story of love, wealth, and the American Dream.",
          photoUrl: "https://via.placeholder.com/300x400/4CAF50/white?text=The+Great+Gatsby",
          ownerName: "John Doe",
          contactMethod: "EMAIL",
          contactInfo: "john@example.com"
        },
        {
          id: 2,
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          price: 0.00,
          type: "GIVEAWAY",
          description: "Free to a good home! This book changed my life and I want to share it with someone who will appreciate it. In excellent condition, barely read.",
          photoUrl: "https://via.placeholder.com/300x400/2196F3/white?text=To+Kill+a+Mockingbird",
          ownerName: "Jane Smith",
          contactMethod: "PHONE",
          contactInfo: "(555) 123-4567"
        },
        {
          id: 3,
          title: "1984",
          author: "George Orwell",
          price: 3.50,
          type: "SELL",
          description: "Dystopian masterpiece. Some wear but still very readable. Perfect for anyone interested in political fiction.",
          photoUrl: "https://via.placeholder.com/300x400/FF9800/white?text=1984",
          ownerName: "Bob Johnson",
          contactMethod: "EMAIL",
          contactInfo: "bob@example.com"
        },
        {
          id: 4,
          title: "Pride and Prejudice",
          author: "Jane Austen",
          price: 0.00,
          type: "GIVEAWAY",
          description: "Classic romance novel. I've read it multiple times and now it's time to pass it on to another book lover.",
          photoUrl: "https://via.placeholder.com/300x400/E91E63/white?text=Pride+and+Prejudice",
          ownerName: "Alice Brown",
          contactMethod: "PHONE",
          contactInfo: "(555) 987-6543"
        },
        {
          id: 5,
          title: "The Catcher in the Rye",
          author: "J.D. Salinger",
          price: 7.00,
          type: "SELL",
          description: "Like new condition! Bought it but never got around to reading it. Your gain!",
          photoUrl: "https://via.placeholder.com/300x400/9C27B0/white?text=The+Catcher+in+the+Rye",
          ownerName: "Charlie Wilson",
          contactMethod: "EMAIL",
          contactInfo: "charlie@example.com"
        },
        {
          id: 6,
          title: "Harry Potter and the Sorcerer's Stone",
          author: "J.K. Rowling",
          price: 4.00,
          type: "SELL",
          description: "The book that started it all! Some minor wear from being well-loved.",
          photoUrl: "https://via.placeholder.com/300x400/607D8B/white?text=Harry+Potter",
          ownerName: "Diana Prince",
          contactMethod: "PHONE",
          contactInfo: "(555) 246-8135"
        }
      ]);
      setLoading(false);
    }, 1000);
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
