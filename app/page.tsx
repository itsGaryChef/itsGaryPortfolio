"use client";

import { useState } from "react";
import RestaurantGame from "./RestaurantGame";
import "./doorway-transition.css";

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
  const [traveling,setTraveling]=useState<string|null>(null);
  const beginTravel=(room:string)=>{
    if(traveling)return;
    setTraveling(room);
    window.setTimeout(()=>window.location.assign(`/${room}`),1450);
  };
  return <main className={`game-shell ${traveling?"is-traveling":""}`}>
    <RestaurantGame active={started} onNearby={setNearby} onMap={()=>setMapOpen(true)} />
    <header className="game-header"><a className="brand" href="/">itsgary<span>.art</span></a><div className="location"><small>Current location</small><strong>The Dining Room</strong></div><button onClick={()=>setMapOpen(true)}>Map</button></header>
    {!started&&<section className="welcome welcome-cinematic"><p className="eyebrow">Welcome in</p><h1>A table for<br/><em>curious minds.</em></h1><p>Welcome to itsgary.art. Move through the restaurant: each glowing doorway opens a different part of Gary’s world, from VR photography and animation to AI work and playable experiments.</p><button className="primary" onClick={()=>setStarted(true)}>Enter the restaurant</button><small>Your table is ready.</small></section>}
    <div style={{display:started?"contents":"none"}}><div className="controls" aria-label="Movement controls"><span>Move · Drag to orbit · Scroll to zoom · V to change view</span><div><kbd>W</kbd></div><div><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></div></div>
    <div className="touch-controls" aria-label="Touch movement controls"><button data-key="ArrowUp" aria-label="Move up">↑</button><div><button data-key="ArrowLeft" aria-label="Move left">←</button><button data-key="ArrowDown" aria-label="Move down">↓</button><button data-key="ArrowRight" aria-label="Move right">→</button></div></div>
    <div className="objective"><span>Explore the restaurant</span><strong>Find the five portfolio rooms</strong></div>
    {nearby&&<button className="discover" onClick={()=>beginTravel(nearby)}><small>Destination discovered</small><strong>{destinations.find(d=>d.id===nearby)?.label}</strong><span>Step through →</span></button>}</div>
    {mapOpen&&<div className="map-modal" role="dialog" aria-modal="true" aria-label="Restaurant map"><div className="map-card"><button className="map-close" onClick={()=>setMapOpen(false)}>Close</button><p className="eyebrow">Maître d' station</p><h2>Restaurant map</h2><div className="floorplan"><div className="you">You are here</div>{destinations.map(d=><a key={d.id} href={`/${d.id}`} onClick={e=>{e.preventDefault();beginTravel(d.id)}} style={{left:`${d.x}%`,top:`${d.y}%`}}><i></i><strong>{d.label}</strong><small>{d.detail}</small></a>)}</div><p className="map-note">Walk toward a glowing doorway to discover its room, or choose a destination here.</p></div></div>}
    {traveling&&<div className="doorway-transition" aria-live="polite"><span>Entering {destinations.find(d=>d.id===traveling)?.label}</span></div>}
  </main>
}
