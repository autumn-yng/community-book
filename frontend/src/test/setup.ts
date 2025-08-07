import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock heic2any
vi.mock('heic2any', () => ({
  default: vi.fn(() => Promise.resolve(new Blob()))
}));

// Mock fetch globally for tests
global.fetch = vi.fn();

// Mock window.open for contact functionality
Object.defineProperty(window, 'open', {
  writable: true,
  value: vi.fn()
});

// Mock alert
global.alert = vi.fn();

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');

// Mock canvas and Web Workers to prevent heic2any errors
Object.defineProperty(global, 'Worker', {
  writable: true,
  value: class MockWorker {
    constructor() {}
    postMessage() {}
    terminate() {}
    addEventListener() {}
    removeEventListener() {}
  }
});

// Mock HTMLCanvasElement.getContext
HTMLCanvasElement.prototype.getContext = vi.fn();