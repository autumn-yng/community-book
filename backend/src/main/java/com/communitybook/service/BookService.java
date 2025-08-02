package com.communitybook.service;

import com.communitybook.model.Book;
import com.communitybook.model.BookType;
import com.communitybook.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class BookService {
    
    @Autowired
    private BookRepository bookRepository;
    
    public List<Book> getAllBooks() {
        return bookRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }
    
    public Book saveBook(Book book) {
        // Business logic: required fields
        if (book.getPhotoUrl() == null || book.getPhotoUrl().trim().isEmpty()) {
            throw new IllegalArgumentException("A photo is required for each book post.");
        }
        if (book.getContactInfo() == null || book.getContactInfo().trim().isEmpty()) {
            throw new IllegalArgumentException("Contact information is required.");
        }
        if (book.getTitle() == null || book.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Book title is required.");
        }
        if (book.getAuthor() == null || book.getAuthor().trim().isEmpty()) {
            throw new IllegalArgumentException("Author is required.");
        }
        if (book.getOwnerName() == null || book.getOwnerName().trim().isEmpty()) {
            throw new IllegalArgumentException("Owner name is required.");
        }
        if (book.getType() == null) {
            throw new IllegalArgumentException("Book type is required.");
        }
        if (book.getType() == com.communitybook.model.BookType.SELL && (book.getPrice() == null || book.getPrice().compareTo(java.math.BigDecimal.ZERO) < 0)) {
            throw new IllegalArgumentException("Price must be provided and non-negative for books for sale.");
        }
        // Add more business rules as needed
        return bookRepository.save(book);
    }
    
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
    
    public List<Book> getBooksByType(BookType type) {
        return bookRepository.findByType(type);
    }
    
    public List<Book> searchBooks(String searchTerm) {
        return bookRepository.findByTitleOrAuthorContaining(searchTerm);
    }
    
    public List<Book> getBooksByOwner(String ownerEmail) {
        return bookRepository.findByOwnerEmail(ownerEmail);
    }
    
    public Book updateBook(Long id, Book updatedBook) {
        // Business logic: required fields
        if (updatedBook.getPhotoUrl() == null || updatedBook.getPhotoUrl().trim().isEmpty()) {
            throw new IllegalArgumentException("A photo is required for each book post.");
        }
        if (updatedBook.getContactInfo() == null || updatedBook.getContactInfo().trim().isEmpty()) {
            throw new IllegalArgumentException("Contact information is required.");
        }
        if (updatedBook.getTitle() == null || updatedBook.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Book title is required.");
        }
        if (updatedBook.getAuthor() == null || updatedBook.getAuthor().trim().isEmpty()) {
            throw new IllegalArgumentException("Author is required.");
        }
        if (updatedBook.getOwnerName() == null || updatedBook.getOwnerName().trim().isEmpty()) {
            throw new IllegalArgumentException("Owner name is required.");
        }
        if (updatedBook.getType() == null) {
            throw new IllegalArgumentException("Book type is required.");
        }
        if (updatedBook.getType().toString().equals("SELL") && (updatedBook.getPrice() == null || updatedBook.getPrice().compareTo(BigDecimal.ZERO) < 0)) {
            throw new IllegalArgumentException("Price must be provided and non-negative for books for sale.");
        }
        return bookRepository.findById(id)
                .map(book -> {
                    book.setTitle(updatedBook.getTitle());
                    book.setAuthor(updatedBook.getAuthor());
                    book.setPhotoUrl(updatedBook.getPhotoUrl());
                    book.setPrice(updatedBook.getPrice());
                    book.setType(updatedBook.getType());
                    book.setDescription(updatedBook.getDescription());
                    book.setOwnerName(updatedBook.getOwnerName());
                    book.setContactMethod(updatedBook.getContactMethod());
                    book.setContactInfo(updatedBook.getContactInfo());
                    return bookRepository.save(book);
                })
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
    }
}
