import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans text-foreground">
      
      {/* Sidebar Layout */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Layout */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <Header setSidebarOpen={setSidebarOpen} />
        
        {/* Page Content Scroll Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
}