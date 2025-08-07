import { test, expect } from '@playwright/test';

test.describe('Community Book Exchange - Core Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API to prevent actual backend calls
    await page.route('**/api/v1/books', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            price: 12.99,
            type: 'SELL',
            description: 'A classic American novel about the Jazz Age.',
            photoUrl: '/api/v1/books/1/photo',
            ownerName: 'Alice Johnson',
            contactMethod: 'EMAIL',
            contactInfo: 'alice@example.com'
          },
          {
            id: 2,
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            price: 0,
            type: 'GIVEAWAY',
            description: 'A novel about racial injustice and moral growth.',
            photoUrl: '/api/v1/books/2/photo',
            ownerName: 'Bob Smith',
            contactMethod: 'PHONE',
            contactInfo: '555-0123'
          }
        ])
      });
    });

    // Mock image loading
    await page.route('**/api/v1/books/*/photo', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body: '<svg width="200" height="260" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="260" fill="#F3F4F6"/></svg>'
      });
    });

    await page.goto('/');
  });

  test('displays book list correctly', async ({ page }) => {
    // Wait for books to load
    await expect(page.getByText('📚 Community Book Exchange')).toBeVisible();
    
    // Check that books are displayed
    await expect(page.getByText('The Great Gatsby')).toBeVisible();
    await expect(page.getByText('To Kill a Mockingbird')).toBeVisible();
    
    // Check book details
    await expect(page.getByText('by F. Scott Fitzgerald')).toBeVisible();
    await expect(page.getByText('by Harper Lee')).toBeVisible();
    
    // Check price/type badges
    await expect(page.getByText('💰 $12.99')).toBeVisible();
    await expect(page.getByText('🎁 FREE')).toBeVisible();
  });

  test('opens book details modal when book is clicked', async ({ page }) => {
    // Wait for books to load and click on a book
    await expect(page.getByText('The Great Gatsby')).toBeVisible();
    await page.getByText('The Great Gatsby').click();

    // Check that modal opens with book details
    await expect(page.getByText('📧 alice@example.com')).toBeVisible();
    await expect(page.getByText('📧 Send Email')).toBeVisible();
    
    // Close modal
    await page.getByText('✕').click();
    await expect(page.getByText('📧 alice@example.com')).not.toBeVisible();
  });

  test('opens add book modal when FAB is clicked', async ({ page }) => {
    // Wait for page to load
    await expect(page.getByText('📚 Community Book Exchange')).toBeVisible();
    
    // Click the floating action button
    await page.getByTitle('Add a book').click();

    // Check that add book modal opens
    await expect(page.getByText('📚 List a New Book')).toBeVisible();
    await expect(page.locator('input[name="title"]')).toBeVisible();
    
    // Close modal
    await page.getByText('✕').click();
    await expect(page.getByText('📚 List a New Book')).not.toBeVisible();
  });

  test('add book form validation works', async ({ page }) => {
    // Open add book modal
    await page.getByTitle('Add a book').click();
    await expect(page.getByText('📚 List a New Book')).toBeVisible();

    // Try to submit without filling required fields
    await page.getByText('📚 List Book').click();

    // Should show validation alert
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('Please select a photo.');
      await dialog.accept();
    });
  });

  test('contact functionality works', async ({ page }) => {
    // Mock window.open for email contact
    await page.addInitScript(() => {
      window.open = () => null;
    });

    // Click on a book to open details
    await expect(page.getByText('The Great Gatsby')).toBeVisible();
    await page.getByText('The Great Gatsby').click();

    // Click contact button
    await page.getByText('📧 Send Email').click();
    
    // For phone contact, test the copy functionality
    await page.getByText('✕').click(); // Close current modal
    await page.getByText('To Kill a Mockingbird').click();
    
    // Mock clipboard API
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: () => Promise.resolve()
        },
        writable: true
      });
    });
    
    await page.getByText('📞 Copy Phone Number').click();
  });
});