import './globals.css';

export const metadata = {
  title: 'AI Content Tool',
  description: 'Create articles, social posts, ads, SEO content and more with AI.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
