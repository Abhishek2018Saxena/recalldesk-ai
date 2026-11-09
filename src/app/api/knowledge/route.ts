import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSupabaseKnowledgeArticles } from '@/lib/supabase/data';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      const fallback = await getSupabaseKnowledgeArticles();
      return NextResponse.json(fallback);
    }

    const { data, error } = await supabase.from('knowledge_articles').select('*').order('updated_at', { ascending: false });

    if (error) {
      const fallback = await getSupabaseKnowledgeArticles();
      return NextResponse.json(fallback);
    }

    return NextResponse.json(data ?? (await getSupabaseKnowledgeArticles()));
  } catch {
    const fallback = await getSupabaseKnowledgeArticles();
    return NextResponse.json(fallback);
  }
}
