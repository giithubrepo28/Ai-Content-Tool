import { NextResponse } from 'next/server';

const MAX_INPUT_LENGTH = 12000;
const allowedTools = new Set(['article', 'social', 'ad', 'rewrite', 'seo', 'product']);
const allowedLanguages = new Set(['English', 'Urdu', 'Roman Urdu']);
const allowedTones = new Set(['Professional', 'Friendly', 'Persuasive', 'Casual', 'Creative']);

const fallback = (tool: string, input: string, language: string, tone: string) => {
  const subject = input.trim() || 'your topic';
  const intro = language === 'Urdu'
    ? `یہ ${subject} کے بارے میں تیار کردہ مواد ہے۔`
    : language === 'Roman Urdu'
      ? `Yeh ${subject} ke baray mein tayyar kiya gaya content hai.`
      : `This is content created for ${subject}.`;

  switch (tool) {
    case 'article':
      return `# ${subject}\n\n${intro}\n\n## Introduction\n\nThis article explains the most useful ideas, benefits and practical considerations around ${subject}.\n\n## Key Points\n\n• What ${subject} means and why it matters\n• Important benefits and practical use cases\n• Practical tips and best practices\n• Common mistakes to avoid\n\n## Practical Takeaways\n\nStart with a clear goal, focus on the audience, use simple language and measure the result.\n\n## Conclusion\n\n${subject} can create meaningful value with a clear strategy and consistent execution.\n\nTone: ${tone}`;
    case 'social':
      return `🚀 ${subject}\n\n${intro} Share the key benefit, use a strong hook and invite your audience to take the next step.\n\n#AI #Content #Marketing #${subject.replace(/\W+/g, '')}`;
    case 'ad':
      return `HEADLINE: ${subject} made simple\n\nPRIMARY TEXT: Discover a smarter way to get more value from ${subject}. Clear benefits, simple messaging and a reason to act today.\n\nCTA: Get Started`;
    case 'rewrite':
      return `Rewritten version:\n\n${input}\n\nThis version is clearer, smoother and more engaging while preserving the original meaning. Tone: ${tone}.`;
    case 'seo':
      return `SEO TITLE: ${subject} — Complete Guide\n\nMETA DESCRIPTION: Learn what you need to know about ${subject}, including benefits, practical tips and best practices.\n\nKEYWORDS: ${subject}, guide, benefits, tips, best practices\n\nOUTLINE:\n1. What is ${subject}?\n2. Main benefits\n3. How it works\n4. Best practices\n5. Common mistakes\n6. Conclusion`;
    default:
      return `${subject}\n\n${intro}\n\nFEATURES\n• Clear benefit-focused messaging\n• Easy-to-understand presentation\n• Suitable for ecommerce listings\n\nWHY BUY\nA strong product description helps customers understand what makes the product useful and why it is worth choosing.`;
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tool, input, language = 'English', tone = 'Professional' } = body ?? {};

    if (typeof tool !== 'string' || !allowedTools.has(tool)) {
      return NextResponse.json({ error: 'Unsupported content tool' }, { status: 400 });
    }
    if (typeof input !== 'string' || !input.trim()) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 });
    }
    if (input.length > MAX_INPUT_LENGTH) {
      return NextResponse.json({ error: `Input must be ${MAX_INPUT_LENGTH.toLocaleString()} characters or fewer` }, { status: 413 });
    }
    if (typeof language !== 'string' || !allowedLanguages.has(language)) {
      return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
    }
    if (typeof tone !== 'string' || !allowedTones.has(tone)) {
      return NextResponse.json({ error: 'Unsupported tone' }, { status: 400 });
    }

    // The free MVP intentionally works without a paid API key.
    // A real provider can be connected here later using server-side environment variables.
    return NextResponse.json({ content: fallback(tool, input, language, tone), mode: 'free-mvp' });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request' }, { status: 400 });
  }
}
