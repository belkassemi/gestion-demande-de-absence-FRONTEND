import React from 'react';
import Sidebar from './Sidebar';
import { Search, Bell } from 'lucide-react';

export default function AppLayout({ title, children, actions }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar flex items-center justify-between" style={{ padding: '0 2rem' }}>
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold tracking-tight text-text-primary">{title}</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-surface-alt px-3 py-1.5 rounded-full border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <Search size={16} className="text-text-light mr-2" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="bg-transparent border-none outline-none text-sm text-text-primary w-48 placeholder:text-text-light"
              />
            </div>
            
            <button className="relative text-text-secondary hover:text-primary transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
            </button>
            
            <div className="flex items-center gap-3 border-l border-border pl-6">
              {actions}
            </div>
          </div>
        </header>
        <main className="page animate-in" style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
