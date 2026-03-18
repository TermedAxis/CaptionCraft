import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { useCredits } from './hooks/useCredits';
import { Generator } from './pages/Generator';
import { SavedCaptions } from './pages/SavedCaptions';
import { ContentPlanner } from './pages/ContentPlanner';
import { ScriptGenerator } from './pages/ScriptGenerator';
import { ThumbnailGenerator } from './pages/ThumbnailGenerator';
import { Landing } from './pages/Landing';
import { DashboardLayout } from './components/DashboardLayout';
import { AuthModal } from './components/AuthModal';
import { UpgradeModal } from './components/UpgradeModal';
import { BuyCreditsModal } from './components/BuyCreditsModal';

type Page = 'generator' | 'saved' | 'planner' | 'script' | 'thumbnail';

function AppContent() {
  const { user, loading } = useAuth();
  const { plan, credits } = useCredits();

  const [page, setPage] = useState<Page>('generator');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeTrigger, setUpgradeTrigger] = useState<'limit' | 'credits' | 'model'>('limit');
  const [showBuyCredits, setShowBuyCredits] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState<string | undefined>();

  const requestAuth = (message?: string) => {
    setAuthModalMessage(message);
    setShowAuthModal(true);
  };

  const requestUpgrade = (trigger: 'limit' | 'credits' | 'model' = 'limit') => {
    setUpgradeTrigger(trigger);
    setShowUpgrade(true);
  };

  const renderPage = () => {
    switch (page) {
      case 'saved': return <SavedCaptions onRequestAuth={requestAuth} />;
      case 'planner': return <ContentPlanner onRequestAuth={requestAuth} onUpgrade={() => requestUpgrade('limit')} />;
      case 'script': return <ScriptGenerator onRequestAuth={requestAuth} onUpgrade={() => requestUpgrade('limit')} />;
      case 'thumbnail': return <ThumbnailGenerator onRequestAuth={requestAuth} onUpgrade={() => requestUpgrade('limit')} />;
      default: return <Generator onRequestAuth={requestAuth} onUpgrade={() => requestUpgrade('limit')} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Landing onGetStarted={() => requestAuth()} />
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            message={authModalMessage}
          />
        )}
      </>
    );
  }

  return (
    <>
      <DashboardLayout
        currentPage={page}
        onNavigate={setPage}
        onRequestAuth={requestAuth}
        onUpgrade={() => requestUpgrade('limit')}
        onBuyCredits={() => setShowBuyCredits(true)}
      >
        {renderPage()}
      </DashboardLayout>

      {showUpgrade && (
        <UpgradeModal
          onClose={() => setShowUpgrade(false)}
          currentPlan={plan}
          trigger={upgradeTrigger}
        />
      )}

      {showBuyCredits && plan !== 'free' && (
        <BuyCreditsModal
          plan={plan}
          currentCredits={credits}
          onClose={() => setShowBuyCredits(false)}
        />
      )}

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
