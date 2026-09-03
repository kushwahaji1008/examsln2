import React, { useState } from 'react';
import { LifeBuoy, Plus, CheckCircle2, Clock, X } from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  description: string;
  status: 'In Progress' | 'Resolved' | 'Open';
  createdAt: string;
}

export default function Support() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('technical');
  const [description, setDescription] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const saved = localStorage.getItem('user_support_tickets');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: '1042',
        subject: 'Webcam device check during proctored exam launch',
        category: 'Proctoring',
        description: 'Unable to start camera feed during pre-exam verification test.',
        status: 'In Progress',
        createdAt: '2 hours ago'
      },
      {
        id: '0981',
        subject: 'Account time zone configuration and exam reminder scheduling',
        category: 'Account',
        description: 'Need to sync timezone with local UTC+2 zone.',
        status: 'Resolved',
        createdAt: 'Aug 01, 2026'
      }
    ];
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    const newTicket: Ticket = {
      id: String(Math.floor(1000 + Math.random() * 9000)),
      subject: subject.trim(),
      category: category.toUpperCase(),
      description: description.trim(),
      status: 'Open',
      createdAt: 'Just now'
    };

    const updated = [newTicket, ...tickets];
    setTickets(updated);
    try {
      localStorage.setItem('user_support_tickets', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    setSubject('');
    setDescription('');
    setIsModalOpen(false);
    setSuccessMsg(`Ticket #${newTicket.id} created successfully! Our support staff will respond shortly.`);
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 font-sans pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-primary-foreground tracking-tight">Support Desk</h1>
          <p className="text-sm text-slate-400 mt-1">Get fast help with proctored exams, technical issues, or platform billing.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 px-5 py-2.5 text-sm font-bold text-primary-foreground transition shadow-lg shadow-sky-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Open New Ticket
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-primary-foreground mb-2">My Support Requests ({tickets.length})</h2>
          
          {tickets.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400">
              <LifeBuoy className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-medium">No open tickets. Need help? Click "Open New Ticket" above.</p>
            </div>
          ) : (
            tickets.map((t) => (
              <div 
                key={t.id} 
                className={`bg-slate-900/80 border border-border/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-sky-500/30 transition shadow-lg ${
                  t.status === 'Resolved' ? 'opacity-75 hover:opacity-100' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 p-2 rounded-xl ${
                    t.status === 'Resolved' 
                      ? 'bg-slate-800 text-slate-400' 
                      : t.status === 'In Progress'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                  }`}>
                    {t.status === 'Resolved' ? <CheckCircle2 className="w-5 h-5" /> : t.status === 'In Progress' ? <Clock className="w-5 h-5" /> : <LifeBuoy className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-primary-foreground">{t.subject}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{t.description}</p>
                    <p className="text-xs text-slate-500 mt-2 font-mono">Ticket #{t.id} • {t.createdAt}</p>
                  </div>
                </div>

                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold shrink-0 self-start sm:self-center ${
                  t.status === 'Resolved'
                    ? 'bg-slate-800 border border-slate-700 text-slate-400'
                    : t.status === 'In Progress'
                    ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                    : 'bg-sky-500/10 border border-sky-500/20 text-sky-400'
                }`}>
                  {t.status}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-border/10 rounded-3xl p-6 backdrop-blur-xl shadow-lg">
            <h3 className="text-sm font-bold text-primary-foreground uppercase tracking-wider mb-4">Knowledge Base FAQs</h3>
            <ul className="space-y-3">
              <li><a href="#proctoring" onClick={(e) => { e.preventDefault(); alert('AI Proctoring monitors camera and audio to ensure assessment integrity.'); }} className="text-sm text-sky-400 hover:underline block">How does AI proctoring work?</a></li>
              <li><a href="#requirements" onClick={(e) => { e.preventDefault(); alert('System requirements: Modern Chrome/Firefox browser with active camera and microphone.'); }} className="text-sm text-sky-400 hover:underline block">System requirements for exams</a></li>
              <li><a href="#reset" onClick={(e) => { e.preventDefault(); alert('To reset your password, visit the login page and click Forgot Password.'); }} className="text-sm text-sky-400 hover:underline block">Resetting your account password</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-border/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-extrabold text-primary-foreground mb-1">Create Support Ticket</h2>
            <p className="text-xs text-slate-400 mb-6">Describe your inquiry and our support engineering team will assist you.</p>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950/80 border border-border/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-sky-500"
                >
                  <option value="technical">Technical / System Issue</option>
                  <option value="proctoring">Exam & Proctoring Issue</option>
                  <option value="billing">Billing & Subscriptions</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Subject</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Cannot connect webcam on test start"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950/80 border border-border/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Description</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Please provide details, error messages, and browser version..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950/80 border border-border/10 rounded-xl p-4 text-sm text-slate-200 outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-sm font-bold text-primary-foreground shadow-lg shadow-sky-500/20"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}