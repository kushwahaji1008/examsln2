import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-20 px-4 flex items-center justify-center">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold text-primary-foreground tracking-tight mb-4">Get in Touch</h1>
            <p className="text-slate-400">Have questions about our platform, pricing, or enterprise solutions? Our team is here to help.</p>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-slate-300">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-border/10 flex items-center justify-center"><Mail className="w-5 h-5 text-sky-400" /></div>
              <span>support@examsolution.com</span>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-border/10 flex items-center justify-center"><Phone className="w-5 h-5 text-emerald-400" /></div>
              <span>+1 (800) 123-4567</span>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-border/10 flex items-center justify-center"><MapPin className="w-5 h-5 text-rose-400" /></div>
              <span>123 Innovation Drive, Tech City, TC 90210</span>
            </div>
          </div>
        </div>

        <form className="bg-slate-900/80 border border-border/10 p-8 rounded-3xl backdrop-blur-xl space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Name</label>
            <input type="text" className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email</label>
            <input type="email" className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" placeholder="john@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Message</label>
            <textarea rows={4} className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-200 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 resize-none" placeholder="How can we help?" />
          </div>
          <button type="button" className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-sky-400">
            <Send className="w-4 h-4" /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
}