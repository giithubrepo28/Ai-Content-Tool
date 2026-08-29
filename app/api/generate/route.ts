import { NextResponse } from 'next/server';

const fallback = (tool: string, input: string, language: string, tone: string) => {
  const subject = input.trim() || 'your topic';
  const common = language === 'Urdu' ? `یہ ${subject} کے بارے میں تیار کردہ مواد ہے۔` : language === 'Roman Urdu' ? `Yeh ${subject} ke baray mein tayyar kiya gaya content hai.` : `This is content created for ${subject}.`;
  switch (tool) {
    case 'article': return `# ${subject}\n\n${common}\n\n## Introduction\nA clear introduction to the topic, its importance and practical value.\n\n## Key Points\n• Main benefits and use cases\n• Practical tips and examples\n• Common mistakes to avoid\n\n## Conclusion\nA concise summary with a useful next step.\n\nTone: ${tone}`;
    case 'social': return `🚀 ${subject}\n\n${common} Share the key benefit, keep the hook strong and finish with a clear call to action.\n\n#Content #AI #Marketing`;
    case 'ad': return `HEADLINE: ${subject} made simple\n\nPRIMARY TEXT: Discover a smarter way to get more value from ${subject}. Clear benefits and a reason to act today.\n\nCTA: Get Started`;
    case 'rewrite': return `Rewritten version:\n\n${input}\n\nThe wording is clearer, smoother and more engaging while preserving the original meaning.`;
    case 'seo': return `SEO TITLE: ${subject} — Complete Guide\n\nMETA DESCRIPTION: Learn the essentials of ${subject}, including benefits, practical tips and best practices.\n\nKEYWORDS: ${subject}, guide, benefits, tips, best practices\n\nOUTLINE:\n1. What is ${subject}?\n2. Benefits\n3. How it works\n4. Best practices\n5. Common mistakes\n6. Conclusion`;
    default: return `${subject}\n\n${common}\n\nFEATURES\n• Clear benefit-focused messaging\n• Easy-to-understand presentation\n• Suitable for ecommerce listings\n\nWHY BUY\nExplain what makes the product useful and why customers should choose it.`;
  }
};

export async function POST(request: Request) {
  try {
    const { tool, input, language = 'English', tone = 'Professional' } = await request.json();
    if (!input?.trim()) return NextResponse.json({ error: 'Input is required' }, { status: 400 });

    // If an AI provider is configured later, this route is the single place to connect it.
    // The free MVP intentionally works without a paid API key.
    return NextResponse.json({ content: fallback(tool, input, language, tone), mode: 'free-mvp' });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
