import React, { useState, useEffect } from 'react';
import { Menu, Bell, Search, Wallet } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { Link } from 'react-router-dom';
import { getWalletBalance } from '@/services/api/walletApi';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  const { user } = useAuth();
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  useEffect(() => {
    if (user && (user.role === 'Student' || user.role === 0)) {
      getWalletBalance().then(setWalletBalance).catch(() => {});
    }
  }, [user]);

  // Calculate initials for the avatar
  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0]?.toUpperCase())
        .slice(0, 2)
        .join('')
    : 'U';

  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 sm:px-6 lg:px-8 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Global Search */}
        <div className="hidden sm:flex relative w-64 lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search courses, live classes..." 
            className="w-full rounded-full border border-border bg-card pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Wallet Balance Indicator */}
        {(walletBalance !== null && walletBalance !== undefined) && (
          <Link to="/student/wallet" className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border hover:bg-secondary transition">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-foreground">₹{walletBalance.toFixed(2)}</span>
          </Link>
        )}

        {/* Notifications */}
        <Link 
          to="/notifications" 
          className="relative rounded-full p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-primary" />
        </Link>

        <div className="h-8 w-px bg-border hidden sm:block" />

        {/* Profile Avatar & Name */}
        <Link to="/profile" className="flex items-center gap-3 transition hover:opacity-80">
          <div className="hidden flex-col items-end sm:flex">
            <span className="text-sm font-bold text-foreground leading-none">{user?.fullName}</span>
            <span className="text-xs font-medium text-muted-foreground mt-1">Student</span>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm">
            {initials}
          </div>
        </Link>
      </div>
    </header>
  );
}
