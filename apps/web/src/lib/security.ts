/**
 * Security & SQL Injection Prevention Utility
 * 
 * Provides rigorous sanitization, parameter validation, and pattern checks
 * to defend against SQL Injection (SQLi), Cross-Site Scripting (XSS),
 * and malicious payload injection across API routes and database interactions.
 */

import { z } from 'zod';

/**
 * Common SQL Injection patterns and malicious signatures
 */
const SQL_INJECTION_REGEX = /('(''|[^'])*')|(;)|(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b)|(--)|(\/\*)|(\*\/)/i;

/**
 * Detects if a string contains known SQL injection patterns
 */
export function hasSqlInjectionPattern(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  return SQL_INJECTION_REGEX.test(input);
}

/**
 * Sanitizes a generic string input by escaping/stripping dangerous SQL characters
 */
export function sanitizeSqlInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/'/g, "''") // Escape single quotes for SQL safety
    .replace(/\\/g, '\\\\') // Escape backslashes
    .replace(/[\0\x08\x09\x1a\n\r"\\\%]/g, (char) => {
      switch (char) {
        case '\0': return '\\0';
        case '\x08': return '\\b';
        case '\x09': return '\\t';
        case '\x1a': return '\\z';
        case '\n': return '\\n';
        case '\r': return '\\r';
        case '"': return '\\"';
        default: return char;
      }
    })
    .trim();
}

/**
 * Alias for general input sanitization
 */
export const sanitizeInput = sanitizeSqlInput;

/**
 * Sanitizes search queries for text-based filters, removing control characters and SQL operators
 */
export function sanitizeSearchQuery(query: string, maxLength = 100): string {
  if (!query || typeof query !== 'string') return '';
  return query
    .slice(0, maxLength)
    .replace(/[;'"\\]/g, '') // Remove quotes and semicolons completely
    .replace(/--/g, '') // Remove SQL comment indicators
    .replace(/\/\*|\*\//g, '') // Remove multi-line comments
    .trim();
}

/**
 * Validates whether an ID is a valid alphanumeric identifier (e.g., 'res-1', 'BK_101', UUID)
 */
export function isValidIdentifier(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  // Accepts standard alphanumeric IDs with dashes and underscores (preventing injection into query params)
  const idRegex = /^[a-zA-Z0-9_-]{1,64}$/;
  return idRegex.test(id);
}

/**
 * Strict Zod Validation Schemas for API Payloads
 */
export const SecuritySchemas = {
  // Booking API Validation
  bookingAction: z.object({
    bookingId: z.string().min(1).max(64).refine(isValidIdentifier, { message: 'Invalid booking ID format' }),
    action: z.enum(['APPROVE', 'REJECT']),
  }),

  // Driver Handover OTP Validation
  driverHandover: z.object({
    orderId: z.string().min(1).max(64).refine(isValidIdentifier, { message: 'Invalid order ID format' }),
    inputOtp: z.string().regex(/^\d{4,6}$/, 'OTP must be 4 to 6 numeric digits'),
  }),

  // Menu Dish Status Validation
  menuStatus: z.object({
    dishId: z.string().min(1).max(64).refine(isValidIdentifier, { message: 'Invalid dish ID format' }),
    isStock: z.boolean(),
  }),

  // Places Search Validation
  placesQuery: z.object({
    action: z.enum(['search', 'place-details']),
    placeId: z.string().max(128).optional(),
    query: z.string().max(200).optional().transform((val) => (val ? sanitizeSearchQuery(val) : '')),
    lat: z.number().min(-90).max(90).optional().default(12.9716),
    lng: z.number().min(-180).max(180).optional().default(77.5946),
    radius: z.number().min(100).max(50000).optional().default(5000),
  }),

  // Settlement Request Validation
  settlement: z.object({
    totalAmount: z.number().positive().max(1000000),
    payeeVPA: z.string().max(100).regex(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/, 'Invalid UPI VPA format').optional(),
    payeeName: z.string().max(100).optional().transform((val) => (val ? sanitizeSearchQuery(val) : '')),
  }),

  // Profile Update Validation
  profileUpdate: z.object({
    fullName: z.string().min(1).max(100).transform((val) => sanitizeSearchQuery(val)),
    username: z.string().min(2).max(50).regex(/^[a-zA-Z0-9_]+$/, 'Username must be alphanumeric with underscores'),
    email: z.string().email().max(150),
    avatarUrl: z.string().url().nullable().optional(),
    bitmojiConfig: z.record(z.string(), z.any()).nullable().optional(),
    preferredLanguage: z.enum(['en', 'ta', 'hi', 'es', 'fr', 'ar', 'ja']).optional(),
  }),

  // YouTube Video Scraper Validation
  videoScraper: z.object({
    videoUrl: z.string().url().max(500).refine((url) => {
      return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|instagram\.com)\/.+$/i.test(url);
    }, { message: 'URL must be a valid YouTube or Instagram link' }),
  }),
};
