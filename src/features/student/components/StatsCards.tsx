import React from 'react';
import { Wallet, BookOpen, Bell } from 'lucide-react';

interface StatsCardsProps {
  walletBalance?: number;
  totalEnrolled?: number;
  unreadNotifications?: number;
}

export default function StatsCards({ 
  walletBalance = 1250, 
  totalEnrolled = 0, 
  unreadNotifications = 0 
}: StatsCardsProps) {
  
  const stats = [
    {
      label: 'Wallet Balance',
      value: `₹${walletBalance.toFixed(2)}`,
      icon: Wallet,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Enrolled Courses',
      value: totalEnrolled,
      icon: BookOpen,
      color: 'text-sky-500',
      bg: 'bg-sky-500/10',
    },
    {
      label: 'Unread Notifications',
      value: unreadNotifications,
      icon: Bell,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1 h-full">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div 
            key={idx} 
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition hover:shadow-sm"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
