// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AppMenu from '@/components/AppMenu/AppMenu';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Одноклассники',
  description: 'Социальная сеть для выпускников школы',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{margin: 0}} className={inter.className}>
        <AppMenu />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}