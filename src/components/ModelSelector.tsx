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

  const handleSelect = (model: ModelId) => {
    if (!allowed.includes(model)) {
      onUpgradeRequired();
      return;
    }
    onChange(model);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">AI Model</label>
      <div className="grid grid-cols-3 gap-2">
        {options.map(({ id, icon: Icon }) => {
          const isAllowed = allowed.includes(id);
          const isSelected = selected === id;
          const cost = plan !== 'free' ? getCreditCost(feature, id) : 0;
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
              {!isAllowed && (
                <span className="absolute top-1.5 right-1.5">
                  <Lock className="w-3 h-3 text-gray-400" />
                </span>
              )}
              <div className="flex items-center gap-1.5 mb-0.5">
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-100' : isAllowed ? 'text-blue-500' : 'text-gray-300'}`} />
                <span className="font-semibold text-xs">{MODEL_LABELS[id]}</span>
              </div>
              {plan !== 'free' && (
                <span className={`block text-xs ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                  {isAllowed ? `${cost} cr` : `${PLAN_NAMES[requiredPlan]}+`}
                </span>
              )}
              {!isAllowed && (
                <span className={`block text-xs text-gray-400`}>
                  {PLAN_NAMES[requiredPlan]}+
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className={`text-xs mt-1.5 ${true ? 'text-gray-400' : ''}`}>
        {MODEL_DESCRIPTIONS[selected]}
      </p>
    </div>
  );
}
