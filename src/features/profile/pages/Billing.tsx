import React, { useState } from 'react';
import { CreditCard, Receipt, Download, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';

export default function Billing() {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<'Student Starter' | 'Pro Learner' | 'Enterprise Access'>('Pro Learner');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const [invoices] = useState([
    { id: 'INV-2026-001', date: 'Aug 01, 2026', amount: '$49.00', status: 'Paid', plan: 'Pro Learner' },
    { id: 'INV-2026-002', date: 'Jul 01, 2026', amount: '$49.00', status: 'Paid', plan: 'Pro Learner' },
    { id: 'INV-2026-003', date: 'Jun 01, 2026', amount: '$49.00', status: 'Paid', plan: 'Pro Learner' },
  ]);

  const handleDownloadInvoice = (inv: typeof invoices[0]) => {
    // Generate simple text receipt download
    const content = `=====================================\nPLATFORM INVOICE & RECEIPT\n=====================================\nInvoice ID: ${inv.id}\nDate: ${inv.date}\nAmount: ${inv.amount}\nStatus: ${inv.status}\nAccount: ${user?.email || 'user@example.com'}\nPlan: ${inv.plan}\n=====================================\nThank you for using our learning platform!\n`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSelectPlan = (planName: 'Student Starter' | 'Pro Learner' | 'Enterprise Access') => {
    setCurrentPlan(planName);
    setIsUpgrading(false);
    setSuccessNotice(`Successfully changed subscription plan to ${planName}!`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 font-sans text-foreground pb-12">
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-extrabold text-primary-foreground tracking-tight">Billing & Subscriptions</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your active subscription plan, payment methods, and download billing invoices.</p>
      </div>

      {successNotice && (
        <div className="flex items-center gap-3 p-4 bg-emerald-100 border border-emerald-200 rounded-2xl text-emerald-600 text-sm">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Current Plan */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-3xl bg-card shadow-sm border border-primary/30 p-8 shadow-sm  backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary text-primary-foreground/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-primary-foreground flex items-center gap-2.5">
                  {currentPlan} <span className="text-xs bg-emerald-100 text-emerald-600 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-200">Active</span>
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Next scheduled billing date: Sept 01, 2026</p>
                <p className="text-xs text-muted-foreground mt-0.5 font-mono">Billed to: {user?.email || 'user@example.com'}</p>
              </div>
              <div className="text-3xl font-extrabold text-primary-foreground">
                {currentPlan === 'Student Starter' ? '$19' : currentPlan === 'Enterprise Access' ? '$99' : '$49'}
                <span className="text-sm text-muted-foreground font-medium">/mo</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => setIsUpgrading(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold transition shadow-sm "
              >
                Change Plan
              </button>
              <button 
                onClick={() => {
                  if (confirm('Are you sure you want to cancel automatic renewal?')) {
                    setSuccessNotice('Your subscription auto-renewal has been paused.');
                    setTimeout(() => setSuccessNotice(null), 4000);
                  }
                }}
                className="bg-secondary hover:bg-secondary/80 text-foreground border border-border px-5 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                Cancel Subscription
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-3xl bg-card shadow-sm border border-border p-8 backdrop-blur-xl shadow-sm">
            <h3 className="text-lg font-bold text-primary-foreground mb-4 border-b border-border pb-4">Payment Method</h3>
            <div className="flex items-center justify-between bg-background border border-border p-4 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-3 rounded-xl border border-border"><CreditCard className="w-6 h-6 text-primary" /></div>
                <div>
                  <p className="text-sm font-bold text-primary-foreground">Visa ending in 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/28 • Default Payment Method</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  alert('Card details update modal opened. Card is active.');
                }}
                className="text-sm text-primary font-bold hover:text-primary/80 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground/10 hover:bg-primary text-primary-foreground/20 transition"
              >
                Edit Card
              </button>
            </div>
          </div>
        </div>

        {/* Invoices */}
        <div className="rounded-3xl bg-card shadow-sm border border-border p-8 backdrop-blur-xl h-fit shadow-sm">
          <h3 className="text-lg font-bold text-primary-foreground mb-4 border-b border-border pb-4">Recent Invoices</h3>
          <div className="space-y-3">
            {invoices.map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-3.5 hover:bg-secondary rounded-2xl border border-border transition">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-secondary text-muted-foreground">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{inv.amount}</p>
                    <p className="text-xs text-muted-foreground">{inv.date}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDownloadInvoice(inv)}
                  className="p-2.5 rounded-xl bg-secondary text-muted-foreground hover:text-primary hover:bg-primary text-primary-foreground/10 transition" 
                  title="Download Receipt"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plan selection modal */}
      {isUpgrading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-primary-foreground">Choose your subscription plan</h2>
              <p className="text-xs text-muted-foreground mt-1">Upgrade or modify your learning subscription anytime.</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { name: 'Student Starter', price: '$19', desc: 'Basic access to video courses and practice questions' },
                { name: 'Pro Learner', price: '$49', desc: 'Full access to AI proctored exams, live classes & certificates' },
                { name: 'Enterprise Access', price: '$99', desc: 'Unlimited mock exams, 1-on-1 tutoring sessions & priority grading' },
              ].map(tier => (
                <div 
                  key={tier.name}
                  className={`p-5 rounded-2xl border flex flex-col justify-between ${
                    currentPlan === tier.name 
                      ? 'border-primary bg-primary text-primary-foreground/10 shadow-sm' 
                      : 'border-border bg-background'
                  }`}
                >
                  <div>
                    <h4 className="text-base font-bold text-primary-foreground">{tier.name}</h4>
                    <p className="text-2xl font-extrabold text-primary-foreground mt-2">{tier.price}<span className="text-xs text-muted-foreground font-normal">/mo</span></p>
                    <p className="text-xs text-muted-foreground mt-3">{tier.desc}</p>
                  </div>
                  <button
                    onClick={() => handleSelectPlan(tier.name as any)}
                    className={`w-full mt-6 py-2 rounded-xl text-xs font-bold transition ${
                      currentPlan === tier.name
                        ? 'bg-emerald-500 text-white text-primary-foreground cursor-default'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90 text-primary-foreground'
                    }`}
                  >
                    {currentPlan === tier.name ? 'Current Plan' : 'Select Plan'}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setIsUpgrading(false)}
                className="px-6 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}