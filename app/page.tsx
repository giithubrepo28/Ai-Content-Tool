'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type Tool = { id: string; icon: string; name: string; description: string; placeholder: string };
type Saved = { id: string; tool: string; input: string; output: string; language: string; tone: string; favorite: boolean; createdAt: string };

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
const templates: Record<string, string[]> = {
  article: ['How-to guide', 'Listicle', 'Ultimate guide'], social: ['Product launch', 'Educational tip', 'Promotion'], ad: ['Product ad', 'Sale ad', 'Lead generation'],
  rewrite: ['Professional', 'Simple', 'Engaging'], seo: ['SEO guide', 'Product SEO', 'Local SEO'], product: ['Ecommerce', 'Premium product', 'Short listing']
};
const STORAGE_KEY = 'ai-content-tool-user'; const HISTORY_KEY = 'ai-content-tool-history'; const USAGE_KEY = 'ai-content-tool-usage';

function localGenerate(tool: Tool, input: string, language: string, tone: string) {
  const subject = input.trim() || 'your topic';
  const intro = language === 'Urdu' ? `یہ ${subject} کے بارے میں تیار کردہ مواد ہے۔` : language === 'Roman Urdu' ? `Yeh ${subject} ke baray mein tayyar kiya gaya content hai.` : `This is content created for ${subject}.`;
  if (tool.id === 'article') return `# ${subject}\n\n${intro}\n\n## Introduction\n\nThis article explains the most useful ideas, benefits and practical considerations around ${subject}.\n\n## Key Points\n\n• What ${subject} means and why it matters\n• Important benefits and practical use cases\n• Practical tips and best practices\n• Common mistakes to avoid\n\n## Practical Takeaways\n\nStart with a clear goal, focus on the audience, use simple language and measure the result.\n\n## Conclusion\n\n${subject} can create meaningful value with a clear strategy and consistent execution.\n\nTone: ${tone}`;
  if (tool.id === 'social') return `🚀 ${subject}\n\n${intro} Share the key benefit, use a strong hook and invite your audience to take the next step.\n\n#AI #Content #Marketing #${subject.replace(/\W+/g, '')}`;
  if (tool.id === 'ad') return `HEADLINE: ${subject} made simple\n\nPRIMARY TEXT: Discover a smarter way to get more value from ${subject}. Clear benefits, simple messaging and a reason to act today.\n\nCTA: Get Started`;
  if (tool.id === 'rewrite') return `Rewritten version:\n\n${input}\n\nThis version is clearer, smoother and more engaging while preserving the original meaning. Tone: ${tone}.`;
  if (tool.id === 'seo') return `SEO TITLE: ${subject} — Complete Guide\n\nMETA DESCRIPTION: Learn what you need to know about ${subject}, including benefits, practical tips and best practices.\n\nKEYWORDS: ${subject}, guide, benefits, tips, best practices\n\nOUTLINE:\n1. What is ${subject}?\n2. Main benefits\n3. How it works\n4. Best practices\n5. Common mistakes\n6. Conclusion`;
  return `${subject}\n\n${intro}\n\nFEATURES\n• Clear benefit-focused messaging\n• Easy-to-understand presentation\n• Suitable for ecommerce listings\n\nWHY BUY\nA strong product description helps customers understand what makes the product useful and why it is worth choosing.`;
}

export default function Home() {
  const [selected, setSelected] = useState('article'); const [language, setLanguage] = useState('English'); const [tone, setTone] = useState('Professional');
  const [input, setInput] = useState(''); const [output, setOutput] = useState(''); const [user, setUser] = useState(''); const [email, setEmail] = useState(''); const [showAccount, setShowAccount] = useState(false);
  const [used, setUsed] = useState(0); const [history, setHistory] = useState<Saved[]>([]); const [loading, setLoading] = useState(false); const [query, setQuery] = useState(''); const [dark, setDark] = useState(false);
  const tool = useMemo(() => tools.find((x) => x.id === selected) || tools[0], [selected]); const remaining = Math.max(0, 10 - used);
  useEffect(() => { setUser(localStorage.getItem(STORAGE_KEY) || ''); setUsed(Number(localStorage.getItem(USAGE_KEY) || 0)); try { setHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')); } catch { setHistory([]); } }, []);
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; }, [dark]);
  function saveHistory(item: Saved) { const next = [item, ...history].slice(0, 30); setHistory(next); localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); }
  function saveAccount(event: FormEvent) { event.preventDefault(); if (!email.trim()) return; localStorage.setItem(STORAGE_KEY, email.trim()); setUser(email.trim()); setShowAccount(false); }
  async function generate() { if (!input.trim() || remaining <= 0) return; setLoading(true); try { const r = await fetch('/api/generate', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ tool:tool.id,input,language,tone }) }); const data = await r.json(); const text = data.content || localGenerate(tool,input,language,tone); setOutput(text); const next=used+1; setUsed(next); localStorage.setItem(USAGE_KEY,String(next)); saveHistory({id:crypto.randomUUID(),tool:tool.name,input,output:text,language,tone,favorite:false,createdAt:new Date().toISOString()}); } catch { const text=localGenerate(tool,input,language,tone); setOutput(text); } finally { setLoading(false); } }
  function transform(kind:string) { if (!output) return; let text=output; if(kind==='shorten') text=output.split('\n').filter(Boolean).slice(0,Math.max(3,Math.ceil(output.split('\n').filter(Boolean).length/2))).join('\n'); if(kind==='expand') text=output+'\n\nAdditional detail:\nAdd examples, practical steps, audience-specific benefits and a clear next action to make this content more useful.'; if(kind==='clean') text=output.replace(/\s+$/gm,'').replace(/\n{3,}/g,'\n\n'); setOutput(text); }
  function copy() { if(output) navigator.clipboard?.writeText(output); }
  function download() { if(!output)return; const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([output],{type:'text/plain;charset=utf-8'})); a.download=`${selected}-content.txt`; a.click(); }
  function clearAll() { setInput(''); setOutput(''); }
  function selectHistory(item:Saved) { setSelected(tools.find(x=>x.name===item.tool)?.id||'article'); setInput(item.input); setOutput(item.output); setLanguage(item.language); setTone(item.tone); }
  function toggleFavorite(id:string) { const next=history.map(x=>x.id===id?{...x,favorite:!x.favorite}:x); setHistory(next); localStorage.setItem(HISTORY_KEY,JSON.stringify(next)); }
  function deleteHistory(id:string) { const next=history.filter(x=>x.id!==id); setHistory(next); localStorage.setItem(HISTORY_KEY,JSON.stringify(next)); }
  const filteredHistory=history.filter(x=>`${x.tool} ${x.input}`.toLowerCase().includes(query.toLowerCase()));
  return <main className="container">
    <header className="header"><div className="brand"><span className="brandMark">✦</span><div><strong>AI Content Tool</strong><small>Write smarter. Grow faster.</small></div></div><div className="headerRight"><span className="usage">Free · {remaining} generations left</span><button className="iconButton" onClick={()=>setDark(!dark)} title="Toggle theme">{dark?'☀️':'🌙'}</button><button className="accountButton" onClick={()=>setShowAccount(true)}>{user?'Account':'Sign in'}</button></div></header>
    <section className="hero"><span className="eyebrow">FREE AI CONTENT WORKSPACE</span><h1>Create content in seconds.</h1><p>Articles, social posts, ads, SEO copy, rewrites and product descriptions — all in one simple workspace.</p></section>
    <section className="toolGrid">{tools.map(item=><button key={item.id} className={`toolCard ${selected===item.id?'active':''}`} onClick={()=>{setSelected(item.id);setOutput('');}}><span className="toolIcon">{item.icon}</span><span><strong>{item.name}</strong><small>{item.description}</small></span></button>)}</section>
    <section className="workspace"><div className="workspaceHeader"><div><span className="eyebrow">CONTENT GENERATOR</span><h2>{tool.name}</h2></div><span className="freePill">🆓 Free</span></div>
      <div className="templateRow"><span>Quick templates:</span>{templates[selected].map(t=><button key={t} onClick={()=>setInput(`${t}: ${input}`.replace(/^([^:]+):\s*$/,'$1'))}>{t}</button>)}</div>
      <div className="formGrid"><div className="field wide"><label>Topic, product or text</label><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={tool.placeholder}/><div className="fieldMeta">{input.length} characters · {input.trim()?input.trim().split(/\s+/).length:0} words</div></div><div className="sideFields"><div className="field"><label>Language</label><select value={language} onChange={e=>setLanguage(e.target.value)}>{languages.map(x=><option key={x}>{x}</option>)}</select></div><div className="field"><label>Tone</label><select value={tone} onChange={e=>setTone(e.target.value)}>{tones.map(x=><option key={x}>{x}</option>)}</select></div></div></div>
      <div className="actions"><button className="primary" disabled={!input.trim()||remaining===0||loading} onClick={generate}>{loading?'Generating…':'✨ Generate Content'}</button><button className="secondary" disabled={!output} onClick={()=>transform('shorten')}>Shorten</button><button className="secondary" disabled={!output} onClick={()=>transform('expand')}>Expand</button><button className="secondary" disabled={!output} onClick={()=>transform('clean')}>Clean</button><button className="secondary" disabled={!output} onClick={copy}>Copy</button><button className="secondary" disabled={!output} onClick={download}>Export .txt</button><button className="secondary" onClick={clearAll}>Clear</button></div>
      <div className="outputBox"><div className="outputTop"><strong>Generated content</strong><span>{output?`${output.length.toLocaleString()} characters · ${output.trim().split(/\s+/).length} words`:'Ready'}</span></div><textarea className="editor" value={output} onChange={e=>setOutput(e.target.value)} placeholder="Your generated content will appear here. You can edit it before copying or exporting."/></div>
    </section>
    <section className="historySection"><div className="sectionHead"><div><span className="eyebrow">YOUR WORKSPACE</span><h2>Recent generations</h2></div><input className="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search history…"/></div>{filteredHistory.length?<div className="historyList">{filteredHistory.map(item=><div className="historyItem" key={item.id}><button className="historyMain" onClick={()=>selectHistory(item)}><strong>{item.tool}</strong><span>{item.input.slice(0,100)}{item.input.length>100?'…':''}</span><small>{new Date(item.createdAt).toLocaleString()} · {item.language} · {item.tone}</small></button><button className="star" onClick={()=>toggleFavorite(item.id)}>{item.favorite?'★':'☆'}</button><button className="delete" onClick={()=>deleteHistory(item.id)}>×</button></div>)}</div>:<div className="empty">No saved generations yet. Generate content and it will be kept locally on this device.</div>}</section>
    <section className="bottomGrid"><div className="infoCard"><span>👤</span><div><strong>{user?`Signed in as ${user}`:'Optional free account'}</strong><p>Keep a local workspace identity without payment or a password.</p></div></div><div className="infoCard"><span>🆓</span><div><strong>Free plan</strong><p>{used}/10 generations used. Payment and paid APIs are not included.</p></div></div></section>
    {showAccount&&<div className="modalBackdrop" onClick={()=>setShowAccount(false)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setShowAccount(false)}>×</button><h2>Free Account</h2><p>Create a local profile for this browser. No password or payment is required.</p><form onSubmit={saveAccount}><input type="email" value={email||user} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required/><button className="primary" type="submit">Save Account</button></form>{user&&<button className="danger" onClick={()=>{localStorage.removeItem(STORAGE_KEY);setUser('');setEmail('')}}>Remove account</button>}</div></div>}
  </main>;
}
