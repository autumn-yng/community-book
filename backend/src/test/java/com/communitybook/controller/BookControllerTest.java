package com.communitybook.controller;

import com.communitybook.model.Book;
import com.communitybook.model.BookType;
import com.communitybook.service.BookService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BookController.class)
@DisplayName("BookController Unit Tests")
class BookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BookService bookService;

    @Autowired
    private ObjectMapper objectMapper;

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
    @DisplayName("GET /api/v1/books - Should return all books")
    void getAllBooks_ShouldReturnAllBooks() throws Exception {
        // Given
        List<Book> books = Arrays.asList(testBook);
        when(bookService.getAllBooks()).thenReturn(books);

        // When & Then
        mockMvc.perform(get("/api/v1/books"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Test Book")))
                .andExpect(jsonPath("$[0].author", is("Test Author")))
                .andExpect(jsonPath("$[0].price", is(15.99)));
    }

    @Test
    @DisplayName("GET /api/v1/books/{id} - Should return book when exists")
    void getBookById_WhenBookExists_ShouldReturnBook() throws Exception {
        // Given
        when(bookService.getBookById(1L)).thenReturn(Optional.of(testBook));

        // When & Then
        mockMvc.perform(get("/api/v1/books/{id}", 1L))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.title", is("Test Book")))
                .andExpect(jsonPath("$.author", is("Test Author")))
                .andExpect(jsonPath("$.id", is(1)));
    }

    @Test
    @DisplayName("GET /api/v1/books/{id} - Should return 404 when book not found")
    void getBookById_WhenBookNotFound_ShouldReturn404() throws Exception {
        // Given
        when(bookService.getBookById(999L)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/v1/books/{id}", 999L))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/v1/books/upload - Should create book successfully")
    void createBookWithPhoto_ShouldCreateBook() throws Exception {
        // Given
        when(bookService.saveBook(any(Book.class))).thenReturn(testBook);

        MockMultipartFile photo = new MockMultipartFile(
                "photo", 
                "test-image.jpg", 
                "image/jpeg", 
                "test image content".getBytes()
        );

        String bookJson = objectMapper.writeValueAsString(testBook);
        MockMultipartFile bookPart = new MockMultipartFile(
                "book", 
                "", 
                "application/json", 
                bookJson.getBytes()
        );

        // When & Then
        mockMvc.perform(multipart("/api/v1/books/upload")
                        .file(bookPart)
                        .file(photo))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.title", is("Test Book")))
                .andExpect(jsonPath("$.author", is("Test Author")));
    }

    @Test
    @DisplayName("GET /api/v1/books/type/{type} - Should return books by type")
    void getBooksByType_ShouldReturnFilteredBooks() throws Exception {
        // Given
        List<Book> sellBooks = Arrays.asList(testBook);
        when(bookService.getBooksByType(BookType.SELL)).thenReturn(sellBooks);

        // When & Then
        mockMvc.perform(get("/api/v1/books/type/{type}", "SELL"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].type", is("SELL")));
    }

    @Test
    @DisplayName("GET /api/v1/books/search - Should return matching books")
    void searchBooks_ShouldReturnMatchingBooks() throws Exception {
        // Given
        List<Book> searchResults = Arrays.asList(testBook);
        when(bookService.searchBooks("Test")).thenReturn(searchResults);

        // When & Then
        mockMvc.perform(get("/api/v1/books/search")
                        .param("query", "Test"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", containsString("Test")));
    }

    @Test
    @DisplayName("PUT /api/v1/books/{id} - Should update book successfully")
    void updateBook_ShouldUpdateBookSuccessfully() throws Exception {
        // Given
        Book updatedBook = new Book();
        updatedBook.setTitle("Updated Title");
        updatedBook.setAuthor("Updated Author");
        updatedBook.setPrice(new BigDecimal("25.99"));
        updatedBook.setPhotoUrl("/api/v1/books/1/photo");
        updatedBook.setType(BookType.GIVEAWAY);
        updatedBook.setDescription("Updated description");
        updatedBook.setOwnerName("Updated Owner");
        updatedBook.setContactMethod("PHONE");
        updatedBook.setContactInfo("123-456-7890");

        when(bookService.updateBook(eq(1L), any(Book.class))).thenReturn(updatedBook);

        // When & Then
        mockMvc.perform(put("/api/v1/books/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedBook)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.title", is("Updated Title")))
                .andExpect(jsonPath("$.author", is("Updated Author")));
    }

    @Test
    @DisplayName("DELETE /api/v1/books/{id} - Should delete book when exists")
    void deleteBook_WhenBookExists_ShouldDeleteSuccessfully() throws Exception {
        // Given
        when(bookService.getBookById(1L)).thenReturn(Optional.of(testBook));

        // When & Then
        mockMvc.perform(delete("/api/v1/books/{id}", 1L))
                .andDo(print())
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("DELETE /api/v1/books/{id} - Should return 404 when book not found")
    void deleteBook_WhenBookNotFound_ShouldReturn404() throws Exception {
        // Given
        when(bookService.getBookById(999L)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(delete("/api/v1/books/{id}", 999L))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/v1/books/{id}/photo - Should return photo when exists")
    void getBookPhoto_WhenPhotoExists_ShouldReturnPhoto() throws Exception {
        // Given
        testBook.setPhotoData("test image data".getBytes());
        when(bookService.getBookById(1L)).thenReturn(Optional.of(testBook));

        // When & Then
        mockMvc.perform(get("/api/v1/books/{id}/photo", 1L))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.IMAGE_JPEG));
    }

    @Test
    @DisplayName("GET /api/v1/books/{id}/photo - Should return 404 when photo not found")
    void getBookPhoto_WhenPhotoNotFound_ShouldReturn404() throws Exception {
        // Given
        testBook.setPhotoData(null); // No photo data
        when(bookService.getBookById(1L)).thenReturn(Optional.of(testBook));

        // When & Then
        mockMvc.perform(get("/api/v1/books/{id}/photo", 1L))
                .andDo(print())
                .andExpect(status().isNotFound());
    }
}
