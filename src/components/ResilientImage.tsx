import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ResilientImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackLabel,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#eaedff] via-[#f2f3ff] to-[#e6f4f1] text-[#00685f] ${className}`}
      >
        <Sparkles className="h-6 w-6 opacity-70" aria-hidden="true" />
        {fallbackLabel ? (
          <span className="mt-1.5 text-xs font-semibold tracking-tight text-[#131b2e]">
            {fallbackLabel}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
