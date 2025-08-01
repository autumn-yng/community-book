import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Book {
  id: number;
  title: string;
  author: string;
  condition: string;
  price: number;
  type: 'SELL' | 'GIVEAWAY';
  description: string;
  ownerName: string;
  ownerEmail: string;
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This will call the Spring Boot API once it's implemented
    // For now, we'll use mock data
    setTimeout(() => {
      setBooks([
        {
          id: 1,
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          condition: "Good",
          price: 5.00,
          type: "SELL",
          description: "Classic American novel in good condition",
          ownerName: "John Doe",
          ownerEmail: "john@example.com"
        },
        {
          id: 2,
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          condition: "Excellent",
          price: 0.00,
          type: "GIVEAWAY",
          description: "Free to a good home",
          ownerName: "Jane Smith",
          ownerEmail: "jane@example.com"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div>Loading books...</div>;
  }

  return (
    <div>
      <h1>Available Books</h1>
      <div className="book-grid">
        {books.map(book => (
          <div key={book.id} className="book-card">
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Condition:</strong> {book.condition}</p>
            <p><strong>Type:</strong> {book.type}</p>
            {book.type === 'SELL' && (
              <p><strong>Price:</strong> ${book.price.toFixed(2)}</p>
            )}
            <p><strong>Description:</strong> {book.description}</p>
            <p><strong>Owner:</strong> {book.ownerName}</p>
            <button className="btn">Contact Owner</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
