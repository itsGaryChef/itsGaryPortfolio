import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://itsgary.art"),
  title: "itsgary.art — A portfolio served from another world",
  description: "Gary's portfolio of VR photography, renders, animation, gameplay, and digital objects—hosted by an alien chef.",
  openGraph: {
    title: "itsgary.art",
    description: "A portfolio served from another world.",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "An alien chef welcomes visitors to itsgary.art" }],
  },
  twitter: { card: "summary_large_image", title: "itsgary.art", description: "A portfolio served from another world.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
