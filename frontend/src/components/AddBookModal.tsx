import React, { useState } from 'react';

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

interface AddBookModalProps {
  onClose: () => void;
  onBookAdded: (book: Book) => void;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ onClose, onBookAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    type: 'SELL',
    description: '',
    photo: null as File | null,
    photoPreview: '',
    ownerName: '',
    contactMethod: 'EMAIL',
    contactInfo: ''
  });

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new book object (in real app, this would call the API)
    const newBook: Book = {
      id: Date.now(), // Temporary ID generation
      title: formData.title,
      author: formData.author,
      price: formData.type === 'SELL' ? parseFloat(formData.price) || 0 : 0,
      type: formData.type as 'SELL' | 'GIVEAWAY',
      description: formData.description,
      photoUrl: formData.photoPreview || 'https://via.placeholder.com/300x400/ccc/white?text=No+Image',
      ownerName: formData.ownerName,
      contactMethod: formData.contactMethod as 'EMAIL' | 'PHONE',
      contactInfo: formData.contactInfo
    };

    onBookAdded(newBook);
    
    // Reset form
    setFormData({
      title: '',
      author: '',
      price: '',
      type: 'SELL',
      description: '',
      photo: null,
      photoPreview: '',
      ownerName: '',
      contactMethod: 'EMAIL',
      contactInfo: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        photo: file,
        photoPreview: URL.createObjectURL(file)
      });
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content modal-content-wide">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        
        <div className="modal-header">
          <h2>📚 List a New Book</h2>
          <p>Share a book with your community</p>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Book Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter book title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="author">Author *</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  placeholder="Enter author name"
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div className="form-group">
              <label htmlFor="photo">Book Photo *</label>
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                required
              />
              {formData.photoPreview && (
                <div className="photo-preview">
                  <img src={formData.photoPreview} alt="Book preview" />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="type">Listing Type *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="SELL">For Sale</option>
                  <option value="GIVEAWAY">Free Giveaway</option>
                </select>
              </div>

              {formData.type === 'SELL' && (
                <div className="form-group">
                  <label htmlFor="price">Price ($) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Tell people about this book..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ownerName">Your Name *</label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactMethod">Contact Method *</label>
                <select
                  id="contactMethod"
                  name="contactMethod"
                  value={formData.contactMethod}
                  onChange={handleChange}
                >
                  <option value="EMAIL">Email</option>
                  <option value="PHONE">Phone</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contactInfo">
                {formData.contactMethod === 'EMAIL' ? 'Your Email *' : 'Your Phone Number *'}
              </label>
              <input
                type={formData.contactMethod === 'EMAIL' ? 'email' : 'tel'}
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                required
                placeholder={formData.contactMethod === 'EMAIL' ? 'your.email@example.com' : '(555) 123-4567'}
              />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                📚 List Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookModal;
