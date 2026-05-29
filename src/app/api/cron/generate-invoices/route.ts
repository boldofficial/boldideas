import { NextResponse } from 'next/server';
import { generateRecurringInvoices } from '@/actions/recurringInvoices';

/**
 * POST /api/cron/generate-invoices
 *
 * Called by an external cron job service (or the internal MCP scheduler)
 * to check and generate any due recurring invoices.
 *
 * Alternatively, a simple GET with ?key=<CRON_SECRET> can be used for
 * services that only support GET requests (e.g., UptimeRobot, cron-job.org).
 */
export async function POST(req: Request) {
    try {
        // Optional: verify a shared secret to prevent unauthorized calls
        const body = await req.json().catch(() => ({}));
        const key = body.key || req.headers.get('x-cron-key');

        if (process.env.CRON_SECRET && key !== process.env.CRON_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await generateRecurringInvoices();

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            generated: result.generated?.length || 0,
            invoices: result.generated || [],
        });
    } catch (error: any) {
        console.error('[cron-generate-invoices] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/cron/generate-invoices?key=<CRON_SECRET>
 *
 * Simple GET variant for cron services that only support GET.
 */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (process.env.CRON_SECRET && key !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await generateRecurringInvoices();

    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        generated: result.generated?.length || 0,
        invoices: result.generated || [],
    });
}
