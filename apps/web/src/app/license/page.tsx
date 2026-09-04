'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Copy, Shield, FileText, Scale, Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const MIT_LICENSE_TEXT = `MIT License

Copyright (c) 2026 Hidden Eats

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

export default function LicensePage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(MIT_LICENSE_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-white selection:bg-[#f8b11c]/30 selection:text-white relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#f8b11c]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navigation */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/explorer"
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#f8b11c] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Explorer
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-black">
              Open Source • MIT
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#f8b11c]">
            <Scale className="w-3.5 h-3.5" /> Legal & Open Source Licensing
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            MIT License
          </h1>
          <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
            Hidden Eats is an open-source platform licensed under the standard, permissive{' '}
            <strong className="text-white">MIT License</strong>. You are free to use, modify, distribute, and build upon this software for personal or commercial projects.
          </p>
        </motion.div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#121318] border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Check className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Permissions</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Commercial use, modification, distribution, sublicensing, and private use are all fully permitted.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#121318] border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#f8b11c]/10 border border-[#f8b11c]/20 flex items-center justify-center text-[#f8b11c]">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Conditions</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              The original copyright notice and permission notice must be included in all substantial copies.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#121318] border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Limitations</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              The software is provided "as is", without warranty of any kind. Authors are not liable for any claims or damages.
            </p>
          </div>
        </div>

        {/* License Monospace Text Box */}
        <div className="bg-[#0f1015] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-gray-400">LICENSE.md</span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-200 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#f8b11c]" />
                  <span>Copy License</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-6 md:p-8 font-mono text-xs text-gray-300 leading-relaxed overflow-x-auto whitespace-pre-wrap selection:bg-[#f8b11c]/30">
            {MIT_LICENSE_TEXT}
          </pre>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 Hidden Eats. All open-source rights reserved under the MIT License.</p>
          <div className="flex items-center gap-4 font-bold">
            <Link href="/explorer" className="hover:text-white transition-colors">Explorer</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Partner Studio</Link>
            <Link href="/driver" className="hover:text-white transition-colors">Courier Portal</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
