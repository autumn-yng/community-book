package com.communitybook.repository;

import com.communitybook.model.Book;
import com.communitybook.model.BookType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    
    // Find books by type (SELL or GIVEAWAY)
    List<Book> findByType(BookType type);
    
    // Find books by author (case-insensitive)
    List<Book> findByAuthorContainingIgnoreCase(String author);
    
    // Find books by title (case-insensitive)
    List<Book> findByTitleContainingIgnoreCase(String title);
    
    
    // Custom query to search books by title or author
    @Query("SELECT b FROM Book b WHERE " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Book> findByTitleOrAuthorContaining(@Param("searchTerm") String searchTerm);
    
    // Find all books ordered by creation date (newest first)
    List<Book> findAllByOrderByCreatedAtDesc();
}
