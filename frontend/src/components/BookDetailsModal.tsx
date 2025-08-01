import React from 'react';

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

interface BookDetailsModalProps {
  book: Book;
  onClose: () => void;
}

const BookDetailsModal: React.FC<BookDetailsModalProps> = ({ book, onClose }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleContactOwner = () => {
    const subject = `Interested in "${book.title}"`;
    const body = `Hi ${book.ownerName},\n\nI saw your listing for "${book.title}" by ${book.author} on Community Book Exchange and I'm interested!\n\nCould we arrange a time to meet?\n\nThanks!`;
    
    if (book.contactMethod === 'EMAIL') {
      window.open(`mailto:${book.contactInfo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    } else {
      // For phone numbers, we can show a dialog or copy to clipboard
      navigator.clipboard.writeText(book.contactInfo);
      alert(`Phone number copied to clipboard: ${book.contactInfo}`);
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        
        <div className="modal-header">
          <h2>{book.title}</h2>
          <p className="modal-author">by {book.author}</p>
        </div>

        <div className="modal-body">
          <div className="book-image-large">
            <img src={book.photoUrl} alt={book.title} />
          </div>

          <div className="book-info-section">
            <div className="info-item">
              <label>Type:</label>
              <span className="type-badge">
                {book.type === 'GIVEAWAY' ? '🎁 Free Giveaway' : `💰 For Sale - $${book.price.toFixed(2)}`}
              </span>
            </div>
          </div>

          <div className="description-section">
            <label>Description:</label>
            <p className="book-description-full">{book.description}</p>
          </div>

          <div className="owner-section">
            <label>Contact Information:</label>
            <p className="owner-info">📍 {book.ownerName}</p>
            <p className="contact-info">
              {book.contactMethod === 'EMAIL' ? '📧' : '📞'} {book.contactInfo}
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={handleContactOwner}>
            {book.contactMethod === 'EMAIL' ? '📧 Send Email' : '📞 Copy Phone Number'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsModal;
