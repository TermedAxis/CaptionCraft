import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, FileText, LogOut, Crown, LayoutGrid } from 'lucide-react';

type NavPage = 'generator' | 'saved' | 'planner';

type DashboardLayoutProps = {
  children: ReactNode;
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
};

export function DashboardLayout({ children, currentPage, onNavigate }: DashboardLayoutProps) {
  const { signOut, profile } = useAuth();

  const isPaid = profile?.subscription_tier === 'paid';

  const navItems: { id: NavPage; label: string; icon: React.ElementType }[] = [
    { id: 'generator', label: 'Generate', icon: Sparkles },
    { id: 'planner', label: 'Content Planner', icon: LayoutGrid },
    { id: 'saved', label: 'Saved', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Sparkles className="w-7 h-7 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">CaptionCraft</span>
              </div>

              <div className="hidden md:flex items-center gap-1">
                {navItems.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => onNavigate(id)}
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

            <div className="flex items-center gap-4">
              {isPaid && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                  <Crown className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white">Pro</span>
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
