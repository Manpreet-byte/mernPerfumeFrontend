import type { Metadata } from 'next'; import './globals.css'; import { Providers } from '@/components/providers'; import { SiteChrome } from '@/components/site-chrome';
export const metadata: Metadata = { title: 'AURELIA | Fine Fragrance', description: 'A curated world of exceptional perfume.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" suppressHydrationWarning><body><Providers><SiteChrome>{children}</SiteChrome></Providers></body></html>; }
