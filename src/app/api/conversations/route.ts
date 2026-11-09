import { NextResponse } from 'next/server';
import {
  baseConversationRecords,
  createConversationId,
  getConversationStore,
  replaceConversationStore,
  type ConversationRecord,
} from '@/lib/conversation-store';
import { createSupabaseServerClient } from '@/lib/supabase/server';

type SupabaseMessage = {
  id: string;
  type: 'customer' | 'agent' | 'system';
  author: string;
  text: string;
  created_at: string;
};

function mapSupabaseConversation(record: Record<string, unknown>): ConversationRecord {
  const raw = record as {
    id?: string;
    customer_id?: string;
    customer_name?: string;
    title?: string;
    status?: 'Open' | 'Resolved' | 'Escalated';
    sentiment?: 'Positive' | 'Neutral' | 'Frustrated';
    last_updated?: string;
    summary?: string;
    memory_used?: boolean;
    knowledge_used?: boolean;
    conversation_messages?: SupabaseMessage[];
  };

  const conversationMessages = Array.isArray(raw.conversation_messages) ? raw.conversation_messages : [];
  const messages = conversationMessages.map((message) => ({
    id: message.id,
    type: message.type,
    author: message.author,
    text: message.text,
    createdAt: message.created_at,
  }));

  return {
    id: raw.id ?? 'CV-unknown',
    customerId: raw.customer_id ?? 'C-9999',
    customerName: raw.customer_name ?? 'New Customer',
    title: raw.title ?? 'Support conversation',
    status: raw.status ?? 'Open',
    sentiment: raw.sentiment ?? 'Neutral',
    lastUpdated: raw.last_updated ?? new Date().toISOString(),
    summary: raw.summary ?? 'Conversation started.',
    memoryUsed: Boolean(raw.memory_used),
    knowledgeUsed: Boolean(raw.knowledge_used),
    messages,
  };
}

export async function GET() {
  const fallback = getConversationStore();
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json(fallback);
  }

  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*, conversation_messages(*)')
      .order('last_updated', { ascending: false });

    if (error || !data) {
      return NextResponse.json(fallback);
    }

    return NextResponse.json(data.map(mapSupabaseConversation));
  } catch {
    return NextResponse.json(fallback);
  }
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

    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { error: conversationError } = await supabase.from('conversations').upsert({
        id: created.id,
        customer_id: created.customerId,
        customer_name: created.customerName,
        title: created.title,
        status: created.status,
        sentiment: created.sentiment,
        last_updated: created.lastUpdated,
        summary: created.summary,
        memory_used: created.memoryUsed,
        knowledge_used: created.knowledgeUsed,
      });

      if (!conversationError) {
        const rows = created.messages.map((message) => ({
          id: message.id,
          conversation_id: created.id,
          type: message.type,
          author: message.author,
          text: message.text,
          created_at: message.createdAt,
        }));

        await supabase.from('conversation_messages').upsert(rows);
      }
    }

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

    const supabase = await createSupabaseServerClient();
    if (supabase) {
      await supabase.from('conversations').upsert({
        id: updated.id,
        customer_id: updated.customerId,
        customer_name: updated.customerName,
        title: updated.title,
        status: updated.status,
        sentiment: updated.sentiment,
        last_updated: updated.lastUpdated,
        summary: updated.summary,
        memory_used: updated.memoryUsed,
        knowledge_used: updated.knowledgeUsed,
      });

      await supabase.from('conversation_messages').upsert(
        updated.messages.map((message) => ({
          id: message.id,
          conversation_id: updated.id,
          type: message.type,
          author: message.author,
          text: message.text,
          created_at: message.createdAt,
        })),
      );
    }

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
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    await supabase.from('conversation_messages').delete().neq('id', '');
    await supabase.from('conversations').delete().neq('id', '');
  }
  replaceConversationStore(JSON.parse(JSON.stringify(baseConversationRecords)));
  return NextResponse.json({ ok: true });
}
