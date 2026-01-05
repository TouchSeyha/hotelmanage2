import { NextResponse } from 'next/server';
import { auth } from '~/server/auth';
import { validateUpload, uploadToBlob } from '~/server/upload';

/**
 * Upload endpoint for images (room types, etc.)
 * Requires authentication and admin role
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
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to upload file',
      },
      { status: 500 }
    );
  }
}
