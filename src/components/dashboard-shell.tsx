'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, ChevronDown, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Search, ShieldCheck, Sparkles, SunMedium, MoonStar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { navItems } from '@/lib/mock-data';
import { supabase } from '@/lib/supabase/client';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [userName, setUserName] = useState('Workspace User');
  const [userRole, setUserRole] = useState('Administrator');

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
        return;
      }

      const fullName = session?.user?.user_metadata?.full_name as string | undefined;
      const companyRole = session?.user?.user_metadata?.role as string | undefined;
      setUserName(fullName || session?.user?.email || 'Workspace User');
      setUserRole(companyRole || 'Administrator');
    });

    void supabase.auth.getUser().then(({ data: { user } }) => {
      const fullName = user?.user_metadata?.full_name as string | undefined;
      const companyRole = user?.user_metadata?.role as string | undefined;
      setUserName(fullName || user?.email || 'Workspace User');
      setUserRole(companyRole || 'Administrator');
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const activeItem = navItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

  const handleLogout = async () => {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout failed:', error.message);
      }
    }
    router.replace('/login');
    router.refresh();
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-950 text-slate-100 dark">
        <div className="mx-auto flex max-w-[1600px]">
          <aside
            className={`${
              isCollapsed ? 'w-24' : 'w-72'
            } hidden shrink-0 border-r border-slate-800 bg-slate-950/80 p-4 lg:flex lg:flex-col`}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/30">
                  <Sparkles className="h-5 w-5" />
                </div>
                {!isCollapsed && (
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">RecallDesk</div>
                    <div className="text-lg font-semibold text-white">AI Support</div>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsCollapsed((value) => !value)}
                className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:border-slate-500"
                aria-label="Toggle sidebar"
              >
                {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              </button>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'border-blue-500/40 bg-blue-500/10 text-white'
                        : 'border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{item.name}</span>
                    {!isCollapsed && <span className="text-[9px] uppercase tracking-[0.18em] text-slate-500">Live</span>}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                Secure mode
              </div>
              <p className="text-sm text-slate-200">
                Customer memory and access rules are isolated to the signed-in workspace. Demo mode is clearly labeled.
              </p>
            </div>
          </aside>

          <main className="flex-1">
            <header className="border-b border-slate-800 bg-slate-950/75 px-4 py-4 backdrop-blur-sm sm:px-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-center gap-3 xl:hidden">
                  <button type="button" className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-300">
                    <Menu className="h-4 w-4" />
                  </button>
                  <div className="text-sm text-slate-300">RecallDesk AI</div>
                </div>

                <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-400 shadow-sm">
                  <Search className="h-4 w-4" />
                  <input
                    aria-label="Global search"
                    className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                    placeholder="Search customers, tickets, or knowledge"
                  />
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDark((value) => !value)}
                    className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:border-slate-500"
                    aria-label="Toggle theme"
                  >
                    {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                  </button>
                  <button type="button" className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:border-slate-500">
                    <Bell className="h-4 w-4" />
                  </button>

                  <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-sm font-semibold text-white">
                      {userName
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2) || 'WU'}
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-sm font-medium text-white">{userName}</div>
                      <div className="text-xs text-slate-400">{userRole}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:border-slate-500"
                    aria-label="Log out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </header>

            <div className="border-b border-slate-800 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                <span>Workspace</span>
                <span>/</span>
                <span className="text-slate-200">{activeItem?.name ?? 'Overview'}</span>
              </div>
            </div>

            <div className="p-4 sm:p-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
