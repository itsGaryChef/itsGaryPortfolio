"use client";

import { useEffect, useRef, useState } from "react";

type LazyGalleryImageProps = {
  src: string;
  alt: string;
};

export default function LazyGalleryImage({ src, alt }: LazyGalleryImageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true);
        observer.disconnect();
      }
    }, { rootMargin: "180px 0px" });

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frameRef} className={`gallery-media${isLoaded ? " is-loaded" : ""}`}>
      {shouldLoad && <img src={src} alt={alt} decoding="async" onLoad={() => setIsLoaded(true)} />}
    </div>
  );
}
