"use client";

import { useState } from "react";
import RestaurantGame from "./RestaurantGame";

const destinations = [
  { id:"gallery", label:"The Gallery", detail:"VR Photography", x:50, y:14 },
  { id:"kitchen", label:"The Kitchen", detail:"Renders + Animation", x:18, y:48 },
  { id:"arcade", label:"The Arcade", detail:"Gameplay", x:82, y:48 },
  { id:"shop", label:"Gift Shop", detail:"Merch", x:35, y:82 },
  { id:"ai-studio", label:"The AI Studio", detail:"AI Art + Video", x:76, y:82 },
];

export default function Home(){
  const [mapOpen,setMapOpen]=useState(false);
  const [nearby,setNearby]=useState<string|null>(null);
  const [started,setStarted]=useState(false);
  return <main className="game-shell">
    <RestaurantGame active={started} onNearby={setNearby} onMap={()=>setMapOpen(true)} />
    <header className="game-header"><a className="brand" href="/">itsgary<span>.art</span></a><div className="location"><small>Current location</small><strong>The Dining Room</strong></div><button onClick={()=>setMapOpen(true)}>Map</button></header>
    {!started&&<section className="welcome"><p className="eyebrow">Tonight's experience</p><h1>Welcome to<br/><em>another world.</em></h1><p>Move Chef Void through the restaurant. Every room holds a different part of Gary's work.</p><button className="primary" onClick={()=>setStarted(true)}>Enter the restaurant</button><small>WASD / Arrow keys · V to change view · Touch controls on mobile</small></section>}
    <div className="controls" aria-label="Movement controls"><span>Move · Drag to orbit · Scroll to zoom · V to change view</span><div><kbd>W</kbd></div><div><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></div></div>
    <div className="touch-controls" aria-label="Touch movement controls"><button data-key="ArrowUp" aria-label="Move up">↑</button><div><button data-key="ArrowLeft" aria-label="Move left">←</button><button data-key="ArrowDown" aria-label="Move down">↓</button><button data-key="ArrowRight" aria-label="Move right">→</button></div></div>
    <div className="objective"><span>Explore the restaurant</span><strong>Find the five portfolio rooms</strong></div>
    {nearby&&<a className="discover" href={`/${nearby}`}><small>Destination discovered</small><strong>{destinations.find(d=>d.id===nearby)?.label}</strong><span>Enter room →</span></a>}
    {mapOpen&&<div className="map-modal" role="dialog" aria-modal="true" aria-label="Restaurant map"><div className="map-card"><button className="map-close" onClick={()=>setMapOpen(false)}>Close</button><p className="eyebrow">Maître d' station</p><h2>Restaurant map</h2><div className="floorplan"><div className="you">You are here</div>{destinations.map(d=><a key={d.id} href={`/${d.id}`} style={{left:`${d.x}%`,top:`${d.y}%`}}><i></i><strong>{d.label}</strong><small>{d.detail}</small></a>)}</div><p className="map-note">Walk toward a glowing doorway to discover its room, or choose a destination here.</p></div></div>}
  </main>
}
