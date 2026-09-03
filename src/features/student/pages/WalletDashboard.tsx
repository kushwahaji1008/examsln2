import React, { useState, useEffect } from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight, Clock, PlusCircle } from 'lucide-react';
import { getWalletBalance } from '@/services/api/walletApi';

export default function WalletDashboard() {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    getWalletBalance().then(setBalance).catch(() => {});
  }, []);

  const transactions = [
    { id: 'tx1', date: '2026-08-29 14:30', amount: 50.00, type: 'credit', description: 'Added funds via Credit Card' },
    { id: 'tx2', date: '2026-08-25 10:15', amount: 19.99, type: 'debit', description: 'Purchased: Advanced React Patterns' },
    { id: 'tx3', date: '2026-08-20 09:00', amount: 100.00, type: 'credit', description: 'Referral Bonus' },
    { id: 'tx4', date: '2026-08-15 16:45', amount: 25.00, type: 'debit', description: 'Purchased: Figma for Developers' },
    { id: 'tx5', date: '2026-08-10 11:20', amount: 200.00, type: 'credit', description: 'Initial Deposit' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8 font-sans text-foreground pb-16">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <Wallet className="h-8 w-8 text-emerald-500" />
          Wallet Dashboard
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Manage your funds and track your course purchases.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Balance Card */}
        <div className="md:col-span-1 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Wallet className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="text-emerald-100 font-semibold mb-2">Available Balance</div>
            <div className="text-5xl font-black mb-6">
              {(balance !== null && balance !== undefined) ? `₹${balance.toFixed(2)}` : 'Loading...'}
            </div>
            <button className="flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition shadow-sm">
              <PlusCircle className="w-5 h-5" /> Add Funds
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="md:col-span-2 grid gap-6 sm:grid-cols-2">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <span className="font-semibold text-muted-foreground">Total Added</span>
            </div>
            <div className="text-3xl font-bold text-foreground">₹1550.00</div>
          </div>
          
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <ArrowDownRight className="w-5 h-5" />
              </div>
              <span className="font-semibold text-muted-foreground">Total Spent</span>
            </div>
            <div className="text-3xl font-bold text-foreground">₹300.00</div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground">
            <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-secondary/30 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" /> {tx.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{tx.description}</td>
                  <td className="px-6 py-4">
                    {tx.type === 'credit' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        <ArrowUpRight className="w-3.5 h-3.5" /> Credit
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                        <ArrowDownRight className="w-3.5 h-3.5" /> Debit
                      </span>
                    )}
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${tx.type === 'credit' ? 'text-emerald-500' : 'text-foreground'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Stub */}
        <div className="p-4 border-t border-border bg-secondary/20 flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing 1 to 5 of 24 entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded border border-border bg-background hover:bg-secondary transition disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 rounded border border-border bg-background hover:bg-secondary transition">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
