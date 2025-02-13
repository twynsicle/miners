import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Add TextEncoder and TextDecoder to global for JSDOM
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
