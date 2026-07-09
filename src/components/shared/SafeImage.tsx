"use client"; // Ini adalah Client Component

import Image from "next/image";
import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function SafeImage({ src, alt, className, priority = false }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <Image
      src={hasError ? "/fallback-image.jpg" : src}
      alt={alt}
      fill
      className={className}
      sizes="100vw"
      priority={priority}
      onError={() => setHasError(true)}
    />
  );
}