import React from 'react';
import { useTranslation } from 'react-i18next';

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

interface BookDetailsModalProps {
  book: Book;
  onClose: () => void;
}

const BookDetailsModal: React.FC<BookDetailsModalProps> = ({ book, onClose }) => {
  const { t } = useTranslation();
  
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
      alert(`${t('book.contact.phoneAlert')} ${book.contactInfo}`);
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
          <p className="modal-author">{t('book.by')} {book.author}</p>
        </div>

        <div className="modal-body">
          <div className="book-image-large">
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
          </div>

          <div className="book-info-section">
            <div className="info-item">
              <label>{t('modal.bookDetails.type')}</label>
              <span className="type-badge">
                {book.type === 'GIVEAWAY' ? t('modal.bookDetails.freeGiveaway') : `${t('modal.bookDetails.forSale')} $${book.price.toFixed(2)}`}
              </span>
            </div>
          </div>

          <div className="description-section">
            <label>{t('modal.bookDetails.description')}</label>
            <p className="book-description-full">{book.description}</p>
          </div>

          <div className="owner-section">
            <label>{t('modal.bookDetails.contact')}</label>
            <p className="owner-info">{t('book.owner')} {book.ownerName}</p>
            <p className="contact-info">
              {book.contactMethod === 'EMAIL' ? '📧' : '📞'} {book.contactInfo}
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={handleContactOwner}>
            {book.contactMethod === 'EMAIL' ? t('book.contact.email') : t('book.contact.phone')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsModal;
