import { X, Zap, Check, Crown, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface UpgradeModalProps {
  onClose: () => void;
  currentPlan: 'free' | 'hobby' | 'pro';
  trigger?: 'limit' | 'credits' | 'model';
}

const PLANS = [
  {
    id: 'hobby',
    name: 'Hobby',
    price: 10,
    credits: 1500,
    icon: Star,
    features: [
      '1,500 credits / month',
      'Fast model (GPT-4o-mini)',
      'Smart model (Claude Haiku)',
      'Standard & Enhanced image models',
      'Unlimited generations (credits permitting)',
      'Usage history',
    ],
    cta: 'Start Hobby',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 20,
    credits: 4000,
    icon: Crown,
    features: [
      '4,000 credits / month',
      'All text models incl. Claude Sonnet',
      'All image models incl. Pro model',
      'Priority generation',
      'Everything in Hobby',
      'Top-up discounts',
    ],
    cta: 'Go Pro',
    recommended: true,
  },
];

const TRIGGER_MESSAGES: Record<string, string> = {
  limit: "You've used all your free generations for this feature.",
  credits: "You don't have enough credits to generate.",
  model: 'This model requires a higher plan.',
};

export function UpgradeModal({ onClose, currentPlan, trigger = 'limit' }: UpgradeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-bat-surface border border-bat-border rounded-2xl w-full max-w-lg overflow-hidden shadow-bat-lg"
      >
        <div className="relative px-6 pt-6 pb-5 border-b border-bat-border">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-bat-muted hover:text-white hover:bg-bat-surface2 rounded-lg transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-bat-muted" />
            <span className="text-xs font-medium text-bat-muted uppercase tracking-wider">Upgrade Plan</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Unlock more generations</h2>
          <p className="text-sm text-bat-muted">{TRIGGER_MESSAGES[trigger]}</p>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-2 gap-3 mb-5">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = plan.id === currentPlan;
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-xl border p-4 ${
                    plan.recommended
                      ? 'border-white/30 bg-white/5'
                      : 'border-bat-border bg-bat-bg'
                  }`}
                >
                  {plan.recommended && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-3 py-0.5 rounded-full whitespace-nowrap">
                      BEST VALUE
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-1.5 rounded-lg ${plan.recommended ? 'bg-white/10' : 'bg-bat-surface'}`}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-semibold text-white text-sm">{plan.name}</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-white">${plan.price}</span>
                    <span className="text-bat-muted text-xs">/mo</span>
                  </div>
                  <ul className="space-y-1.5 mb-4">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-bat-muted">
                        <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-white" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {isCurrentPlan ? (
                    <div className="w-full text-center py-2 text-xs font-medium text-bat-muted bg-bat-surface2 rounded-lg border border-bat-border">
                      Current Plan
                    </div>
                  ) : (
                    <a
                      href="https://bolt.new/setup/stripe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block w-full text-center py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        plan.recommended
                          ? 'bg-white hover:bg-bat-accent text-black'
                          : 'bg-bat-surface2 hover:bg-bat-border text-white border border-bat-border'
                      }`}
                    >
                      {plan.cta}
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-bat-bg border border-bat-border rounded-xl p-3.5 flex items-start gap-3">
            <div className="p-1.5 bg-bat-surface rounded-lg border border-bat-border shrink-0">
              <Zap className="w-3.5 h-3.5 text-bat-muted" />
            </div>
            <div>
              <p className="text-xs font-medium text-white mb-0.5">Free plan limits</p>
              <p className="text-xs text-bat-muted">
                5 captions · 3 posts · 3 scripts · 1 thumbnail — total, not per day.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
