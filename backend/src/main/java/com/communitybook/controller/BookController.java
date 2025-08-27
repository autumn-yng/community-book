// This file defines the RESTful API endpoints for managing books in the application.
// It uses Spring Boot's REST controller features to map HTTP requests to Java methods.
package com.communitybook.controller;

import com.communitybook.model.Book;
import com.communitybook.model.BookType;
import com.communitybook.service.BookService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.util.List;

// Marks this class as a REST controller, so its methods handle HTTP requests and return data (usually JSON)
@RestController
// Sets the base URL path for all endpoints in this controller to /api/v1/books (API version 1)
@RequestMapping("/api/v1/books")
@CrossOrigin(origins = "http://localhost:3000")
public class BookController {
    
    // Injects the BookService, which contains the business logic for books
    @Autowired
    private BookService bookService;
    
    // Handles GET requests to /api/books
    // Returns a list of all books
    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        List<Book> books = bookService.getAllBooks();
        return ResponseEntity.ok(books);
    }
    
    // Handles GET requests to /api/books/{id}
    // Returns a single book by its ID, or 404 if not found
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        return bookService.getBookById(id)
                .map(book -> ResponseEntity.ok(book))
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Handles POST requests to /api/v1/books/upload (multipart form for image upload)
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Book> createBookWithImage(
            @RequestPart("book") Book book,
            @RequestPart("photo") MultipartFile photo
    ) throws IOException {
        book.setPhotoData(photo.getBytes());
        // Optionally set photoUrl to a download endpoint
        book.setPhotoUrl("/api/v1/books/" + book.getId() + "/photo");
        Book savedBook = bookService.saveBook(book);
        // After it passed bookService and bookRepository and got persisted in the database, the Controller here updates photoUrl with the real id from the database
        savedBook.setPhotoUrl("/api/v1/books/" + savedBook.getId() + "/photo");
        bookService.saveBook(savedBook);
        // return a JSON response to React
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBook);
    }

    // Endpoint to serve the book image
    @GetMapping("/{id}/photo")
    public ResponseEntity<byte[]> getBookPhoto(@PathVariable Long id) {
        return bookService.getBookById(id)
                .filter(book -> book.getPhotoData() != null)
                .map(book -> {
                    // Detect image format from byte data
                    byte[] imageData = book.getPhotoData();
                    MediaType contentType = detectImageMediaType(imageData);
                    return ResponseEntity.ok()
                            .contentType(contentType)
                            .body(imageData);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    private MediaType detectImageMediaType(byte[] imageData) {
        if (imageData.length < 4) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }
        
        // Check for JPEG signature (FF D8)
        if (imageData[0] == (byte) 0xFF && imageData[1] == (byte) 0xD8) {
            return MediaType.IMAGE_JPEG;
        }
        // Check for PNG signature (89 50 4E 47)
        if (imageData[0] == (byte) 0x89 && imageData[1] == 0x50 && 
            imageData[2] == 0x4E && imageData[3] == 0x47) {
            return MediaType.IMAGE_PNG;
        }
        // Check for WebP signature (52 49 46 46)
        if (imageData[0] == 0x52 && imageData[1] == 0x49 && 
            imageData[2] == 0x46 && imageData[3] == 0x46) {
            return MediaType.parseMediaType("image/webp");
        }
        
        // Default to JPEG if unknown
        return MediaType.IMAGE_JPEG;
    }
    

    // Handles PUT requests to /api/books/{id}
    // Updates an existing book by its ID with the data provided in the request body
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @Valid @RequestBody Book book) {
        try {
            Book updatedBook = bookService.updateBook(id, book);
            return ResponseEntity.ok(updatedBook);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Handles DELETE requests to /api/books/{id}
    // Deletes a book by its ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        if (bookService.getBookById(id).isPresent()) {
            bookService.deleteBook(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // Handles GET requests to /api/books/type/{type}
    // Returns a list of books filtered by their type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Book>> getBooksByType(@PathVariable BookType type) {
        List<Book> books = bookService.getBooksByType(type);
        return ResponseEntity.ok(books);
    }
    
    // Handles GET requests to /api/books/search?query=...
    // Returns a list of books that match the search query
    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchBooks(@RequestParam String query) {
        List<Book> books = bookService.searchBooks(query);
        return ResponseEntity.ok(books);
    }
    
}
