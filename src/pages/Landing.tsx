import { Sparkles, Zap, TrendingUp, Clock } from 'lucide-react';

export function Landing({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">CaptionCraft</span>
        </div>
        <button
          onClick={onGetStarted}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Get Started
        </button>
      </nav>

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Create Viral Social Media Captions in{' '}
            <span className="text-blue-600">Seconds</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            AI-powered caption generator optimized for Instagram, TikTok, LinkedIn, Twitter, and YouTube Shorts.
            Stop struggling with writer's block and start posting content that converts.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            Start Creating Free
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-20">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-gray-600 text-sm">Generate platform-optimized captions instantly</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">High Converting</h3>
            <p className="text-gray-600 text-sm">Captions designed to boost engagement</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Save Time</h3>
            <p className="text-gray-600 text-sm">Create weeks of content in minutes</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Multiple Tones</h3>
            <p className="text-gray-600 text-sm">Professional, casual, funny, and more</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Supported Platforms</h2>
          <div className="grid md:grid-cols-5 gap-6">
            {['Instagram', 'TikTok', 'LinkedIn', 'Twitter', 'YouTube'].map((platform) => (
              <div key={platform} className="text-center">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-3">
                  <span className="text-2xl font-bold text-gray-900">{platform[0]}</span>
                </div>
                <p className="text-sm font-medium text-gray-700">{platform}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
