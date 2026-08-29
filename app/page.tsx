'use client';

import { useState } from 'react';

const nav = ['Home', 'Explore', 'Genres', 'Rankings', 'Library'];
const genres = ['Romance', 'Fantasy', 'Adventure', 'Mystery', 'Isekai', 'Supernatural'];
const stories = [
  ['Moonlit Promise', 'Romance · Fantasy', 'A quiet promise beneath a silver moon.', '01'],
  ['Crimson Eclipse', 'Fantasy · Adventure', 'When an ancient power wakes, two hearts become one destiny.', '02'],
  ['Starlight Academy', 'Romance · Supernatural', 'Secrets, spells and a love that was never meant to happen.', '03'],
  ['Whispering Realm', 'Mystery · Fantasy', 'Every forgotten door hides a story waiting to be found.', '04'],
];

function CoupleArt() {
  return <div className="coupleArt" aria-label="Anime-inspired fantasy couple illustration">
    <div className="moon" /><div className="orb orbOne" /><div className="orb orbTwo" />
    <div className="couple"><div className="girl"><span className="hair"/><span className="face"/><span className="dress"/><span className="arm"/></div><div className="boy"><span className="hair"/><span className="face"/><span className="coat"/><span className="arm"/></div></div>
    <div className="spark s1">✦</div><div className="spark s2">✧</div><div className="spark s3">✦</div>
  </div>;
}

export default function Home() {
  const [active, setActive] = useState('Home');
  const [menu, setMenu] = useState(false);
  const [liked, setLiked] = useState<number[]>([]);
  const [toast, setToast] = useState('');

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 1800); };
  const toggleLike = (i: number) => setLiked((x) => x.includes(i) ? x.filter((n) => n !== i) : [...x, i]);

  return <main>
    <div className="ambient ambientA"/><div className="ambient ambientB"/>
    <header className="navWrap">
      <nav className="nav">
        <button className="logo" onClick={() => { setActive('Home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><span>✦</span> ELARIA</button>
        <div className={`navLinks ${menu ? 'open' : ''}`}>{nav.map((item) => <button key={item} className={active === item ? 'active' : ''} onClick={() => { setActive(item); setMenu(false); notify(`${item} selected`); }}>{item}</button>)}</div>
        <div className="navActions"><button className="search" onClick={() => notify('Search is ready for the next phase')}>⌕ <span>Search stories</span></button><button className="login" onClick={() => notify('Account UI coming next')}>Sign in</button><button className="menuBtn" onClick={() => setMenu(!menu)} aria-label="Menu">☰</button></div>
      </nav>
    </header>

    <section className="hero">
      <div className="heroCopy">
        <div className="eyebrow"><span/> A NEW WORLD OF STORIES</div>
        <h1>Where <em>dreams</em><br/>become <span>legends.</span></h1>
        <p>Step into beautiful worlds of romance, magic and adventure. Discover stories that feel like they were written just for you.</p>
        <div className="heroButtons"><button className="primary" onClick={() => document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' })}>Explore the realms <b>↗</b></button><button className="ghost" onClick={() => notify('Welcome to Elaria ✦')}>Our universe <b>♡</b></button></div>
        <div className="heroStats"><div><strong>12K+</strong><small>Readers</small></div><i/><div><strong>480+</strong><small>Worlds</small></div><i/><div><strong>24/7</strong><small>Imagination</small></div></div>
      </div>
      <div className="heroVisual"><div className="halo"/><CoupleArt/><div className="quoteCard"><span>✦</span><p>“Some stories are<br/>meant to be felt.”</p><small>— The Elaria Archives</small></div></div>
    </section>

    <section className="section" id="discover">
      <div className="sectionHead"><div><div className="eyebrow">DISCOVER YOUR NEXT ESCAPE</div><h2>Choose your <span>realm.</span></h2></div><button className="viewAll" onClick={() => notify('All realms opened')}>View all <b>→</b></button></div>
      <div className="genreGrid">{genres.map((g, i) => <button key={g} className="genre" onClick={() => notify(`${g} realm selected`)}><span>{['♡','✧','⚔','◈','☾','✦'][i]}</span><strong>{g}</strong><small>Explore stories</small><b>↗</b></button>)}</div>
    </section>

    <section className="section storiesSection">
      <div className="sectionHead"><div><div className="eyebrow">CURATED FOR YOU</div><h2>Featured <span>worlds.</span></h2></div><div className="arrows"><button onClick={() => notify('Previous')} aria-label="Previous">←</button><button onClick={() => notify('Next')} aria-label="Next">→</button></div></div>
      <div className="storyGrid">{stories.map((s, i) => <article className="storyCard" key={s[0]}><div className={`cover cover${i}`}><span className="coverNo">{s[3]}</span><div className="coverMoon"/><div className="coverFigures">♡</div><small>ELARIA</small></div><div className="storyInfo"><div className="storyMeta">{s[1]} <button onClick={() => toggleLike(i)} aria-label="Favorite">{liked.includes(i) ? '♥' : '♡'}</button></div><h3>{s[0]}</h3><p>{s[2]}</p><button className="read" onClick={() => notify(`${s[0]} preview opened`)}>Enter story <span>↗</span></button></div></article>)}</div>
    </section>

    <section className="manifesto"><div className="manifestoGlow"/><div className="eyebrow">THE ELARIA EXPERIENCE</div><h2>Not just stories.<br/><em>New worlds to live in.</em></h2><p>Beautifully crafted spaces for readers who want a little more magic in every chapter.</p><button className="primary" onClick={() => notify('Your journey begins ✦')}>Begin your journey <b>↗</b></button></section>

    <footer><div className="footerBrand"><button className="logo">✦ ELARIA</button><p>Stories beyond the stars.</p></div><div><strong>Explore</strong><button>Discover</button><button>Genres</button><button>Rankings</button></div><div><strong>Community</strong><button>Library</button><button>Favorites</button><button>About us</button></div><div><strong>Stay enchanted</strong><p>New worlds, stories & magic.</p><div className="subscribe"><input placeholder="Your email" aria-label="Email"/><button onClick={() => notify('Subscribed ✦')}>→</button></div></div><div className="copyright">© 2026 Elaria · Crafted for dreamers</div></footer>
    {toast && <div className="toast">✦ {toast}</div>}
  </main>;
}
