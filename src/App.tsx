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
import { useRouter } from './router/useRouter';

import { AiCaptionGeneratorPage } from './pages/seo/AiCaptionGeneratorPage';
import { InstagramCaptionPage } from './pages/seo/InstagramCaptionPage';
import { YoutubeScriptPage } from './pages/seo/YoutubeScriptPage';
import { TiktokCaptionPage } from './pages/seo/TiktokCaptionPage';
import { ThumbnailGeneratorPage } from './pages/seo/ThumbnailGeneratorPage';
import { BlogIndexPage } from './pages/seo/BlogIndexPage';
import { BlogPostPage } from './pages/seo/BlogPostPage';
import { ProgrammaticPage } from './pages/seo/ProgrammaticPage';

import {
  INSTAGRAM_NICHES,
  YOUTUBE_TOPICS,
  TIKTOK_INDUSTRIES,
} from './seo/programmatic-data';

type Page = 'generator' | 'saved' | 'planner' | 'script' | 'thumbnail';

function AppContent() {
  const { user, loading } = useAuth();
  const { plan, credits } = useCredits();
  const { route, navigate } = useRouter();

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

  const handleGetStarted = () => {
    if (user) {
      navigate('/');
    } else {
      requestAuth();
    }
  };

  const renderSEOPage = () => {
    const { path, params } = route;

    if (path === '/ai-caption-generator') {
      return <AiCaptionGeneratorPage onGetStarted={handleGetStarted} navigate={navigate} />;
    }
    if (path === '/ai-instagram-caption-generator') {
      return <InstagramCaptionPage onGetStarted={handleGetStarted} navigate={navigate} />;
    }
    if (path === '/ai-youtube-script-generator') {
      return <YoutubeScriptPage onGetStarted={handleGetStarted} navigate={navigate} />;
    }
    if (path === '/ai-tiktok-caption-generator') {
      return <TiktokCaptionPage onGetStarted={handleGetStarted} navigate={navigate} />;
    }
    if (path === '/ai-thumbnail-generator') {
      return <ThumbnailGeneratorPage onGetStarted={handleGetStarted} navigate={navigate} />;
    }
    if (path === '/blog') {
      return <BlogIndexPage onGetStarted={handleGetStarted} navigate={navigate} />;
    }
    if (path === '/blog/post' && params.slug) {
      return <BlogPostPage slug={params.slug} onGetStarted={handleGetStarted} navigate={navigate} />;
    }
    if (path === '/instagram-captions' && params.slug) {
      const entry = INSTAGRAM_NICHES.find((n) => n.slug === params.slug);
      if (entry) {
        return <ProgrammaticPage type="instagram" entry={entry} onGetStarted={handleGetStarted} navigate={navigate} />;
      }
    }
    if (path === '/youtube-video-ideas' && params.slug) {
      const entry = YOUTUBE_TOPICS.find((t) => t.slug === params.slug);
      if (entry) {
        return <ProgrammaticPage type="youtube" entry={entry} onGetStarted={handleGetStarted} navigate={navigate} />;
      }
    }
    if (path === '/tiktok-hooks' && params.slug) {
      const entry = TIKTOK_INDUSTRIES.find((t) => t.slug === params.slug);
      if (entry) {
        return <ProgrammaticPage type="tiktok" entry={entry} onGetStarted={handleGetStarted} navigate={navigate} />;
      }
    }
    return null;
  };

  const seoPage = renderSEOPage();

  if (seoPage) {
    return (
      <>
        {seoPage}
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            message={authModalMessage}
          />
        )}
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Landing onGetStarted={() => requestAuth()} navigate={navigate} />
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
