# 🛡️ Step 19: QR Pass & Payment Security Hardening

**Date:** 2026-09-02  
**Scope:** 24h QR TTL Expiration Enforcement, 4-Digit PIN Brute-Force Lockout Defense, Zero-External-Network Local In-Memory QR Rendering, and Test Simulator Gating  
**Status:** Completed & Verified  

---

## 📋 Summary of Implemented Fixes

### 1. ⏳ QR Pass TTL Expiration & Replay Protection (`apps/web/src/lib/qrPass.ts`)
- **24-Hour Expiration Window**: Embedded signed `createdAt` and `expiresAt` timestamps. Tokens older than 24 hours are automatically rejected with `'This Secret QR Pass has expired (Valid for 24 hours).'`.
- **Production Secret Key Checking**: Validates `process.env.QR_PASS_SECRET` in production environments with defensive warnings.

---

### 2. 🔐 4-Digit Backup PIN Brute-Force Rate Limiting (`apps/web/src/app/api/qr/verify/route.ts`)
- **Dedicated PIN Lock Bucket**: Strict rate limiter restricting 4-digit PIN attempts to **max 5 attempts per 15 minutes per IP** (`pin_lock_${clientIp}`), preventing automated enumeration attacks.

---

### 3. 🖼️ Zero-External-Network Local In-Memory QR Rendering (`qrcode`)
- Replaced third-party `api.qrserver.com` requests with local in-memory Data URLs using the `qrcode` library in:
  - **[`apps/web/src/lib/qrPass.ts`](file:///c:/Hidden%20Eats/apps/web/src/lib/qrPass.ts)** (`generateLocalQRCodeDataUrl`)
  - **[`apps/web/src/lib/payment.ts`](file:///c:/Hidden%20Eats/apps/web/src/lib/payment.ts)** (`generateLocalBharatQRDataUrl`)
  - **[`apps/web/src/components/DinerSecretQRPassModal.tsx`](file:///c:/Hidden%20Eats/apps/web/src/components/DinerSecretQRPassModal.tsx)**
  - **[`apps/web/src/components/SmartUPIPaymentModal.tsx`](file:///c:/Hidden%20Eats/apps/web/src/components/SmartUPIPaymentModal.tsx)**
- Eliminates third-party log data leakage and network failure points.

---

## 🔍 Verification Results
- **TypeScript Compilation:** `npx tsc --noEmit` verified with **0 errors**.
- **Automated Test Suite:** `node scripts/run-tests.js` executed with **18/18 PASS** (including TTL expiration testing).
