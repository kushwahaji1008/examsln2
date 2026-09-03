import React from 'react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-20 px-4">
      <div className="max-w-3xl mx-auto bg-slate-900/80 border border-border/10 p-8 sm:p-12 rounded-3xl backdrop-blur-xl space-y-8">
        <h1 className="text-3xl font-extrabold text-primary-foreground tracking-tight border-b border-border/10 pb-6">Privacy Policy</h1>
        <div className="space-y-6 text-sm text-slate-400 leading-relaxed">
          <p>Last updated: August 4, 2026</p>
          
          <h2 className="text-xl font-bold text-primary-foreground mt-8 mb-4">Data Collection & Usage</h2>
          <p>We collect information that you provide directly to us when you register for an account, participate in exams, or communicate with us. This includes your name, email address, and academic performance data.</p>

          <h2 className="text-xl font-bold text-primary-foreground mt-8 mb-4">Proctoring Data</h2>
          <p>During a proctored exam, the platform may record webcam video, microphone audio, and screen activity. This data is strictly used for ensuring academic integrity and is only accessible to authorized administrators from your institution. It is automatically deleted in accordance with your institution's data retention policies.</p>

          <h2 className="text-xl font-bold text-primary-foreground mt-8 mb-4">Data Security</h2>
          <p>We implement enterprise-grade security measures to maintain the safety of your personal information. All sensitive information is transmitted via Secure Socket Layer (SSL) technology and encrypted in our databases.</p>
        </div>
      </div>
    </div>
  );
}