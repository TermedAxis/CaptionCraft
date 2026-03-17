import { ReactNode, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, LogOut, Crown, LayoutGrid, ScrollText, Image as ImageIcon, Star, TrendingUp, FileText, Menu, X } from 'lucide-react';

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
  saved: 'Sign in to view your saved captions',
  script: 'Sign in to use the Script Generator',
  thumbnail: 'Sign in to use the Thumbnail Generator',
};

const PLAN_CONFIG = {
  free: { label: 'Free', icon: null, className: 'bg-bat-surface2 text-bat-muted border border-bat-border' },
  hobby: { label: 'Hobby', icon: Star, className: 'bg-white/10 text-white border border-white/20' },
  pro: { label: 'Pro', icon: Crown, className: 'bg-white text-black border border-white' },
};

function BatLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shrink-0">
        <span className="text-black font-bold text-xs tracking-tight">SB</span>
      </div>
      <span className="text-base font-semibold tracking-tight text-white">Social Bat</span>
    </div>
  );
}

export function DashboardLayout({ children, currentPage, onNavigate, onRequestAuth, onUpgrade, onBuyCredits }: DashboardLayoutProps) {
  const { user, signOut, profile } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const plan = profile?.plan_type ?? 'free';
  const credits = profile?.credits_remaining ?? 0;
  const planConfig = PLAN_CONFIG[plan];

  const navItems: { id: NavPage; label: string; icon: React.ElementType }[] = [
    { id: 'planner', label: 'Content Creator', icon: LayoutGrid },
    { id: 'generator', label: 'Caption Creator', icon: Zap },
    { id: 'script', label: 'Script Generator', icon: ScrollText },
    { id: 'thumbnail', label: 'Thumbnail Generator', icon: ImageIcon },
    { id: 'saved', label: 'Saved', icon: FileText },
  ];

  const handleNavClick = (id: NavPage) => {
    if (AUTH_REQUIRED_PAGES.includes(id) && !user) {
      onRequestAuth(AUTH_MESSAGES[id]);
      setMobileOpen(false);
      return;
    }
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-bat-bg">
      <nav className="sticky top-0 z-40 border-b border-bat-border bg-bat-bg/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5 min-w-0">
            <BatLogo />
            <div className="hidden lg:flex items-center gap-0.5">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleNavClick(id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    currentPage === id
                      ? 'bg-white/10 text-white'
                      : 'text-bat-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <>
                {plan !== 'free' && planConfig.icon && (
                  <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${planConfig.className}`}>
                    <planConfig.icon className="w-3 h-3" />
                    {planConfig.label}
                  </div>
                )}
                {plan === 'free' ? (
                  <button
                    onClick={onUpgrade}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-xs font-semibold rounded-lg transition-all duration-200 hover:bg-bat-accent active:scale-95"
                  >
                    <Zap className="w-3 h-3" />
                    Upgrade
                  </button>
                ) : (
                  <div className="hidden sm:flex items-center gap-1.5">
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-bat-surface border border-bat-border rounded-lg">
                      <Zap className="w-3 h-3 text-bat-muted" />
                      <span className="text-sm font-semibold text-white">{credits.toLocaleString()}</span>
                      <span className="text-xs text-bat-subtle">cr</span>
                    </div>
                    <button
                      onClick={onBuyCredits}
                      title="Buy more credits"
                      className="p-1.5 text-bat-muted hover:text-white hover:bg-bat-surface rounded-lg transition-all duration-200"
                    >
                      <TrendingUp className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="hidden sm:block">
                  <p className="text-xs font-medium text-white leading-none">{profile?.full_name}</p>
                </div>
                <button
                  onClick={signOut}
                  className="p-1.5 text-bat-muted hover:text-white hover:bg-bat-surface rounded-lg transition-all duration-200"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => onRequestAuth()}
                  className="px-3 py-1.5 text-sm font-medium text-bat-muted hover:text-white transition-colors duration-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onRequestAuth()}
                  className="px-4 py-1.5 text-sm font-semibold text-black bg-white hover:bg-bat-accent rounded-lg transition-all duration-200 active:scale-95"
                >
                  Get Started
                </button>
              </div>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 text-bat-muted hover:text-white hover:bg-bat-surface rounded-lg transition-all duration-200"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-0 top-14 z-30 bg-bat-surface border-b border-bat-border lg:hidden"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.8)' }}
          >
            <div className="p-4 space-y-1">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleNavClick(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    currentPage === id
                      ? 'bg-white/10 text-white'
                      : 'text-bat-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
              <div className="pt-3 border-t border-bat-border mt-2">
                {user ? (
                  <div className="flex items-center justify-between px-1">
                    <div>
                      <p className="text-sm font-medium text-white">{profile?.full_name}</p>
                      <p className="text-xs text-bat-muted">{profile?.email}</p>
                    </div>
                    <button
                      onClick={() => { signOut(); setMobileOpen(false); }}
                      className="p-2 text-bat-muted hover:text-white rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => { onRequestAuth(); setMobileOpen(false); }}
                      className="flex-1 py-2.5 text-sm font-medium text-bat-muted border border-bat-border rounded-xl hover:text-white hover:border-bat-border2 transition-all"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => { onRequestAuth(); setMobileOpen(false); }}
                      className="flex-1 py-2.5 text-sm font-semibold text-black bg-white rounded-xl hover:bg-bat-accent transition-all"
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
