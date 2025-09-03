package com.communitybook.integration;

import com.communitybook.model.Book;
import com.communitybook.model.BookType;
import com.communitybook.repository.BookRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test") // Use test profile with H2 database
@Transactional // Runs each test method inside a transaction. After the test method finishes, the transaction is automatically rolled back. This means any data (like testBook) added during the test is not persisted beyond the test.
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@DisplayName("Book API Integration Tests - Core MVP Features")
class BookApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Book testBook;

    @BeforeEach
    void setUp() {
        bookRepository.deleteAll();
        
        testBook = new Book();
        testBook.setTitle("Test Book");
        testBook.setAuthor("Test Author");
        testBook.setPrice(new BigDecimal("15.99"));
        testBook.setPhotoUrl("/v1/books/test/photo");
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
        bookRepository.save(testBook);

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
    @DisplayName("GET /api/v1/books/{id} - Should return book by ID")
    void getBookById_WhenBookExists_ShouldReturnBook() throws Exception {
        // Given
        Book savedBook = bookRepository.save(testBook);

        // When & Then
        mockMvc.perform(get("/api/v1/books/{id}", savedBook.getId()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.title", is("Test Book")))
                .andExpect(jsonPath("$.id", is(savedBook.getId().intValue())));
    }

    @Test
    @DisplayName("GET /api/v1/books/{id} - Should return 404 when book not found")
    void getBookById_WhenBookDoesNotExist_ShouldReturn404() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/v1/books/{id}", 999L))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/v1/books/upload - Should create book with photo")
    void createBookWithPhoto_ShouldCreateBookSuccessfully() throws Exception {
        // Given
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
                .andExpect(jsonPath("$.photoUrl", containsString("/photo")));
    }

    @Test
    @DisplayName("GET /api/v1/books/{id}/photo - Should return book photo")
    void getBookPhoto_WhenPhotoExists_ShouldReturnPhoto() throws Exception {
        // Given
        testBook.setPhotoData("test image data".getBytes());
        Book savedBook = bookRepository.save(testBook);

        // When & Then
        mockMvc.perform(get("/api/v1/books/{id}/photo", savedBook.getId()))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.IMAGE_JPEG));
    }

    @Test
    @DisplayName("POST /api/v1/books/upload - Should validate required fields")
    void createBook_WithInvalidData_ShouldReturnBadRequest() throws Exception {
        // Given - Book with missing required fields
        Book invalidBook = new Book();
        invalidBook.setDescription("Only description provided");

        String bookJson = objectMapper.writeValueAsString(invalidBook);
        MockMultipartFile bookPart = new MockMultipartFile(
                "book", 
                "", 
                "application/json", 
                bookJson.getBytes()
        );

        MockMultipartFile photo = new MockMultipartFile(
                "photo", 
                "test.jpg", 
                "image/jpeg", 
                "test".getBytes()
        );

        // When & Then
        mockMvc.perform(multipart("/api/v1/books/upload")
                        .file(bookPart)
                        .file(photo))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }
}
