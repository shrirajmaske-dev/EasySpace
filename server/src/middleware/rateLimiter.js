import rateLimit from 'express-rate-limit';

// Rate limiter for AI generation endpoints (Gemini): 10 requests per 15 minutes per IP
export const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Gracious development allowance while enforcing quota safety
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too Many AI Requests',
    message: 'You have exceeded the rate limit of AI generation requests. Please wait a few minutes before trying again.'
  }
});

// General API rate limiter
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too Many Requests',
    message: 'Rate limit exceeded. Please try again later.'
  }
});
