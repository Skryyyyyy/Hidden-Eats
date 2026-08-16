import { z } from 'zod';

/**
 * XSS Sanitization helper for string input
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * User Login Input Schema
 */
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

/**
 * Order Creation Schema
 */
export const CreateOrderSchema = z.object({
  restaurantId: z.string().min(1, 'Restaurant ID is required'),
  items: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
    })
  ).min(1, 'Order must contain at least 1 item'),
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
  paymentMethod: z.enum(['card', 'upi', 'cod']),
});

/**
 * Review Submission Schema
 */
export const SubmitReviewSchema = z.object({
  restaurantId: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().max(1000).transform(sanitizeInput),
});

/**
 * Partner Menu Item Schema
 */
export const MenuItemSchema = z.object({
  name: z.string().min(2).max(100).transform(sanitizeInput),
  description: z.string().max(500).transform(sanitizeInput),
  price: z.number().positive(),
  category: z.string().min(1),
  isVeg: z.boolean(),
  isSecretItem: z.boolean().optional(),
});

/**
 * Timing-safe Cryptographic HMAC-SHA256 Webhook Signature Verification
 */
export async function verifyWebhookSignature(
  rawPayload: string,
  signature: string,
  secretKey: string
): Promise<boolean> {
  try {
    const cryptoModule = await import('crypto');
    const expected = cryptoModule
      .createHmac('sha256', secretKey)
      .update(rawPayload)
      .digest('hex');
    
    return cryptoModule.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expected, 'hex')
    );
  } catch {
    return false;
  }
}
