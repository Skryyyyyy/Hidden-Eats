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
    placeId: z.string().max(128).regex(/^[a-zA-Z0-9_\-.:]+$/, 'Invalid place ID format').optional(),
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

/**
 * Validates Origin & Referer headers against trusted application domains
 * Defends against Cross-Site Request Forgery (CSRF) on state-changing API mutations
 */
export function verifyTrustedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');

  // Same-origin browser requests or non-browser server requests with no origin/referer
  if (!origin && !referer) {
    return true;
  }

  const target = origin || referer || '';

  // Allow local development ports
  if (target.includes('localhost:') || target.includes('127.0.0.1:')) {
    return true;
  }

  // Check matching Host header
  if (host && target.includes(host)) {
    return true;
  }

  // Check configured production app URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl && target.startsWith(appUrl)) {
    return true;
  }

  return false;
}

const STAFF_BYPASS_SECRET = process.env.STAFF_BYPASS_SECRET || 'he_secure_bypass_2026';
const STAFF_BYPASS_MAX_AGE_MS = 2 * 60 * 60 * 1000; // 2 Hours

/**
 * Generates an HMAC-SHA256 signed staff bypass token
 */
export function generateStaffBypassToken(): string {
  const timestamp = Date.now();
  const raw = `staff_bypass:${timestamp}`;
  const crypto = require('crypto');
  const signature = crypto.createHmac('sha256', STAFF_BYPASS_SECRET).update(raw).digest('hex');
  return `${timestamp}.${signature}`;
}

/**
 * Cryptographically verifies an HMAC-SHA256 signed staff bypass token and checks TTL
 */
export function verifyStaffBypassToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Check 2-hour TTL expiration
  if (Date.now() - timestamp > STAFF_BYPASS_MAX_AGE_MS || timestamp > Date.now() + 60000) {
    return false;
  }

  const raw = `staff_bypass:${timestamp}`;
  const crypto = require('crypto');
  const expectedSig = crypto.createHmac('sha256', STAFF_BYPASS_SECRET).update(raw).digest('hex');

  const sigBuf = Buffer.from(signature, 'utf8');
  const expBuf = Buffer.from(expectedSig, 'utf8');

  if (sigBuf.length !== expBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expBuf);
}


