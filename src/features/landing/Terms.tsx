import React from 'react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-20 px-4">
      <div className="max-w-3xl mx-auto bg-slate-900/80 border border-border/10 p-8 sm:p-12 rounded-3xl backdrop-blur-xl space-y-8">
        <h1 className="text-3xl font-extrabold text-primary-foreground tracking-tight border-b border-border/10 pb-6">Terms of Service</h1>
        <div className="space-y-6 text-sm text-slate-400 leading-relaxed">
          <p>Last updated: August 4, 2026</p>
          
          <h2 className="text-xl font-bold text-primary-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using ExamSolution, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using the platform.</p>

          <h2 className="text-xl font-bold text-primary-foreground mt-8 mb-4">2. Academic Integrity</h2>
          <p>As a student using this platform, you agree to adhere to your institution's honor code. Any attempts to bypass security measures, manipulate results, or use unauthorized third-party software will be logged and reported to your institution.</p>

          <h2 className="text-xl font-bold text-primary-foreground mt-8 mb-4">3. Account Responsibilities</h2>
          <p>You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party.</p>
        </div>
      </div>
    </div>
  );
}