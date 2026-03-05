import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Generator } from './pages/Generator';
import { SavedCaptions } from './pages/SavedCaptions';
import { Upgrade } from './pages/Upgrade';
import { ContentPlanner } from './pages/ContentPlanner';
import { ScriptGenerator } from './pages/ScriptGenerator';
import { ThumbnailGenerator } from './pages/ThumbnailGenerator';
import { DashboardLayout } from './components/DashboardLayout';
import { AuthModal } from './components/AuthModal';

type Page = 'generator' | 'saved' | 'planner' | 'script' | 'thumbnail';

function AppContent() {
  const [page, setPage] = useState<Page>('generator');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState<string | undefined>();

  const requestAuth = (message?: string) => {
    setAuthModalMessage(message);
    setShowAuthModal(true);
  };

  const renderPage = () => {
    switch (page) {
      case 'saved': return <SavedCaptions onRequestAuth={requestAuth} />;
      case 'planner': return <ContentPlanner onRequestAuth={requestAuth} />;
      case 'script': return <ScriptGenerator onRequestAuth={requestAuth} />;
      case 'thumbnail': return <ThumbnailGenerator onRequestAuth={requestAuth} />;
      default: return <Generator onRequestAuth={requestAuth} />;
    }
  };

  return (
    <>
      <DashboardLayout
        currentPage={page}
        onNavigate={setPage}
        onRequestAuth={requestAuth}
      >
        {renderPage()}
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
