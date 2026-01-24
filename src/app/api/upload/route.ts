import { NextResponse } from 'next/server';
import { auth } from '~/server/auth';
import { validateUpload, uploadToBlob } from '~/server/upload';

/**
 * Simple in-memory rate limiter for upload endpoint.
 * Limits each user to a certain number of uploads per time window.
 */
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 uploads per minute per user

const uploadRateLimiter = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const userLimit = uploadRateLimiter.get(userId);

  // Clean up expired entries periodically
  if (uploadRateLimiter.size > 1000) {
    for (const [key, value] of uploadRateLimiter.entries()) {
      if (value.resetAt < now) {
        uploadRateLimiter.delete(key);
      }
    }
  }

  if (!userLimit || userLimit.resetAt < now) {
    // New window
    uploadRateLimiter.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((userLimit.resetAt - now) / 1000) };
  }

  userLimit.count++;
  return { allowed: true };
}

/**
 * Upload endpoint for images (room types, etc.)
 * Requires authentication and admin role.
 * Rate limited to prevent abuse.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Authentication check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin role check
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Rate limiting check
    const rateLimit = checkRateLimit(session.user.id);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many uploads. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter ?? 60),
          },
        }
      );
    }

    // Get parameters
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const folder = searchParams.get('folder') ?? 'uploads';

    if (!request.body) {
      return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
    }

    // Validate upload
    const validation = validateUpload({
      filename: filename ?? '',
      contentType: request.headers.get('content-type'),
      contentLength: request.headers.get('content-length'),
    });

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Upload to Vercel Blob
    const result = await uploadToBlob(request.body, {
      filename: filename!,
      contentType: request.headers.get('content-type')!,
      folder,
    });

    return NextResponse.json(result);
  } catch (error) {
    // In production, log to monitoring service instead of console
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to upload file',
      },
      { status: 500 }
    );
  }
}
