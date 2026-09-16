"use client";

import { useEffect, useState } from "react";
import "./doorway-transition.css";

const rooms: Record<string, string> = {
  "/": "The Dining Room", "/gallery": "The Gallery", "/kitchen": "The Kitchen",
  "/arcade": "The Arcade", "/shop": "Gift Shop", "/ai-studio": "The AI Studio",
  "/play": "The Bowling Alley", "/garage": "The Garage",
};

export default function DoorwayNavigation() {
  const [destination, setDestination] = useState<string | null>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let traveling = false;
    const reset = () => { traveling = false; setDestination(null); document.body.classList.remove("doorway-traveling"); };
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link || link.download || (link.target && link.target !== "_self")) return;
      const url = new URL(link.href, location.href);
      const path = url.pathname.replace(/\/$/, "") || "/";
      if (url.origin !== location.origin || !rooms[path] || url.href === location.href || (url.pathname === location.pathname && url.hash)) return;
      event.preventDefault();
      event.stopPropagation();
      if (traveling) return;
      traveling = true;
      setDestination(rooms[path]);
      document.body.classList.add("doorway-traveling");
      timer = setTimeout(() => location.assign(url.href), matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1450);
    };
    document.addEventListener("click", click, true);
    window.addEventListener("pageshow", reset);
    return () => { clearTimeout(timer); document.removeEventListener("click", click, true); window.removeEventListener("pageshow", reset); document.body.classList.remove("doorway-traveling"); };
  }, []);
  return destination ? <div className="doorway-transition" aria-live="polite"><span>Entering {destination}</span></div> : null;
}
