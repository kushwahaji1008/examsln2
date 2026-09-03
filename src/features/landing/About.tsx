import React from 'react';
import { Shield, BookOpen, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground tracking-tight">About ExamSolution</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            We are revolutionizing how institutions evaluate knowledge by providing secure, scalable, and intelligent assessment tools.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-900/80 border border-border/10 p-8 rounded-3xl backdrop-blur-xl text-center">
            <div className="mx-auto w-12 h-12 bg-sky-500/10 text-sky-400 flex items-center justify-center rounded-2xl mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-primary-foreground mb-2">Secure</h3>
            <p className="text-sm text-slate-400">Advanced AI proctoring and browser lockdown ensures academic integrity.</p>
          </div>
          <div className="bg-slate-900/80 border border-border/10 p-8 rounded-3xl backdrop-blur-xl text-center">
            <div className="mx-auto w-12 h-12 bg-indigo-500/10 text-indigo-400 flex items-center justify-center rounded-2xl mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-primary-foreground mb-2">Accessible</h3>
            <p className="text-sm text-slate-400">Built for scale, supporting thousands of concurrent test-takers globally.</p>
          </div>
          <div className="bg-slate-900/80 border border-border/10 p-8 rounded-3xl backdrop-blur-xl text-center">
            <div className="mx-auto w-12 h-12 bg-emerald-500/10 text-emerald-400 flex items-center justify-center rounded-2xl mb-6">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-primary-foreground mb-2">Insightful</h3>
            <p className="text-sm text-slate-400">Deep analytics help educators understand performance gaps and improve content.</p>
          </div>
        </div>
      </div>
    </div>
  );
}