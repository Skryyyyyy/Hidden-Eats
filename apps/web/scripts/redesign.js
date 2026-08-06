const fs = require('fs');
const path = require('path');

const directory = 'C:\\Hidden Eats\\apps\\web\\src\\app\\dashboard';

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx') && !dirFile.includes('dashboard\\page.tsx')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
}

const files = walkSync(directory);

const replacements = [
  // Backgrounds
  { from: /bg-\[\#FFF8F1\]/g, to: 'bg-[#FAFAFA]' },
  { from: /bg-\[\#05070D\]/g, to: 'bg-[#0A0A0A]' },
  { from: /bg-\[\#FFF3E8\]/g, to: 'bg-[#F3F4F6]' },
  { from: /bg-\[\#261c07\]/g, to: 'bg-[#1A1A1A]' },
  { from: /bg-\[\#131A2C\]/g, to: 'bg-[#111111]' },
  
  // Header / Structural
  { from: /h-16/g, to: 'h-20' },
  { from: /px-6/g, to: 'px-8' },
  { from: /sm:p-10/g, to: 'sm:p-12' },
  { from: /p-6 sm:p-10/g, to: 'p-8 sm:p-12' },
  { from: /rounded-3xl/g, to: 'rounded-[32px]' },
  { from: /rounded-2xl/g, to: 'rounded-[24px]' },
  { from: /rounded-xl/g, to: 'rounded-2xl' },
  
  // Text Primary
  { from: /text-\[\#1F2937\]/g, to: 'text-[#111111]' },
  
  // Text Secondary
  { from: /text-\[\#6B7280\]/g, to: 'text-[#666666]' },
  
  // Brand colors -> Neutral Apple/Linear style
  { from: /bg-\[\#D62828\]/g, to: 'bg-[#111111]' },
  { from: /hover:bg-\[\#B91C1C\]/g, to: 'hover:bg-black' },
  { from: /text-\[\#D62828\]/g, to: 'text-[#111111]' },
  
  { from: /bg-\[\#FFB703\]/g, to: 'bg-white' },
  { from: /hover:bg-\[\#d97706\]/g, to: 'hover:bg-[#F3F4F6]' },
  { from: /text-\[\#FFB703\]/g, to: 'text-white' },
  
  // Shadows
  { from: /shadow-\[\#D62828\]\/25/g, to: 'shadow-black/10 hover:shadow-black/20' },
  { from: /shadow-\[\#FFB703\]\/25/g, to: 'shadow-white/10 hover:shadow-white/20' },
  { from: /shadow-\[\#D62828\]\/20/g, to: 'shadow-black/5' },
  { from: /shadow-\[\#FFB703\]\/20/g, to: 'shadow-white/5' },
  
  // Borders
  { from: /border-black\/8/g, to: 'border-black/5' },
  { from: /border-\[\#23314a\]/g, to: 'border-white/5' },
  
  // Typography tweaks for editorial feel
  { from: /text-3xl/g, to: 'text-4xl tracking-tight' },
  { from: /text-xs/g, to: 'text-[11px] uppercase tracking-widest font-bold' },
  { from: /text-sm/g, to: 'text-[13px]' },
  
  // specific overrides for buttons to look more linear/apple
  { from: /font-bold text-black/g, to: 'font-bold text-black' }, // Keep this just in case
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });

  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
