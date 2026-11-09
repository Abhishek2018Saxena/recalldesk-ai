import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSupabaseCustomers } from '@/lib/supabase/data';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      const fallback = await getSupabaseCustomers();
      return NextResponse.json(fallback);
    }

    const { data, error } = await supabase.from('customers').select('*').order('name', { ascending: true });

    if (error) {
      const fallback = await getSupabaseCustomers();
      return NextResponse.json(fallback);
    }

    return NextResponse.json(data ?? (await getSupabaseCustomers()));
  } catch {
    const fallback = await getSupabaseCustomers();
    return NextResponse.json(fallback);
  }
}
