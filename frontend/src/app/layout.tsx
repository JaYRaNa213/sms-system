import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Internal Bulk SMS Platform',
  description: 'Professional bulk SMS management platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
