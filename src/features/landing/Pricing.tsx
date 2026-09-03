import React from 'react';
import { Check } from 'lucide-react';

export default function Pricing() {
  const plans = [
    { name: "Basic", price: "Free", desc: "For individual educators.", features: ["Up to 50 students", "Basic question types", "Community support"] },
    { name: "Pro", price: "$49/mo", desc: "For growing academies.", features: ["Up to 500 students", "AI Proctoring", "Detailed analytics", "Priority email support"], popular: true },
    { name: "Enterprise", price: "Custom", desc: "For large institutions.", features: ["Unlimited students", "Custom integrations", "White-labeling", "Dedicated success manager"] }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-20 px-4">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-primary-foreground tracking-tight">Simple, Transparent Pricing</h1>
          <p className="text-lg text-slate-400">Choose the plan that fits your institution's needs.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div key={i} className={`relative bg-slate-900/80 border ${plan.popular ? 'border-sky-500 shadow-lg shadow-sky-500/20' : 'border-border/10'} p-8 rounded-3xl backdrop-blur-xl flex flex-col`}>
              {plan.popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sky-500 text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>}
              <h3 className="text-xl font-bold text-primary-foreground mb-2">{plan.name}</h3>
              <p className="text-sm text-slate-400 mb-6">{plan.desc}</p>
              <div className="text-4xl font-extrabold text-primary-foreground mb-8">{plan.price}</div>
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-slate-300">
                    <Check className="w-5 h-5 text-emerald-400 shrink-0" /> {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl text-sm font-semibold transition ${plan.popular ? 'bg-sky-500 text-primary-foreground hover:bg-sky-400' : 'bg-slate-800 text-primary-foreground hover:bg-slate-700'}`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}