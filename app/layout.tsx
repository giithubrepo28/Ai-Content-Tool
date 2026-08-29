import './globals.css';

export const metadata = {
  title: 'Elaria — Anime Fantasy Stories',
  description: 'A premium anime-inspired fantasy reading universe.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
