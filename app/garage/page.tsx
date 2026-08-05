import Link from "next/link";
import "../play/play.css";

export default function Garage() {
  return <main className="play-shell">
    <Link className="play-exit" href="/arcade" aria-label="Exit garage and return to The Arcade">Exit to Arcade</Link>
    <iframe
      className="play-frame"
      src="/garage/index.html"
      title="Lowrider Garage playable experience"
      allow="fullscreen; autoplay; gamepad"
      allowFullScreen
    />
  </main>;
}
