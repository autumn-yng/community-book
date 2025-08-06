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
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("BookService Unit Tests")
class BookServiceTest {

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
        when(bookRepository.findAll()).thenReturn(expectedBooks);

        // When
        List<Book> actualBooks = bookService.getAllBooks();

        // Then
        assertThat(actualBooks).isEqualTo(expectedBooks);
        verify(bookRepository).findAll();
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
    @DisplayName("Should return empty when getBookById is called with non-existing ID")
    void getBookById_WhenBookDoesNotExist_ShouldReturnEmpty() {
        // Given
        when(bookRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        Optional<Book> result = bookService.getBookById(999L);

        // Then
        assertThat(result).isEmpty();
        verify(bookRepository).findById(999L);
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
    @DisplayName("Should delete book when deleteBook is called")
    void deleteBook_ShouldDeleteBook() {
        // When
        bookService.deleteBook(1L);

        // Then
        verify(bookRepository).deleteById(1L);
    }

    @Test
    @DisplayName("Should return books by type when getBooksByType is called")
    void getBooksByType_ShouldReturnFilteredBooks() {
        // Given
        List<Book> expectedBooks = Arrays.asList(testBook);
        when(bookRepository.findByType(BookType.SELL)).thenReturn(expectedBooks);

        // When
        List<Book> actualBooks = bookService.getBooksByType(BookType.SELL);

        // Then
        assertThat(actualBooks).isEqualTo(expectedBooks);
        verify(bookRepository).findByType(BookType.SELL);
    }

    @Test
    @DisplayName("Should update existing book when updateBook is called")
    void updateBook_WhenBookExists_ShouldUpdateAndReturnBook() {
        // Given
        Book updatedBookData = new Book();
        updatedBookData.setTitle("Updated Title");
        updatedBookData.setAuthor("Updated Author");
        updatedBookData.setPrice(new BigDecimal("25.99"));
        updatedBookData.setPhotoUrl("/api/v1/books/1/photo");
        updatedBookData.setType(BookType.GIVEAWAY);
        updatedBookData.setDescription("Updated description");
        updatedBookData.setOwnerName("Updated Owner");
        updatedBookData.setContactMethod("PHONE");
        updatedBookData.setContactInfo("123-456-7890");

        when(bookRepository.findById(1L)).thenReturn(Optional.of(testBook));
        when(bookRepository.save(any(Book.class))).thenReturn(testBook);

        // When
        Book result = bookService.updateBook(1L, updatedBookData);

        // Then
        assertThat(result).isNotNull();
        verify(bookRepository).findById(1L);
        verify(bookRepository).save(any(Book.class));
    }

    @Test
    @DisplayName("Should throw exception when updateBook is called with non-existing ID")
    void updateBook_WhenBookDoesNotExist_ShouldThrowException() {
        // Given
        Book updatedBookData = new Book();
        when(bookRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> bookService.updateBook(999L, updatedBookData))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Book not found");

        verify(bookRepository).findById(999L);
        verify(bookRepository, never()).save(any(Book.class));
    }

    @Test
    @DisplayName("Should return books matching search query")
    void searchBooks_ShouldReturnMatchingBooks() {
        // Given
        String searchQuery = "Java";
        List<Book> expectedBooks = Arrays.asList(testBook);
        when(bookRepository.findByTitleOrAuthorContaining(searchQuery))
                .thenReturn(expectedBooks);

        // When
        List<Book> actualBooks = bookService.searchBooks(searchQuery);

        // Then
        assertThat(actualBooks).isEqualTo(expectedBooks);
        verify(bookRepository).findByTitleOrAuthorContaining(searchQuery);
    }

    @Test
    @DisplayName("Should return empty list when no books match search query")
    void searchBooks_WhenNoMatch_ShouldReturnEmptyList() {
        // Given
        String searchQuery = "NonExistentBook";
        when(bookRepository.findByTitleOrAuthorContaining(searchQuery))
                .thenReturn(Arrays.asList());

        // When
        List<Book> actualBooks = bookService.searchBooks(searchQuery);

        // Then
        assertThat(actualBooks).isEmpty();
        verify(bookRepository).findByTitleOrAuthorContaining(searchQuery);
    }
}
