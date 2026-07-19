import Link from "next/link";
import "./play.css";

export default function Play() {
  return <main className="play-shell">
    <Link className="play-exit" href="/arcade" aria-label="Exit game and return to The Arcade">Exit to Arcade</Link>
    <iframe
      className="play-frame"
      src="/game/index.html"
      title="Social Bowling playable experience"
      allow="fullscreen; autoplay; gamepad"
      allowFullScreen
    />
  </main>;
}
