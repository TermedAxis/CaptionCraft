import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Crown, LayoutGrid, ScrollText, Image as ImageIcon, Zap, Star, TrendingUp, FolderOpen, ChevronDown, Sparkles } from 'lucide-react';
import { LogoMark } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { useState, useRef, useEffect } from 'react';

type NavPage = 'generator' | 'saved' | 'planner' | 'script' | 'thumbnail';

type DashboardLayoutProps = {
  children: ReactNode;
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  onRequestAuth: (message?: string) => void;
  onUpgrade: () => void;
  onBuyCredits: () => void;
};

const AUTH_REQUIRED_PAGES: NavPage[] = ['saved', 'script', 'thumbnail'];

const AUTH_MESSAGES: Partial<Record<NavPage, string>> = {
  saved: 'Sign in to view your saved media',
  script: 'Sign in to use the Script Generator',
  thumbnail: 'Sign in to use the Thumbnail Generator',
};

const PLAN_CONFIG = {
  free: { label: 'Free', icon: null, className: '' },
  hobby: { label: 'Hobby', icon: Star, className: 'bg-blue-600 text-white' },
  pro: { label: 'Pro', icon: Crown, className: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' },
};

function AccountMenu({ profile, plan, planConfig, onUpgrade, onBuyCredits, credits, signOut }: {
  profile: { full_name?: string | null; email?: string | null } | null;
  plan: string;
  planConfig: typeof PLAN_CONFIG[keyof typeof PLAN_CONFIG];
  onUpgrade: () => void;
  onBuyCredits: () => void;
  credits: number;
  signOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = (profile?.full_name ?? profile?.email ?? 'U')
    .split(' ')
    .map((w: string) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition group"
      >
        <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-gray-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
          {initials}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{profile?.full_name ?? 'Account'}</p>
          <p className="text-xs text-gray-400 leading-tight truncate max-w-[140px]">{profile?.email}</p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{profile?.full_name ?? 'Account'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{profile?.email}</p>
            <div className="mt-2 flex items-center gap-1.5">
              {plan !== 'free' && planConfig.icon ? (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${planConfig.className}`}>
                  {planConfig.label} Plan
                </span>
              ) : (
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">Free Plan</span>
              )}
            </div>
          </div>

          {plan !== 'free' && (
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Credits remaining</span>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{credits.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => { onBuyCredits(); setOpen(false); }}
                className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg py-1.5 transition"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Buy more credits
              </button>
            </div>
          )}

          {plan === 'free' && (
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <button
                onClick={() => { onUpgrade(); setOpen(false); }}
                className="w-full flex items-center justify-center gap-1.5 bg-blue-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Zap className="w-3.5 h-3.5" />
                Upgrade Plan
              </button>
            </div>
          )}

          <div className="px-2 py-2">
            <button
              onClick={() => { signOut(); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function DashboardLayout({ children, currentPage, onNavigate, onRequestAuth, onUpgrade, onBuyCredits }: DashboardLayoutProps) {
  const { user, signOut, profile } = useAuth();

  const plan = profile?.plan_type ?? 'free';
  const credits = profile?.credits_remaining ?? 0;
  const planConfig = PLAN_CONFIG[plan as keyof typeof PLAN_CONFIG] ?? PLAN_CONFIG.free;

  const navItems: { id: NavPage; label: string; icon: React.ElementType }[] = [
    { id: 'planner', label: 'Content Creator', icon: LayoutGrid },
    { id: 'generator', label: 'Caption Creator', icon: Sparkles },
    { id: 'script', label: 'Script Generator', icon: ScrollText },
    { id: 'thumbnail', label: 'Thumbnail Generator', icon: ImageIcon },
    { id: 'saved', label: 'Saved Media', icon: FolderOpen },
  ];

  const handleNavClick = (id: NavPage) => {
    if (AUTH_REQUIRED_PAGES.includes(id) && !user) {
      onRequestAuth(AUTH_MESSAGES[id]);
      return;
    }
    onNavigate(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between gap-4">

            {/* LEFT: Logo */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <LogoMark size={22} />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white hidden sm:block">Media Wizard</span>
            </div>

            {/* CENTER: Nav */}
            <div className="flex items-center gap-0.5 flex-1 justify-center overflow-x-auto">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleNavClick(id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                    currentPage === id
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${currentPage === id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                  <span className="hidden md:block">{label}</span>
                </button>
              ))}
            </div>

            {/* RIGHT: User area */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <ThemeToggle />

              {user ? (
                <>
                  {plan === 'free' ? (
                    <button
                      onClick={onUpgrade}
                      className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Upgrade
                    </button>
                  ) : (
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{credits.toLocaleString()}</span>
                      <span className="text-xs text-amber-400">cr</span>
                    </div>
                  )}

                  <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 hidden sm:block" />

                  <AccountMenu
                    profile={profile}
                    plan={plan}
                    planConfig={planConfig}
                    onUpgrade={onUpgrade}
                    onBuyCredits={onBuyCredits}
                    credits={credits}
                    signOut={signOut}
                  />
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRequestAuth()}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onRequestAuth()}
                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition"
                  >
                    Sign Up Free
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
