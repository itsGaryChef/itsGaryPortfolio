# itsgary.art

An interactive Three.js portfolio and Social Bowling experience for Gary Kaul.

The site includes:

- A 3D restaurant hub featuring Chef Void
- Portfolio rooms for VR photography, renders, animation, gameplay, and AI work
- A playable Social Bowling arcade with VRM avatars, mobile controls, multiplayer-ready presence, and proximity voice support
- Responsive galleries that preserve full-width artwork and load media only as it approaches the viewport

## Run locally

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

To verify a production build:

```bash
npm run build
```

## Publishing from GitHub

This repository is ready to import into a GitHub repository. Keep `.env` files out of GitHub; they contain local-only configuration.

The app currently uses Vinext and a Cloudflare-compatible worker build. GitHub Pages is static-only, so it cannot directly run the complete site shell as configured. The recommended free workflow is:

1. Import this repository into GitHub.
2. Connect that GitHub repository to a Cloudflare Worker/Pages-compatible deployment service.
3. Add the existing Supabase and LiveKit runtime values in the host's environment settings.
4. Add the final public URL to Supabase Auth's redirect allow list before enabling email sign-in.

The bundled Social Bowling game is served from `public/game`. It uses Supabase for verified-email identity and LiveKit for cross-device rooms and proximity voice. Those managed services are required for multiplayer between friends on different networks.

## Asset notes

- Keep individual playable VRMs under roughly 20–30 MB.
- Avoid committing generated build output, local package stores, or archived WordPress source material.
- Add portfolio media under `public/portfolio` and update `app/portfolio-content.json`.
