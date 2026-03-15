import React from 'react';
import Sidebar from './Sidebar';

export default function AppLayout({ title, children, actions }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <h1>{title}</h1>
          <div style={{ display:'flex', gap:'.75rem', alignItems:'center' }}>
            {actions}
          </div>
        </header>
        <main className="page animate-in">
          {children}
        </main>
      </div>
    </div>
  );
}
