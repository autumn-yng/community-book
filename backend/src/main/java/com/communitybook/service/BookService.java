package com.communitybook.service;

import com.communitybook.model.Book;
import com.communitybook.model.BookType;
import com.communitybook.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
