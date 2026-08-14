import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Skeleton layout header */}
      <header className="p-4 bg-[#111] border-b border-[#333]">
        <h2 className="text-xl font-bold">Dashboard Layout Placeholder Layout</h2>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}
