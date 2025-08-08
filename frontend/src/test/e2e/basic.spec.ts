import { test, expect } from '@playwright/test';

test.describe('Community Book Exchange - Core Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept real HTTP requests and return fake data
    // Playwright has built-in wait so we don't need waitFor() like in other tests that use React Testing Library
    await page.route('**/api/v1/books', async interceptedRequest => {
      // Tell Playwright to response to this intercepted request not by going to the backend to get the data but by the taking the mock data provided in the bracket
      await interceptedRequest.fulfill({
        status: 200, // HTTP 200 = OK
        contentType: 'application/json', // Let the browser know it's JSON
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

    // Intercept requests for book photo URLs and return a placeholder SVG image
    await page.route('**/api/v1/books/*/photo', async interceptedImageRequest => {
      await interceptedImageRequest.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body: '<svg width="200" height="260" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="260" fill="#F3F4F6"/></svg>'
      });
    });

    // After mocks for backend data are set up, go to a real browser and open a real page object with real network requests, layout, rendering, and browser APIs
    await page.goto('/');
  });

  test('displays book list correctly', async ({ page }) => {
    // Wait until the heading is visible (ensures data is loaded)
    await expect(page.getByText('📚 Community Book Exchange')).toBeVisible();

    // Verify both mocked books are displayed
    await expect(page.getByText('The Great Gatsby')).toBeVisible();
    await expect(page.getByText('To Kill a Mockingbird')).toBeVisible();

    // Verify authors
    await expect(page.getByText('by F. Scott Fitzgerald')).toBeVisible();
    await expect(page.getByText('by Harper Lee')).toBeVisible();

    // Verify price/type labels
    await expect(page.getByText('💰 $12.99')).toBeVisible();
    await expect(page.getByText('🎁 FREE')).toBeVisible();
  });

  test('opens book details modal when book is clicked', async ({ page }) => {
    await expect(page.getByText('The Great Gatsby')).toBeVisible();
    await page.getByText('The Great Gatsby').click();

    // Verify modal shows contact details
    await expect(page.getByText('📧 alice@example.com')).toBeVisible();
    await expect(page.getByText('📧 Send Email')).toBeVisible();

    // Close modal
    await page.getByText('✕').click();
    await expect(page.getByText('📧 alice@example.com')).not.toBeVisible();
  });

  test('opens add book modal when FAB is clicked', async ({ page }) => {
    await expect(page.getByText('📚 Community Book Exchange')).toBeVisible();
    await page.getByTitle('Add a book').click();

    // Verify add book modal UI elements
    await expect(page.getByText('📚 List a New Book')).toBeVisible();
    await expect(page.locator('input[name="title"]')).toBeVisible();

    // Close modal
    await page.getByText('✕').click();
    await expect(page.getByText('📚 List a New Book')).not.toBeVisible();
  });

  test('add book form validation works', async ({ page }) => {
    await page.getByTitle('Add a book').click();
    await expect(page.getByText('📚 List a New Book')).toBeVisible();

    // Try submitting without filling required fields
    await page.getByText('📚 List Book').click();

    // Listen for browser alert dialog
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('Please select a photo.');
      await dialog.accept();
    });
  });

  test('contact functionality works', async ({ page }) => {
    // Prevent actual browser "open new tab" when testing email
    await page.addInitScript(() => {
      window.open = () => null;
    });

    // Test email contact
    await expect(page.getByText('The Great Gatsby')).toBeVisible();
    await page.getByText('The Great Gatsby').click();
    await page.getByText('📧 Send Email').click();

    // Test phone contact copy-to-clipboard
    await page.getByText('✕').click(); // Close email modal
    await page.getByText('To Kill a Mockingbird').click();

    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: () => Promise.resolve() },
        writable: true
      });
    });

    await page.getByText('📞 Copy Phone Number').click();
  });
});
