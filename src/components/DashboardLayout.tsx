import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, LogOut, Crown, LayoutGrid, ScrollText, Image as ImageIcon, Zap, Star, TrendingUp, FolderOpen } from 'lucide-react';

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

export function DashboardLayout({ children, currentPage, onNavigate, onRequestAuth, onUpgrade, onBuyCredits }: DashboardLayoutProps) {
  const { user, signOut, profile } = useAuth();

  const plan = profile?.plan_type ?? 'free';
  const credits = profile?.credits_remaining ?? 0;
  const planConfig = PLAN_CONFIG[plan];

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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Sparkles className="w-7 h-7 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Media Wizard</span>
              </div>

              <div className="hidden md:flex items-center gap-1">
                {navItems.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleNavClick(id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                      currentPage === id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {user ? (
                <>
                  {plan !== 'free' && planConfig.icon && (
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${planConfig.className}`}>
                      <planConfig.icon className="w-3.5 h-3.5" />
                      {planConfig.label}
                    </div>
                  )}

                  {plan === 'free' ? (
                    <button
                      onClick={onUpgrade}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Upgrade
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-sm font-semibold text-amber-700">{credits.toLocaleString()}</span>
                        <span className="text-xs text-amber-500 hidden sm:inline">cr</span>
                      </div>
                      <button
                        onClick={onBuyCredits}
                        title="Buy more credits"
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <TrendingUp className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
                    <p className="text-xs text-gray-500">{profile?.email}</p>
                  </div>
                  <button
                    onClick={signOut}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    title="Sign out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRequestAuth()}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onRequestAuth()}
                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
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
