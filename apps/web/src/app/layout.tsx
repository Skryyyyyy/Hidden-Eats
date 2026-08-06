import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght,wdth,slnt,GRAD,ROND@6..144,1..1000,25..151,-10..0,0..100,0..100&display=swap"
        />
      </head>
      <body className="antialiased text-body bg-[#FAF6F0] text-[#181512]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
