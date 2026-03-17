import { X, Zap, Check, Crown, Star } from 'lucide-react';

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
    color: 'blue',
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
    color: 'amber',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 px-8 pt-8 pb-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-medium text-white/70 uppercase tracking-wider">Upgrade Plan</span>
          </div>
          <h2 className="text-2xl font-bold mb-1">Unlock more generations</h2>
          <p className="text-white/60 text-sm">{TRIGGER_MESSAGES[trigger]}</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = plan.id === currentPlan;
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-xl border-2 p-5 ${
                    plan.recommended
                      ? 'border-amber-400 bg-amber-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {plan.recommended && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                      BEST VALUE
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-1.5 rounded-lg ${plan.recommended ? 'bg-amber-200' : 'bg-blue-100'}`}>
                      <Icon className={`w-4 h-4 ${plan.recommended ? 'text-amber-700' : 'text-blue-600'}`} />
                    </div>
                    <span className="font-bold text-gray-900">{plan.name}</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500 text-sm">/mo</span>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.recommended ? 'text-amber-500' : 'text-blue-500'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {isCurrentPlan ? (
                    <div className="w-full text-center py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg">
                      Current Plan
                    </div>
                  ) : (
                    <a
                      href="https://bolt.new/setup/stripe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block w-full text-center py-2.5 rounded-lg text-sm font-semibold transition ${
                        plan.recommended
                          ? 'bg-amber-400 hover:bg-amber-500 text-amber-900'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {plan.cta}
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
            <div className="p-2 bg-white rounded-lg border border-gray-200 shrink-0">
              <Zap className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-0.5">Free plan limits</p>
              <p className="text-xs text-gray-500">
                5 captions · 3 posts · 3 scripts · 1 thumbnail — total, not per day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
