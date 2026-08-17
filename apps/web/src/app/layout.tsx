import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { CartProvider } from '../context/CartContext';
import FlashcardSplash from '../components/FlashcardSplash';
import GlobalThemeToggle from '../components/GlobalThemeToggle';
import SmoothFollower from '../components/SmoothFollower';
import { LanguageProvider } from '../context/LanguageContext';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Hidden Eats — Food Discovery & Partner Dashboard',
  description: 'Discover hidden gems, off-menu secrets, and curated culinary collections.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark font-sans ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="antialiased text-body font-sans">
        <FlashcardSplash />
        <LanguageProvider>
          <ThemeProvider>
            <CartProvider>
              {children}
              <GlobalThemeToggle />
            </CartProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
