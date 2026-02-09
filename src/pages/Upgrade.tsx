import { Crown, Check, Zap } from 'lucide-react';

export function Upgrade({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Upgrade to Pro</h2>
          <p className="text-gray-600">Unlock unlimited caption generation</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 mb-8">
          <div className="flex items-baseline justify-center mb-6">
            <span className="text-5xl font-bold text-gray-900">$19</span>
            <span className="text-xl text-gray-600 ml-2">/month</span>
          </div>

          <ul className="space-y-4 mb-6">
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-700">Unlimited caption generations</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-700">All platforms and content types</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-700">Save unlimited captions</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-700">Priority AI processing</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-700">Advanced customization options</span>
            </li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            To enable Stripe payments, add your Stripe integration.
          </p>
          <a
            href="https://bolt.new/setup/stripe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            <Zap className="w-5 h-5" />
            Set Up Stripe
          </a>
        </div>
      </div>
    </div>
  );
}
