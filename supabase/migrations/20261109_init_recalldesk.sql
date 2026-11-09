create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'admin' check (role in ('admin', 'agent', 'viewer')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id text primary key,
  name text not null,
  email text,
  phone text,
  tier text not null default 'Business' check (tier in ('Enterprise', 'Business', 'Pro')),
  region text,
  status text not null default 'Active' check (status in ('Active', 'At Risk', 'VIP')),
  sentiment text not null default 'Neutral' check (sentiment in ('Positive', 'Neutral', 'Frustrated')),
  value text,
  last_seen text,
  preference text,
  company text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.memory_items (
  id text primary key,
  customer_id text not null references public.customers(id) on delete cascade,
  title text not null,
  category text not null check (category in ('Preference', 'Issue', 'Resolution', 'Risk')),
  source text not null default 'Demo fallback' check (source in ('Hindsight', 'Demo fallback')),
  summary text not null,
  status text not null default 'active' check (status in ('active', 'needs review')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.knowledge_articles (
  id text primary key,
  title text not null,
  category text not null check (category in ('Policy', 'Delivery', 'Product', 'Billing')),
  source text not null,
  summary text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id text primary key,
  customer_id text references public.customers(id) on delete set null,
  customer_name text not null,
  title text not null,
  status text not null default 'Open' check (status in ('Open', 'Resolved', 'Escalated')),
  sentiment text not null default 'Neutral' check (sentiment in ('Positive', 'Neutral', 'Frustrated')),
  last_updated timestamptz not null default now(),
  summary text not null,
  memory_used boolean not null default false,
  knowledge_used boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversation_messages (
  id text primary key,
  conversation_id text not null references public.conversations(id) on delete cascade,
  type text not null check (type in ('customer', 'agent', 'system')),
  author text not null,
  text text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.tickets (
  id text primary key,
  customer_id text not null references public.customers(id) on delete cascade,
  subject text not null,
  category text not null check (category in ('Order delay', 'Billing', 'Access', 'Product issue')),
  priority text not null check (priority in ('Low', 'Medium', 'High', 'Urgent')),
  status text not null default 'Open' check (status in ('Open', 'In Progress', 'Pending', 'Escalated', 'Resolved', 'Closed')),
  assigned_to text,
  summary text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.escalations (
  id text primary key,
  customer_id text not null references public.customers(id) on delete cascade,
  reason text not null,
  priority text not null check (priority in ('High', 'Urgent')),
  sentiment text not null check (sentiment in ('Frustrated', 'Neutral')),
  status text not null default 'Pending' check (status in ('Pending', 'Accepted', 'Resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.integrations (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  status text not null default 'Configuration required' check (status in ('Connected', 'Demo mode', 'Configuration required', 'Connection error')),
  detail text,
  last_sync_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_profile_created()
returns trigger language plpgsql as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', new.email), 'admin')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute procedure public.handle_updated_at();

create trigger trg_customers_updated_at
before update on public.customers
for each row execute procedure public.handle_updated_at();

create trigger trg_memory_items_updated_at
before update on public.memory_items
for each row execute procedure public.handle_updated_at();

create trigger trg_knowledge_articles_updated_at
before update on public.knowledge_articles
for each row execute procedure public.handle_updated_at();

create trigger trg_conversations_updated_at
before update on public.conversations
for each row execute procedure public.handle_updated_at();

create trigger trg_tickets_updated_at
before update on public.tickets
for each row execute procedure public.handle_updated_at();

create trigger trg_escalations_updated_at
before update on public.escalations
for each row execute procedure public.handle_updated_at();

create trigger trg_integrations_updated_at
before update on public.integrations
for each row execute procedure public.handle_updated_at();

create trigger trg_app_settings_updated_at
before update on public.app_settings
for each row execute procedure public.handle_updated_at();

create trigger trg_profiles_on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_profile_created();

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.memory_items enable row level security;
alter table public.knowledge_articles enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_messages enable row level security;
alter table public.tickets enable row level security;
alter table public.escalations enable row level security;
alter table public.integrations enable row level security;
alter table public.app_settings enable row level security;

create policy "Authenticated users can view shared app data" on public.customers for select using (auth.role() = 'authenticated');
create policy "Authenticated users can view memory items" on public.memory_items for select using (auth.role() = 'authenticated');
create policy "Authenticated users can view knowledge base" on public.knowledge_articles for select using (auth.role() = 'authenticated');
create policy "Authenticated users can view conversations" on public.conversations for select using (auth.role() = 'authenticated');
create policy "Authenticated users can view conversation messages" on public.conversation_messages for select using (auth.role() = 'authenticated');
create policy "Authenticated users can view tickets" on public.tickets for select using (auth.role() = 'authenticated');
create policy "Authenticated users can view escalations" on public.escalations for select using (auth.role() = 'authenticated');
create policy "Authenticated users can view integrations" on public.integrations for select using (auth.role() = 'authenticated');

create policy "Users can manage their own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users can upsert their own app settings" on public.app_settings for all using (auth.uid() = updated_by) with check (auth.uid() = updated_by);

create policy "Service role can manage all app data" on public.customers for all using (auth.jwt() ->> 'role' = 'service_role') with check (auth.jwt() ->> 'role' = 'service_role');
create policy "Service role can manage all memory data" on public.memory_items for all using (auth.jwt() ->> 'role' = 'service_role') with check (auth.jwt() ->> 'role' = 'service_role');
create policy "Service role can manage all knowledge data" on public.knowledge_articles for all using (auth.jwt() ->> 'role' = 'service_role') with check (auth.jwt() ->> 'role' = 'service_role');
create policy "Service role can manage all conversations" on public.conversations for all using (auth.jwt() ->> 'role' = 'service_role') with check (auth.jwt() ->> 'role' = 'service_role');
create policy "Service role can manage all messages" on public.conversation_messages for all using (auth.jwt() ->> 'role' = 'service_role') with check (auth.jwt() ->> 'role' = 'service_role');
create policy "Service role can manage all tickets" on public.tickets for all using (auth.jwt() ->> 'role' = 'service_role') with check (auth.jwt() ->> 'role' = 'service_role');
create policy "Service role can manage escalations" on public.escalations for all using (auth.jwt() ->> 'role' = 'service_role') with check (auth.jwt() ->> 'role' = 'service_role');
create policy "Service role can manage integrations" on public.integrations for all using (auth.jwt() ->> 'role' = 'service_role') with check (auth.jwt() ->> 'role' = 'service_role');

create index if not exists idx_customers_email on public.customers(email);
create index if not exists idx_customers_company on public.customers(company);
create index if not exists idx_memory_customer on public.memory_items(customer_id);
create index if not exists idx_knowledge_category on public.knowledge_articles(category);
create index if not exists idx_conversations_customer on public.conversations(customer_id);
create index if not exists idx_conversation_messages_conversation on public.conversation_messages(conversation_id);
create index if not exists idx_tickets_customer on public.tickets(customer_id);
create index if not exists idx_escalations_customer on public.escalations(customer_id);
