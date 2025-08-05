package com.communitybook.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "books")
public class Book {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Title is required")
    @Size(max = 255)
    private String title;
    
    @NotBlank(message = "Author is required")
    @Size(max = 255)
    private String author;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal price;
    
    @NotBlank(message = "Photo is required")
    @Size(max = 500)
    private String photoUrl;
    
    @Column(name = "photo_data")
    private byte[] photoData;
    
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Type is required")
    private BookType type;
    
    @Size(max = 1000)
    private String description;
    
    @NotBlank(message = "Owner name is required")
    @Size(max = 255)
    private String ownerName;
    
    @NotBlank(message = "Contact method is required")
    @Size(max = 10)
    private String contactMethod; // "email" or "phone"
    
    @NotBlank(message = "Contact information is required")
    @Size(max = 255)
    private String contactInfo;
    
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Constructors
    public Book() {}
    
    public Book(String title, String author, BigDecimal price, String photoUrl,
               byte[] photoData, BookType type, String description, String ownerName, 
               String contactMethod, String contactInfo) {
        this.title = title;
        this.author = author;
        this.price = price;
        this.photoUrl = photoUrl;
        this.photoData = photoData;
        this.type = type;
        this.description = description;
        this.ownerName = ownerName;
        this.contactMethod = contactMethod;
        this.contactInfo = contactInfo;
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    
    public byte[] getPhotoData() { return photoData; }
    public void setPhotoData(byte[] photoData) { this.photoData = photoData; }
    
    public BookType getType() { return type; }
    public void setType(BookType type) { this.type = type; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
    
    public String getContactMethod() { return contactMethod; }
    public void setContactMethod(String contactMethod) { this.contactMethod = contactMethod; }
    
    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
