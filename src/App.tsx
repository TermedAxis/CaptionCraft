import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Generator } from './pages/Generator';
import { SavedCaptions } from './pages/SavedCaptions';
import { Upgrade } from './pages/Upgrade';
import { ContentPlanner } from './pages/ContentPlanner';
import { DashboardLayout } from './components/DashboardLayout';

type Page = 'landing' | 'login' | 'signup' | 'generator' | 'saved' | 'planner';

function AppContent() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState<Page>('landing');
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    if (page === 'signup') {
      return <Signup onSwitchToLogin={() => setPage('login')} />;
    }
    if (page === 'login') {
      return <Login onSwitchToSignup={() => setPage('signup')} />;
    }
    return <Landing onGetStarted={() => setPage('signup')} />;
  }

  const currentNavPage = page === 'saved' ? 'saved' : page === 'planner' ? 'planner' : 'generator';

  return (
    <>
      <DashboardLayout
        currentPage={currentNavPage}
        onNavigate={(newPage) => setPage(newPage)}
      >
        {page === 'saved' ? (
          <SavedCaptions />
        ) : page === 'planner' ? (
          <ContentPlanner />
        ) : (
          <Generator />
        )}
      </DashboardLayout>

      {showUpgrade && <Upgrade onClose={() => setShowUpgrade(false)} />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
