import { NextResponse } from 'next/server';
import {
  baseConversationRecords,
  createConversationId,
  getConversationStore,
  replaceConversationStore,
  type ConversationRecord,
} from '@/lib/conversation-store';

export async function GET() {
  const records = getConversationStore();
  return NextResponse.json(records);
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const customerName = typeof payload?.customerName === 'string' && payload.customerName.trim() ? payload.customerName.trim() : 'New Customer';
    const customerId = typeof payload?.customerId === 'string' && payload.customerId.trim() ? payload.customerId.trim() : 'C-9999';
    const title = typeof payload?.title === 'string' && payload.title.trim() ? payload.title.trim() : `${customerName} follow-up`;
    const summary = typeof payload?.summary === 'string' && payload.summary.trim() ? payload.summary.trim() : 'New conversation started.';

    const created: ConversationRecord = {
      id: typeof payload?.id === 'string' && payload.id ? payload.id : createConversationId(),
      customerId,
      customerName,
      title,
      status: 'Open',
      sentiment: 'Neutral',
      lastUpdated: new Date().toISOString(),
      summary,
      memoryUsed: Boolean(payload?.memoryUsed),
      knowledgeUsed: Boolean(payload?.knowledgeUsed),
      messages: Array.isArray(payload?.messages) && payload.messages.length > 0 ? payload.messages : [
        {
          id: `MSG-${Date.now()}`,
          type: 'customer',
          author: customerName,
          text: typeof payload?.initialMessage === 'string' && payload.initialMessage.trim() ? payload.initialMessage.trim() : 'I need help with this case.',
          createdAt: new Date().toISOString(),
        },
      ],
    };

    const store = [...getConversationStore()];
    const index = store.findIndex((conversation) => conversation.id === created.id);
    if (index >= 0) {
      store[index] = created;
    } else {
      store.unshift(created);
    }

    replaceConversationStore(store);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown API error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const payload = await request.json();
    const conversationId = typeof payload?.id === 'string' ? payload.id : null;
    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation id is required.' }, { status: 400 });
    }

    const store = [...getConversationStore()];
    const index = store.findIndex((conversation) => conversation.id === conversationId);
    if (index < 0) {
      return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
    }

    const updated: ConversationRecord = {
      ...store[index],
      ...payload,
      lastUpdated: new Date().toISOString(),
      messages: Array.isArray(payload?.messages) ? payload.messages : store[index].messages,
    };

    store[index] = updated;
    replaceConversationStore(store);
    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown API error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}

export async function DELETE() {
  replaceConversationStore(JSON.parse(JSON.stringify(baseConversationRecords)));
  return NextResponse.json({ ok: true });
}
