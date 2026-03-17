import { X, Zap, TrendingUp } from 'lucide-react';
import { PlanType } from '../lib/supabase';
import { TOP_UP_PACKAGES } from '../lib/credits';
import { motion } from 'framer-motion';

interface BuyCreditsModalProps {
  plan: PlanType;
  currentCredits: number;
  onClose: () => void;
}

export function BuyCreditsModal({ plan, currentCredits, onClose }: BuyCreditsModalProps) {
  if (plan === 'free') return null;

  const packages = TOP_UP_PACKAGES[plan];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-bat-surface border border-bat-border rounded-2xl w-full max-w-md overflow-hidden shadow-bat-lg"
      >
        <div className="relative px-6 pt-6 pb-5 border-b border-bat-border">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-bat-muted hover:text-white hover:bg-bat-surface2 rounded-lg transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-bat-muted" />
            <span className="text-xs font-medium text-bat-muted uppercase tracking-wider">Top Up Credits</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Buy more credits</h2>
          <p className="text-sm text-bat-muted">
            You have <span className="text-white font-semibold">{currentCredits}</span> credits remaining.
          </p>
        </div>

        <div className="p-5 space-y-2.5">
          {packages.map(({ credits, price }) => {
            const perCredit = (price / credits * 100).toFixed(1);
            return (
              <a
                key={credits}
                href="https://bolt.new/setup/stripe"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-bat-bg border border-bat-border hover:border-bat-border2 rounded-xl transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-bat-surface border border-bat-border rounded-lg group-hover:border-bat-border2 transition-colors">
                    <Zap className="w-4 h-4 text-bat-muted" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{credits.toLocaleString()} credits</p>
                    <p className="text-xs text-bat-muted">{perCredit}¢ per credit</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">${price}</p>
                  <p className="text-xs text-bat-muted group-hover:text-white transition-colors">Purchase</p>
                </div>
              </a>
            );
          })}

          <p className="text-xs text-center text-bat-subtle pt-2">
            Credits are added instantly and expire at end of billing cycle.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
