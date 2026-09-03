import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    { q: "How does AI Proctoring work?", a: "Our AI monitors webcam feeds in real-time to flag multiple faces, absence of the test-taker, and suspicious eye movements." },
    { q: "Can students take exams on mobile devices?", a: "Yes, our platform is fully responsive. However, strictly proctored exams may require a desktop browser for full lockdown capabilities." },
    { q: "Is my data secure?", a: "Absolutely. All data is encrypted at rest and in transit, and we are fully GDPR and CCPA compliant." },
    { q: "Do you integrate with Canvas or Moodle?", a: "Yes! Our Enterprise tier includes LTI integrations to sync grades and rosters seamlessly with your LMS." }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-20 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <HelpCircle className="w-12 h-12 text-sky-500 mx-auto" />
          <h1 className="text-4xl font-extrabold text-primary-foreground tracking-tight">Frequently Asked Questions</h1>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-slate-900/80 border border-border/10 p-6 rounded-2xl backdrop-blur-xl">
              <h3 className="text-lg font-bold text-primary-foreground mb-2">{faq.q}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}