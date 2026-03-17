import { Zap, Brain, Sparkles, Lock } from 'lucide-react';
import { PlanType, ModelId, FeatureType } from '../lib/supabase';
import {
  ALLOWED_MODELS,
  MODEL_LABELS,
  MODEL_DESCRIPTIONS,
  getCreditCost,
  MODEL_PLAN_REQUIRED,
} from '../lib/credits';

interface TextModelOption {
  id: ModelId;
  icon: React.ElementType;
}

const TEXT_MODELS: TextModelOption[] = [
  { id: 'base', icon: Zap },
  { id: 'mid', icon: Brain },
  { id: 'premium', icon: Sparkles },
];

const IMAGE_MODELS: TextModelOption[] = [
  { id: 'base-image', icon: Zap },
  { id: 'hobby-image', icon: Brain },
  { id: 'pro-image', icon: Sparkles },
];

interface ModelSelectorProps {
  feature: FeatureType;
  plan: PlanType;
  selected: ModelId;
  onChange: (model: ModelId) => void;
  onUpgradeRequired: () => void;
}

const PLAN_NAMES: Record<PlanType, string> = {
  free: 'Free',
  hobby: 'Hobby',
  pro: 'Pro',
};

export function ModelSelector({ feature, plan, selected, onChange, onUpgradeRequired }: ModelSelectorProps) {
  const isImageFeature = feature === 'thumbnail';
  const options = isImageFeature ? IMAGE_MODELS : TEXT_MODELS;
  const allowed = ALLOWED_MODELS[plan];
  const isFree = plan === 'free';

  const handleSelect = (model: ModelId) => {
    if (!allowed.includes(model)) {
      onUpgradeRequired();
      return;
    }
    onChange(model);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">AI Model</label>
        {isFree && (
          <button
            type="button"
            onClick={onUpgradeRequired}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <Lock className="w-3 h-3" />
            Upgrade to unlock
          </button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {options.map(({ id, icon: Icon }) => {
          const isAllowed = allowed.includes(id);
          const isSelected = !isFree && selected === id;
          const cost = !isFree ? getCreditCost(feature, id) : 0;
          const requiredPlan = MODEL_PLAN_REQUIRED[id];

          return (
            <button
              key={id}
              type="button"
              onClick={() => handleSelect(id)}
              className={`relative px-3 py-2.5 rounded-lg text-sm font-medium border transition text-left ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600'
                  : isAllowed
                  ? 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  : 'bg-gray-50 text-gray-400 border-gray-200 cursor-pointer'
              }`}
            >
              <span className="absolute top-1.5 right-1.5">
                <Lock className={`w-3 h-3 ${isAllowed ? 'opacity-0' : 'text-gray-400'}`} />
              </span>
              <div className="flex items-center gap-1.5 mb-0.5">
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-100' : isAllowed ? 'text-blue-500' : 'text-gray-300'}`} />
                <span className="font-semibold text-xs">{MODEL_LABELS[id]}</span>
              </div>
              <span className={`block text-xs ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                {isFree
                  ? `${PLAN_NAMES[requiredPlan]}+`
                  : isAllowed
                  ? `${cost} cr`
                  : `${PLAN_NAMES[requiredPlan]}+`}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-xs mt-1.5 text-gray-400">
        {isFree ? 'Upgrade to access faster, more powerful AI models' : MODEL_DESCRIPTIONS[selected]}
      </p>
    </div>
  );
}
