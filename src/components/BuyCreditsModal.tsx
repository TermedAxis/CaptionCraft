import { X, Zap, TrendingUp } from 'lucide-react';
import { PlanType } from '../lib/supabase';
import { TOP_UP_PACKAGES } from '../lib/credits';

interface BuyCreditsModalProps {
  plan: PlanType;
  currentCredits: number;
  onClose: () => void;
}

export function BuyCreditsModal({ plan, currentCredits, onClose }: BuyCreditsModalProps) {
  if (plan === 'free') return null;

  const packages = TOP_UP_PACKAGES[plan];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 px-8 pt-8 pb-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-medium text-white/70 uppercase tracking-wider">Top Up Credits</span>
          </div>
          <h2 className="text-2xl font-bold mb-1">Buy more credits</h2>
          <p className="text-white/60 text-sm">
            You have <span className="text-white font-semibold">{currentCredits}</span> credits remaining.
            Credits expire at end of billing cycle.
          </p>
        </div>

        <div className="p-6 space-y-3">
          {packages.map(({ credits, price }) => {
            const perCredit = (price / credits * 100).toFixed(1);
            return (
              <a
                key={credits}
                href="https://bolt.new/setup/stripe"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 border-2 border-gray-200 hover:border-blue-400 rounded-xl transition group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition">
                    <Zap className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{credits.toLocaleString()} credits</p>
                    <p className="text-xs text-gray-500">{perCredit}¢ per credit</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">${price}</p>
                  <p className="text-xs text-blue-600 font-medium group-hover:underline">Purchase</p>
                </div>
              </a>
            );
          })}

          <p className="text-xs text-center text-gray-400 pt-2">
            Credits are added instantly and expire at the end of your current billing cycle.
          </p>
        </div>
      </div>
    </div>
  );
}
