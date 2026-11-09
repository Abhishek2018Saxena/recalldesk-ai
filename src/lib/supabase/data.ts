import { customers, knowledgeBase, memoryItems, tickets } from '@/lib/mock-data';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getSupabaseCustomers() {
  if (!isSupabaseConfigured()) {
    return customers;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return customers;
  }

  const { data, error } = await supabase.from('customers').select('*').order('name', { ascending: true });

  if (error) {
    return customers;
  }

  return data ?? customers;
}

export async function getSupabaseKnowledgeArticles() {
  if (!isSupabaseConfigured()) {
    return knowledgeBase;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return knowledgeBase;
  }

  const { data, error } = await supabase.from('knowledge_articles').select('*').order('updated_at', { ascending: false });

  if (error) {
    return knowledgeBase;
  }

  return data ?? knowledgeBase;
}

export async function getSupabaseTickets() {
  if (!isSupabaseConfigured()) {
    return tickets;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return tickets;
  }

  const { data, error } = await supabase.from('tickets').select('*').order('updated_at', { ascending: false });

  if (error) {
    return tickets;
  }

  return data ?? tickets;
}

export async function getSupabaseMemoryItems() {
  if (!isSupabaseConfigured()) {
    return memoryItems;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return memoryItems;
  }

  const { data, error } = await supabase.from('memory_items').select('*').order('updated_at', { ascending: false });

  if (error) {
    return memoryItems;
  }

  return data ?? memoryItems;
}
