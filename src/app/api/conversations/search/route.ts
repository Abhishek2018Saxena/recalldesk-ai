import { NextResponse } from 'next/server';
import { getConversationStore, searchConversations } from '@/lib/conversation-store';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const query = typeof payload?.query === 'string' ? payload.query : '';
    const results = searchConversations(getConversationStore(), query);

    return NextResponse.json({
      results,
      total: results.length,
      query,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown search error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
