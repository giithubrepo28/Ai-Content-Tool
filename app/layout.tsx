import './globals.css';

export const metadata = {
  title: 'AI Content Tool — Free AI Writing Workspace',
  description: 'Create articles, social posts, ad copy, SEO content, rewrites and product descriptions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
