import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSupabaseMemoryItems } from '@/lib/supabase/data';

export async function GET() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json(await getSupabaseMemoryItems());
  }

  try {
    const { data, error } = await supabase.from('memory_items').select('*').order('updated_at', { ascending: false });

    if (error) {
      return NextResponse.json(await getSupabaseMemoryItems());
    }

    return NextResponse.json(data ?? (await getSupabaseMemoryItems()));
  } catch {
    return NextResponse.json(await getSupabaseMemoryItems());
  }
}
