"use client";

import React from "react";
import Image from "next/image";
import clsx from "clsx";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string; // For generating initials
  size?: "sm" | "md" | "lg" | number;
  fallback?: string; // e.g. initials: "AB"
  className?: string;
}

export default function Avatar({
  src,
  alt = "avatar",
  name,
  size = 40,
  fallback,
  className,
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);

  // Convert size to pixels
  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 64,
  };
  
  const pixelSize = typeof size === "string" ? sizeMap[size] : size;

  // Generate initials from name if no fallback provided
  const getInitials = () => {
    if (fallback) return fallback;
    if (!name) return null;
    
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials();

  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden text-white select-none font-semibold",
        className
      )}
      style={{ width: pixelSize, height: pixelSize, minWidth: pixelSize, minHeight: pixelSize }}
    >
      {src && !imgError ? (
        <Image
          src={src}
          alt={alt || name || "avatar"}
          width={pixelSize}
          height={pixelSize}
          onError={() => setImgError(true)}
          className="object-cover w-full h-full"
        />
      ) : initials ? (
        <span style={{ fontSize: pixelSize * 0.4 }}>{initials}</span>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width={pixelSize * 0.6}
          height={pixelSize * 0.6}
        >
          <path
            fillRule="evenodd"
            d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.7-9.6 4.8v2.4h19.2V19c0-3.1-6.4-4.8-9.6-4.8z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  );
}