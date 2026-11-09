import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSupabaseTickets } from '@/lib/supabase/data';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      const fallback = await getSupabaseTickets();
      return NextResponse.json(fallback);
    }

    const { data, error } = await supabase.from('tickets').select('*').order('updated_at', { ascending: false });

    if (error) {
      const fallback = await getSupabaseTickets();
      return NextResponse.json(fallback);
    }

    return NextResponse.json(data ?? (await getSupabaseTickets()));
  } catch {
    const fallback = await getSupabaseTickets();
    return NextResponse.json(fallback);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase is not configured. Add your environment variables to persist new tickets.' }, { status: 503 });
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
