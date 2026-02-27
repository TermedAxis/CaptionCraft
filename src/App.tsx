import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Generator } from './pages/Generator';
import { SavedCaptions } from './pages/SavedCaptions';
import { Upgrade } from './pages/Upgrade';
import { ContentPlanner } from './pages/ContentPlanner';
import { DashboardLayout } from './components/DashboardLayout';
import { AuthModal } from './components/AuthModal';

type Page = 'generator' | 'saved' | 'planner';

function AppContent() {
  const [page, setPage] = useState<Page>('generator');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState<string | undefined>();

  const requestAuth = (message?: string) => {
    setAuthModalMessage(message);
    setShowAuthModal(true);
  };

  return (
    <>
      <DashboardLayout
        currentPage={page}
        onNavigate={setPage}
        onRequestAuth={requestAuth}
      >
        {page === 'saved' ? (
          <SavedCaptions onRequestAuth={requestAuth} />
        ) : page === 'planner' ? (
          <ContentPlanner onRequestAuth={requestAuth} />
        ) : (
          <Generator onRequestAuth={requestAuth} />
        )}
      </DashboardLayout>

      {showUpgrade && <Upgrade onClose={() => setShowUpgrade(false)} />}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          message={authModalMessage}
        />
      )}
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
