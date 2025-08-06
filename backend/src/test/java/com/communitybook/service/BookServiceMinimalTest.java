package com.communitybook.service;

import com.communitybook.model.Book;
import com.communitybook.model.BookType;
import com.communitybook.repository.BookRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("BookService Unit Tests - Core Functions")
class BookServiceMinimalTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private BookService bookService;

    private Book testBook;

    @BeforeEach
    void setUp() {
        testBook = new Book();
        testBook.setId(1L);
        testBook.setTitle("Test Book");
        testBook.setAuthor("Test Author");
        testBook.setPrice(new BigDecimal("15.99"));
        testBook.setPhotoUrl("/api/v1/books/1/photo");
        testBook.setType(BookType.SELL);
        testBook.setDescription("A test book description");
        testBook.setOwnerName("Test Owner");
        testBook.setContactMethod("EMAIL");
        testBook.setContactInfo("test@example.com");
    }

    @Test
    @DisplayName("Should return all books when getAllBooks is called")
    void getAllBooks_ShouldReturnAllBooks() {
        // Given
        List<Book> expectedBooks = Arrays.asList(testBook);
        when(bookRepository.findAllByOrderByCreatedAtDesc()).thenReturn(expectedBooks);

        // When
        List<Book> actualBooks = bookService.getAllBooks();

        // Then
        assertThat(actualBooks).isEqualTo(expectedBooks);
        verify(bookRepository).findAllByOrderByCreatedAtDesc();
    }

    @Test
    @DisplayName("Should return book when getBookById is called with existing ID")
    void getBookById_WhenBookExists_ShouldReturnBook() {
        // Given
        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));

        // When
        Optional<Book> result = bookService.getBookById(1L);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get()).isEqualTo(testBook);
        verify(bookRepository).findById(1L);
    }

    @Test
    @DisplayName("Should save and return book when saveBook is called")
    void saveBook_ShouldSaveAndReturnBook() {
        // Given
        when(bookRepository.save(any(Book.class))).thenReturn(testBook);

        // When
        Book savedBook = bookService.saveBook(testBook);

        // Then
        assertThat(savedBook).isEqualTo(testBook);
        verify(bookRepository).save(testBook);
    }

    @Test
    @DisplayName("Should throw exception when updateBook is called with non-existing ID")
    void updateBook_WhenBookDoesNotExist_ShouldThrowException() {
        // Given
        Book updatedBookData = new Book();
        updatedBookData.setTitle("Updated Test Book");
        updatedBookData.setAuthor("Updated Author");
        updatedBookData.setPhotoUrl("/api/v1/books/test/photo");
        updatedBookData.setType(BookType.SELL);
        updatedBookData.setPrice(new BigDecimal("20.99"));
        updatedBookData.setOwnerName("Updated Owner");
        updatedBookData.setContactMethod("EMAIL");
        updatedBookData.setContactInfo("updated@example.com");
        
        when(bookRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> bookService.updateBook(999L, updatedBookData))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Book not found");

        verify(bookRepository).findById(999L);
        verify(bookRepository, never()).save(any(Book.class));
    }
}
