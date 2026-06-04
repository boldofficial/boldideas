import { NextRequest, NextResponse } from 'next/server';
import { syncZohoInboxForSystem } from '@/actions/email';

export async function GET(request: NextRequest) {
    const configuredSecret = process.env.EMAIL_SYNC_SECRET;
    const providedSecret = request.headers.get('x-email-sync-secret') || request.nextUrl.searchParams.get('secret');

    if (!configuredSecret || providedSecret !== configuredSecret) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const limitParam = Number(request.nextUrl.searchParams.get('limit') || 40);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 40;
    const result = await syncZohoInboxForSystem(limit);

    return NextResponse.json(result, { status: result.success ? 200 : 500 });
}
