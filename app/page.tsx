'use client';

import { useState } from 'react';

const tools = [
  ['✍️','AI Article / Blog','Write useful long-form articles and blog posts.'],
  ['📱','Social Posts','Create captions and posts for social platforms.'],
  ['📢','Ad Copy','Generate headlines, primary text and CTAs.'],
  ['🔄','Rewrite','Rewrite or paraphrase text in a fresh style.'],
  ['🎯','SEO Content','Create SEO-focused titles, outlines and copy.'],
  ['📝','Product Description','Turn product details into persuasive descriptions.']
];

const languages = ['English','Urdu','Roman Urdu'];

export default function Home() {
  const [tool, setTool] = useState(tools[0][1]);
  const [language, setLanguage] = useState('English');
  const [topic, setTopic] = useState('');
  const [output, setOutput] = useState('');

  function generate() {
    const name = topic.trim() || 'your topic';
    const samples: Record<string,string> = {
      'AI Article / Blog': `# ${name}\n\nIntroduction\n\nHere is a structured article about ${name}. Add your key points, examples, benefits and practical takeaways here.\n\n## Key Points\n\n• Explain the problem clearly\n• Share useful insights and examples\n• Give practical next steps\n\n## Conclusion\n\nSummarize the main value and provide a clear next action.`,
      'Social Posts': `🚀 ${name}\n\nTurn this idea into an engaging social post with a strong hook, useful value and a simple call to action.\n\n#Content #AI #Marketing`,
      'Ad Copy': `Headline: ${name} made simple\n\nPrimary text: Discover a faster way to communicate the value of ${name}. Clear, useful and built for action.\n\nCTA: Get Started`,
      'Rewrite': `Rewritten version of your text about ${name}:\n\nThis version keeps the original meaning while making the wording clearer, smoother and more engaging.`,
      'SEO Content': `SEO Title: ${name} — Complete Guide\nMeta Description: Learn the essentials of ${name}, key benefits, practical tips and what to consider before getting started.\n\nSuggested sections:\n1. What is ${name}?\n2. Main benefits\n3. Best practices\n4. Common mistakes\n5. Conclusion`,
      'Product Description': `${name}\n\nA clear, compelling product description highlighting the main features, benefits and customer value. Perfect for an online store listing.\n\nKey benefits:\n• Easy to understand\n• Benefit-focused copy\n• Clear call to action`
    };
    setOutput(`${samples[tool]}\n\nLanguage: ${language}\n\nNote: This is the Free-plan UI foundation. Connect an AI provider/API to generate live AI output.`);
  }

  function copy() { if (output) navigator.clipboard?.writeText(output); }
  function download() { if (!output) return; const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([output],{type:'text/plain'})); a.download='ai-content.txt'; a.click(); URL.revokeObjectURL(a.href); }

  return <main className="container">
    <header className="header"><div className="logo">AI Content Tool</div><span className="badge">🆓 Free Plan</span></header>
    <section className="hero"><h1>Create better content, faster.</h1><p>One simple workspace for articles, social posts, ads, SEO content, rewrites and product descriptions.</p></section>
    <section className="grid">{tools.map(([icon,name,desc]) => <button key={name} className={`card ${tool===name?'active':''}`} onClick={()=>setTool(name)}><div className="icon">{icon}</div><h3>{name}</h3><p>{desc}</p></button>)}</section>
    <section className="workspace">
      <h2>{tool}</h2>
      <div className="row">
        <div><label>Topic / product / text</label><textarea value={topic} onChange={e=>setTopic(e.target.value)} placeholder="What do you want to create?" /></div>
        <div><label>Language</label><select value={language} onChange={e=>setLanguage(e.target.value)}>{languages.map(x=><option key={x}>{x}</option>)}</select><p className="notice">Free plan supports English, Urdu and Roman Urdu. Live AI generation will be connected through the backend.</p></div>
      </div>
      <div className="actions"><button className="primary" onClick={generate}>✨ Generate Content</button><button className="secondary" onClick={copy}>Copy</button><button className="secondary" onClick={download}>Export .txt</button></div>
      <div className="output">{output || 'Your generated content will appear here.'}</div>
    </section>
    <p className="notice">Account, authentication, saved history and usage limits are planned as the next backend layer.</p>
  </main>;
}
