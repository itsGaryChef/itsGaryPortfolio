import Link from "next/link";
import "../play/play.css";

export default function BeatKitchen() {
  return <main className="play-shell">
    <Link className="play-exit" href="/arcade" aria-label="Exit Beat Kitchen and return to The Arcade">Exit to Arcade</Link>
    <iframe
      className="play-frame"
      src="/beat-kitchen/index.html"
      title="Beat Kitchen piano rhythm and loop studio"
      allow="fullscreen; autoplay"
      allowFullScreen
    />
  </main>;
}
