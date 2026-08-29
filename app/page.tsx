'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type Tool = { id: string; icon: string; name: string; description: string; placeholder: string };

const tools: Tool[] = [
  { id: 'article', icon: '✍️', name: 'AI Article / Blog', description: 'Long-form articles with structure and headings.', placeholder: 'e.g. How AI is changing small businesses' },
  { id: 'social', icon: '📱', name: 'Social Post / Caption', description: 'Engaging posts, captions and hashtags.', placeholder: 'e.g. Launch of our new coffee shop' },
  { id: 'ad', icon: '📢', name: 'Ad Copy', description: 'Headlines, primary text and calls to action.', placeholder: 'e.g. Budget wireless headphones' },
  { id: 'rewrite', icon: '🔄', name: 'Rewrite / Paraphrase', description: 'Make existing text clearer and more engaging.', placeholder: 'Paste the text you want to rewrite' },
  { id: 'seo', icon: '🎯', name: 'SEO Content', description: 'Titles, meta descriptions, outlines and keywords.', placeholder: 'e.g. Best home workout equipment' },
  { id: 'product', icon: '📝', name: 'Product Description', description: 'Benefit-focused ecommerce descriptions.', placeholder: 'e.g. Stainless steel insulated water bottle' },
];

const languages = ['English', 'Urdu', 'Roman Urdu'];
const tones = ['Professional', 'Friendly', 'Persuasive', 'Casual', 'Creative'];
const STORAGE_KEY = 'ai-content-tool-user';

function localGenerate(tool: Tool, input: string, language: string, tone: string) {
  const subject = input.trim() || 'your topic';
  const prefix = language === 'Urdu' ? 'یہ آپ کے موضوع کے لیے تیار کردہ مواد ہے' : language === 'Roman Urdu' ? 'Yeh aap ke topic ke liye tayyar kiya gaya content hai' : `Here is content created for ${subject}`;
  if (tool.id === 'article') return `# ${subject}\n\n${prefix}.\n\n## Introduction\n\nThis article explains the most useful ideas, benefits and practical considerations around ${subject}. The goal is to give readers clear information they can act on.\n\n## Key Points\n\n• What ${subject} means and why it matters\n• Important benefits and practical use cases\n• Tips, examples and best practices\n• Common mistakes to avoid\n\n## Practical Takeaways\n\nStart with a clear goal, focus on the audience, use simple language and measure the result.\n\n## Conclusion\n\n${subject} can create meaningful value when approached with a clear strategy and consistent execution.\n\nTone: ${tone}`;
  if (tool.id === 'social') return `🚀 ${subject}\n\n${prefix}. Share the value, highlight one strong benefit and invite your audience to take the next step.\n\n#AI #Content #Marketing #${subject.replace(/\W+/g, '')}`;
  if (tool.id === 'ad') return `HEADLINE: ${subject} made simple\n\nPRIMARY TEXT: Discover a smarter way to get more value from ${subject}. Clear benefits, simple messaging and a strong reason to act today.\n\nCTA: Get Started`;
  if (tool.id === 'rewrite') return `Rewritten version:\n\n${subject}\n\nThis version is clearer, smoother and more engaging while keeping the original meaning. Tone: ${tone}.`;
  if (tool.id === 'seo') return `SEO TITLE: ${subject} — Complete Guide\n\nMETA DESCRIPTION: Learn what you need to know about ${subject}, including benefits, practical tips and best practices.\n\nKEYWORDS: ${subject}, guide, benefits, tips, best practices\n\nOUTLINE:\n1. What is ${subject}?\n2. Main benefits\n3. How it works\n4. Best practices\n5. Common mistakes\n6. Conclusion`;
  return `${subject}\n\nDiscover the practical value of ${subject}. Designed to clearly communicate features, benefits and customer value in a concise, persuasive format.\n\nFEATURES\n• Clear benefit-focused messaging\n• Easy-to-understand presentation\n• Suitable for ecommerce listings\n\nWHY BUY\nA strong product description helps customers understand what makes the product useful and why it is worth choosing.`;
}

export default function Home() {
  const [selected, setSelected] = useState('article');
  const [language, setLanguage] = useState('English');
  const [tone, setTone] = useState('Professional');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [showAccount, setShowAccount] = useState(false);
  const [used, setUsed] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const tool = useMemo(() => tools.find((item) => item.id === selected) || tools[0], [selected]);
  const remaining = Math.max(0, 10 - used);

  useEffect(() => {
    setUser(localStorage.getItem(STORAGE_KEY) || '');
    setUsed(Number(localStorage.getItem('ai-content-tool-usage') || 0));
    setHistory(JSON.parse(localStorage.getItem('ai-content-tool-history') || '[]'));
  }, []);

  function saveAccount(event: FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;
    localStorage.setItem(STORAGE_KEY, email.trim());
    setUser(email.trim());
    setShowAccount(false);
  }

  async function generate() {
    if (!input.trim() || remaining <= 0) return;
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: tool.id, input, language, tone }),
      });
      const data = await response.json();
      const text = data.content || localGenerate(tool, input, language, tone);
      setOutput(text);
      const next = used + 1;
      setUsed(next);
      localStorage.setItem('ai-content-tool-usage', String(next));
      const nextHistory = [text, ...history].slice(0, 10);
      setHistory(nextHistory);
      localStorage.setItem('ai-content-tool-history', JSON.stringify(nextHistory));
    } catch {
      setOutput(localGenerate(tool, input, language, tone));
    } finally { setLoading(false); }
  }

  function copy() { if (output) navigator.clipboard?.writeText(output); }
  function download() {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = 'ai-content.txt'; a.click(); URL.revokeObjectURL(url);
  }
  function clearAccount() { localStorage.removeItem(STORAGE_KEY); setUser(''); setEmail(''); }

  return <main className="container">
    <header className="header">
      <div className="brand"><span className="brandMark">✦</span><div><strong>AI Content Tool</strong><small>Write smarter. Grow faster.</small></div></div>
      <div className="headerRight"><span className="usage">Free · {remaining} generations left</span><button className="accountButton" onClick={() => setShowAccount(true)}>{user ? 'Account' : 'Sign in'}</button></div>
    </header>

    <section className="hero"><span className="eyebrow">FREE AI CONTENT WORKSPACE</span><h1>Create content in seconds.</h1><p>Articles, social posts, ads, SEO copy, rewrites and product descriptions — all in one simple workspace.</p></section>

    <section className="toolGrid">{tools.map((item) => <button key={item.id} className={`toolCard ${selected === item.id ? 'active' : ''}`} onClick={() => { setSelected(item.id); setOutput(''); }}><span className="toolIcon">{item.icon}</span><span><strong>{item.name}</strong><small>{item.description}</small></span></button>)}</section>

    <section className="workspace">
      <div className="workspaceHeader"><div><span className="eyebrow">CONTENT GENERATOR</span><h2>{tool.name}</h2></div><span className="freePill">🆓 Free</span></div>
      <div className="formGrid">
        <div className="field wide"><label>Topic, product or text</label><textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={tool.placeholder} /></div>
        <div className="sideFields"><div className="field"><label>Language</label><select value={language} onChange={(e) => setLanguage(e.target.value)}>{languages.map((x) => <option key={x}>{x}</option>)}</select></div><div className="field"><label>Tone</label><select value={tone} onChange={(e) => setTone(e.target.value)}>{tones.map((x) => <option key={x}>{x}</option>)}</select></div></div>
      </div>
      <div className="actions"><button className="primary" disabled={!input.trim() || remaining === 0 || loading} onClick={generate}>{loading ? 'Generating…' : '✨ Generate Content'}</button><button className="secondary" disabled={!output} onClick={copy}>Copy</button><button className="secondary" disabled={!output} onClick={download}>Export .txt</button></div>
      <div className="outputBox"><div className="outputTop"><strong>Generated content</strong>{output && <span>{output.length.toLocaleString()} characters</span>}</div><pre>{output || 'Your generated content will appear here.'}</pre></div>
    </section>

    <section className="bottomGrid"><div className="infoCard"><span>👤</span><div><strong>{user ? `Signed in as ${user}` : 'Optional account'}</strong><p>Create a local account profile to keep your workspace identity and history on this device.</p></div></div><div className="infoCard"><span>📚</span><div><strong>Recent generations</strong><p>{history.length ? `${history.length} saved locally in this browser.` : 'Your recent generated content will appear here.'}</p></div></div></section>

    {showAccount && <div className="modalBackdrop" onClick={() => setShowAccount(false)}><div className="modal" onClick={(e) => e.stopPropagation()}><button className="close" onClick={() => setShowAccount(false)}>×</button><h2>Free Account</h2><p>Use an email to create your local profile. No password is required in this free MVP.</p><form onSubmit={saveAccount}><input type="email" value={email || user} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /><button className="primary" type="submit">Save Account</button></form>{user && <button className="danger" onClick={clearAccount}>Remove account</button>}</div></div>}
  </main>;
}
