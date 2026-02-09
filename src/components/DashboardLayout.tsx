import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, FileText, LogOut, Crown } from 'lucide-react';

type DashboardLayoutProps = {
  children: ReactNode;
  currentPage: 'generator' | 'saved';
  onNavigate: (page: 'generator' | 'saved') => void;
};

export function DashboardLayout({ children, currentPage, onNavigate }: DashboardLayoutProps) {
  const { signOut, profile } = useAuth();

  const isPaid = profile?.subscription_tier === 'paid';

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

              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => onNavigate('generator')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    currentPage === 'generator'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Generate
                </button>
                <button
                  onClick={() => onNavigate('saved')}
                  className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                    currentPage === 'saved'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Saved
                </button>
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
