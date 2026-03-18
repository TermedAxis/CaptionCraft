import { ArrowRight } from 'lucide-react';

interface CtaBannerProps {
  headline: string;
  sub: string;
  label: string;
  onGetStarted: () => void;
}

export function CtaBanner({ headline, sub, label, onGetStarted }: CtaBannerProps) {
  return (
    <section className="py-20 px-6 bg-gray-900 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">{headline}</h2>
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">{sub}</p>
        <button
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl text-base font-bold hover:bg-gray-100 transition"
        >
          {label}
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-gray-500 text-sm mt-4">No credit card required &nbsp;·&nbsp; 50 free credits &nbsp;·&nbsp; Instant access</p>
      </div>
    </section>
  );
}
