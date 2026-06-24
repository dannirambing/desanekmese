"use client"; // Ini adalah Client Component

import Image from "next/image";
import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function SafeImage({ src, alt, className }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <Image
      src={hasError ? "/fallback-image.jpg" : src}
      alt={alt}
      fill
      className={className}
      sizes="100vw"
      onError={() => setHasError(true)}
    />
  );
}