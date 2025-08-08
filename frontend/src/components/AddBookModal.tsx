import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import heic2any from 'heic2any';

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
  const { t } = useTranslation();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.photo) {
      alert(t('modal.addBook.validation.photoRequired'));
      return;
    }
    // Prepare book data for backend (without photoUrl, backend will set it)
    const newBook = {
      title: formData.title,
      author: formData.author,
      price: formData.type === 'SELL' ? parseFloat(formData.price) || 0 : 0,
      type: formData.type,
      description: formData.description,
      ownerName: formData.ownerName,
      contactMethod: formData.contactMethod,
      contactInfo: formData.contactInfo
    };
    const form = new FormData();
    form.append('book', new Blob([JSON.stringify(newBook)], { type: 'application/json' }));
    form.append('photo', formData.photo);
    try {
      const response = await fetch("http://localhost:8080/api/v1/books/upload", {
        method: 'POST',
        body: form
      });
      if (!response.ok) {
        throw new Error('Failed to add book');
      }
      const savedBook = await response.json();
      onBookAdded(savedBook);
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
    } catch (error) {
      alert(t('modal.addBook.validation.uploadFailed'));
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // If file is HEIC, convert to JPEG using heic2any
    if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
      try {
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.9
        });
        const jpegFile = new File([convertedBlob as Blob], file.name.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg' });
        setFormData({
          ...formData,
          photo: jpegFile,
          photoPreview: URL.createObjectURL(jpegFile)
        });
      } catch (err) {
        alert('Failed to convert HEIC image. Please try another file.');
        console.error(err);
      }
    } else {
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
          <h2>{t('modal.addBook.title')}</h2>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">{t('modal.addBook.form.bookTitle')} *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder={t('modal.addBook.form.bookTitle')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="author">{t('modal.addBook.form.author')} *</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  placeholder={t('modal.addBook.form.author')}
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div className="form-group">
              <label htmlFor="photo">{t('modal.addBook.form.photo')} *</label>
              <input
                type="file"
                id="photo"
                name="photo"
                accept=".jpg,.jpeg,.png,.heic,image/heic,image/jpeg,image/png"
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
                <label htmlFor="type">{t('modal.addBook.form.type')} *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="SELL">{t('modal.addBook.form.sell')}</option>
                  <option value="GIVEAWAY">{t('modal.addBook.form.giveaway')}</option>
                </select>
              </div>

              {formData.type === 'SELL' && (
                <div className="form-group">
                  <label htmlFor="price">{t('modal.addBook.form.price')} *</label>
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
              <label htmlFor="description">{t('modal.addBook.form.description')}</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder={t('modal.addBook.form.description')}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ownerName">{t('modal.addBook.form.ownerName')} *</label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  required
                  placeholder={t('modal.addBook.form.ownerName')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactMethod">{t('modal.addBook.form.contactMethod')} *</label>
                <select
                  id="contactMethod"
                  name="contactMethod"
                  value={formData.contactMethod}
                  onChange={handleChange}
                >
                  <option value="EMAIL">{t('modal.addBook.form.email')}</option>
                  <option value="PHONE">{t('modal.addBook.form.phone')}</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contactInfo">
                {formData.contactMethod === 'EMAIL' ? t('modal.addBook.form.contactInfo') : t('modal.addBook.form.contactInfo')} *
              </label>
              <input
                type={formData.contactMethod === 'EMAIL' ? 'email' : 'tel'}
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                required
                placeholder={formData.contactMethod === 'EMAIL' ? t('modal.addBook.form.emailPlaceholder') : t('modal.addBook.form.phonePlaceholder')}
              />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                {t('modal.addBook.buttons.cancel')}
              </button>
              <button type="submit" className="btn btn-primary">
                {t('modal.addBook.buttons.addBook')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookModal;
