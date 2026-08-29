# AI Content Tool

Free AI content workspace built with Next.js and TypeScript.

## Free MVP features

- AI Article / Blog generator
- Social post / caption generator
- Ad copy generator
- Rewrite / paraphrase
- SEO content planner
- Product descriptions
- English, Urdu and Roman Urdu
- Tone selection
- Copy and `.txt` export
- Local generation history
- Local free account profile
- Free usage counter
- Responsive interface
- Server-side generation route with a no-key fallback

## Running locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## AI provider

The `/api/generate` route is intentionally provider-agnostic. The free MVP works without a paid API key. A real AI provider can be connected later without changing the UI contract.

## Payments

Payment APIs and paid subscriptions are intentionally not included yet.
