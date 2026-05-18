// middleware.js
// ─────────────────────────────────────────────────────────────────────────────
// Vercel Edge Middleware — runs at the CDN edge BEFORE any file is served.
// Works with Create React App on Vercel (no Next.js needed).
//
// HOW TO CONTROL ACCESS:
//   • Go to Vercel dashboard → your project → Settings → Environment Variables
//   • Set:  ALLOWED_ADMIN_IPS = 102.22.45.10,41.186.0.5
//   • Comma-separate multiple IPs (your laptop, a colleague's laptop, etc.)
//   • Save → Redeploy → done. No code changes ever needed.
//
// HOW TO FIND YOUR IP:
//   • Google "what is my IP" from the laptop you want to allow
// ─────────────────────────────────────────────────────────────────────────────

export const config = {
  matcher: '/(.*)', // intercept every single request — assets, HTML, everything
};

export default function middleware(req) {
  const raw = process.env.ALLOWED_ADMIN_IPS || '';

  const allowedIPs = raw
    .split(',')
    .map((ip) => ip.trim())
    .filter(Boolean);

  // Safety: if the env var is missing or empty, block everyone.
  // This prevents accidental open access if env var is deleted.
  if (allowedIPs.length === 0) {
    return new Response('Forbidden', { status: 403 });
  }

  // Vercel always populates x-forwarded-for with the real client IP
  const clientIP =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    '';

  if (allowedIPs.includes(clientIP)) {
    // ✅ Allowed — serve normally
    return; // returning undefined tells Vercel to continue to the static file
  }

  // ❌ Not allowed — return a bare 403, no HTML, no hint the panel exists
  return new Response('Forbidden', { status: 403 });
}
