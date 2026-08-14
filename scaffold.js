const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'apps', 'web', 'src', 'app');

const pagesToCreate = [
  // Explorer Flow
  { path: 'explorer/map', name: 'In-App Map', type: 'page' },
  { path: 'explorer/radar', name: 'Live Radar', type: 'page' },
  { path: 'explorer/reels', name: 'Foodie Reels', type: 'page' },
  { path: 'explorer/collections', name: 'Saved Collections', type: 'page' },
  { path: 'restaurant/[id]', name: 'Restaurant Menu', type: 'page' },
  { path: 'checkout', name: 'Checkout', type: 'page' },
  { path: 'orders', name: 'Orders', type: 'page' },
  
  // Dashboard Flow
  { path: 'dashboard', name: 'Dashboard Layout', type: 'layout' },
  { path: 'dashboard', name: 'Restaurant Dashboard', type: 'page' },
  { path: 'dashboard/orders', name: 'Manage Orders', type: 'page' },
  { path: 'dashboard/menu', name: 'Manage Menu', type: 'page' },
  { path: 'dashboard/kitchen', name: 'Kitchen Display', type: 'page' },
  { path: 'dashboard/settings', name: 'Restaurant Settings', type: 'page' },
  
  // Driver Flow
  { path: 'driver', name: 'Driver Layout', type: 'layout' },
  { path: 'driver', name: 'Driver Hub', type: 'page' },
  { path: 'driver/map', name: 'Driver Navigation', type: 'page' },
  { path: 'driver/earnings', name: 'Earnings', type: 'page' },
  { path: 'driver/settings', name: 'Driver Profile', type: 'page' },
];

const generatePageContent = (name) => {
  return `'use client';

import React from 'react';

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8 bg-[#111]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">${name}</h1>
        <p className="text-gray-400">This is a skeleton page for ${name}.</p>
      </div>
    </div>
  );
}
`;
};

const generateLayoutContent = (name) => {
  return `import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Skeleton layout header */}
      <header className="p-4 bg-[#111] border-b border-[#333]">
        <h2 className="text-xl font-bold">${name} Placeholder Layout</h2>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}
`;
};

pagesToCreate.forEach((item) => {
  const dirPath = path.join(basePath, item.path);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const fileName = item.type === 'layout' ? 'layout.tsx' : 'page.tsx';
  const filePath = path.join(dirPath, fileName);
  
  if (!fs.existsSync(filePath)) {
    const content = item.type === 'layout' ? generateLayoutContent(item.name) : generatePageContent(item.name);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Created: ${filePath}`);
  } else {
    console.log(`Skipped (already exists): ${filePath}`);
  }
});

console.log('All scaffolding complete!');
