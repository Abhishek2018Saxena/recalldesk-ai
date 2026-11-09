import { NextResponse } from 'next/server';
import { tickets as fallbackTickets } from '@/lib/mock-data';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSupabaseTickets } from '@/lib/supabase/data';

function getDemoTickets() {
  if (typeof window === 'undefined') {
    return fallbackTickets;
  }

  return fallbackTickets;
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(getDemoTickets());
    }

    const { data, error } = await supabase.from('tickets').select('*').order('updated_at', { ascending: false });

    if (error) {
      return NextResponse.json(await getSupabaseTickets());
    }

    return NextResponse.json(data ?? (await getSupabaseTickets()));
  } catch {
    return NextResponse.json(await getSupabaseTickets());
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      const created = {
        ...body,
        id: body?.id || `TCK-${Math.floor(Math.random() * 9000 + 1000)}`,
        createdAt: body?.createdAt || new Date().toISOString(),
        updatedAt: body?.updatedAt || new Date().toISOString(),
      };

      const stored = JSON.parse(JSON.stringify(fallbackTickets)) as typeof fallbackTickets;
      const existing = stored.filter((item) => item.id !== created.id);
      existing.unshift(created);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('recalldesk-demo-tickets', JSON.stringify(existing));
      }
      return NextResponse.json(created, { status: 201 });
    }

    const { data, error } = await supabase.from('tickets').insert(body).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown ticket creation error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      const all = JSON.parse(JSON.stringify(fallbackTickets)) as typeof fallbackTickets;
      const updated = all.map((ticket) => (ticket.id === body.id ? { ...ticket, ...body, updatedAt: new Date().toISOString() } : ticket));
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('recalldesk-demo-tickets', JSON.stringify(updated));
      }
      const match = updated.find((ticket) => ticket.id === body.id);
      return NextResponse.json(match ?? body);
    }

    const { data, error } = await supabase.from('tickets').update(body).eq('id', body.id).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown ticket update error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
