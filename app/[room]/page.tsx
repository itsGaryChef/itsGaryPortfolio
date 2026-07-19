import Link from "next/link";
import "../ai-studio.css";
import portfolioContent from "../portfolio-content.json";
import LazyGalleryImage from "../LazyGalleryImage";

type RoomContent = { title: string; subtitle: string; images: string[]; intro?: string; playHref?: string };

const content: Record<string, RoomContent> = {
  gallery: { title: "The Gallery", subtitle: "VR Photography", images: portfolioContent.gallery },
  kitchen: { title: "The Kitchen", subtitle: "Renders + Animation", images: portfolioContent.kitchen },
  arcade: { title: "The Arcade", subtitle: "Gameplay + Playable Experience", intro: "Step into Gary's browser-based social bowling world. Choose a character, explore four lanes, bowl a full game, use social emotes, or capture the venue in drone photo mode.", playHref: "/play", images: portfolioContent.arcade },
  shop: { title: "Gift Shop", subtitle: "Merch coming soon", images: ["/portfolio/shop/featured-render.webp"] },
  "ai-studio": { title: "The AI Studio", subtitle: "AI Art + Video", intro: "A growing collection of generated imagery, experiments, and motion work.", images: ["/ai-studio-placeholder.jpg"] },
};

export default async function Room({ params }: { params: Promise<{ room: string }> }) {
  const { room } = await params;
  const d = content[room] || content.gallery;
  return <main className={`destination ${room === "ai-studio" ? "ai-destination" : ""}`}>
    <header><Link className="brand" href="/">itsgary<span>.art</span></Link><Link href="/">← Return to restaurant</Link></header>
    <div className="destination-title"><p>{d.subtitle}</p><h1>{d.title}</h1>{d.intro && <div className="destination-intro">{d.intro}</div>}</div>
    {d.playHref && <div className="game-launch"><div><span>Desktop browser experience</span><h2>Bowling is open.</h2><p>WASD to move · Mouse to look · E to interact</p></div><Link href={d.playHref}>Enter the game →</Link></div>}
    {d.images.length ? <div className="destination-grid">{d.images.map((img, i) => <figure key={img}><LazyGalleryImage src={img} alt={`${d.title} work ${i + 1}`} /><figcaption>Selection {String(i + 1).padStart(2, "0")}</figcaption></figure>)}</div> : <div className="ai-shelves">
      <section><span>01</span><h2>Generated Art</h2><p>Still images, visual studies, and crafted AI-assisted worlds.</p></section>
      <section><span>02</span><h2>AI Video</h2><p>Motion experiments, cinematic sequences, and animated concepts.</p></section>
    </div>}
  </main>;
}
