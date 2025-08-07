# Frontend Testing Guide

This document explains the testing setup for the Community Book Exchange frontend.

## Test Setup

The frontend uses **Vitest** with **React Testing Library** for unit and integration testing.

### Test Configuration

- **Test runner**: Vitest with jsdom environment
- **Testing utilities**: React Testing Library, Jest DOM matchers
- **Configuration**: `vitest.config.ts` and `src/test/setup.ts`

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

### Unit Tests

Located in `src/test/` directory:

- `HomePage.test.tsx` - Tests the main page with book listing and API integration
- `AddBookModal.test.tsx` - Tests the book addition form modal
- `App.test.tsx` - Basic app rendering test

### What's Tested

**Core Functionality:**
- ✅ Book listing display
- ✅ Loading states
- ✅ API error handling 
- ✅ Modal opening/closing
- ✅ Book form validation
- ✅ User interactions (clicking books, buttons)

**Critical User Journeys:**
- ✅ View all books
- ✅ View individual book details
- ✅ Add new books

## Test Coverage

The tests focus on regression prevention for the core features:
- Display all books
- Show specific book details
- Add new books

These minimal tests catch the most important functionality without over-testing a personal project.
- ✅ Modal opens from FAB button
- ✅ Form validation (photo required)
- ✅ Successful book submission
- ✅ Error handling for API failures
- ✅ Form closes after successful submission

**User Interactions:**
- ✅ Navigation between modals
- ✅ Modal backdrop clicking
- ✅ Button interactions
- ✅ Form field changes

## Test Configuration

### Vitest Setup
- Global test functions (describe, test, expect)
- jsdom environment for DOM testing
- React Testing Library integration
- Mock fetch, window.open, navigator.clipboard

### Playwright Setup
- Chromium browser testing
- Local dev server integration
- API mocking to prevent backend dependencies
- Image loading mocks

## Running Tests

### Prerequisites
Make sure your dependencies are installed:
```bash
npm install
```

### Development Workflow
1. **Unit tests while developing:**
   ```bash
   npm run test
   ```

2. **E2E tests for integration verification:**
   ```bash
   npm run test:e2e
   ```

3. **Full test suite:**
   ```bash
   npm run test && npm run test:e2e
   ```

## Test Philosophy

These tests focus on:
- **Critical user paths**: Display books, view details, add books
- **Error scenarios**: API failures, validation errors
- **User interactions**: Clicking, form submission, modal behavior
- **Regression prevention**: Ensures core features don't break

The test suite is kept minimal but comprehensive, covering the most important functionality without over-testing internal implementation details.
