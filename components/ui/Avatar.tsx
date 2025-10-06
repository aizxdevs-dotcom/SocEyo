"use client";

import React from "react";
import Image from "next/image";
import clsx from "clsx";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: number;
  fallback?: string; // e.g. initials: "AB"
  className?: string;
}

export default function Avatar({
  src,
  alt = "avatar",
  size = 40,
  fallback,
  className,
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden text-gray-700 dark:text-gray-200 select-none",
        className
      )}
      style={{ width: size, height: size }}
    >
      {src && !imgError ? (
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          onError={() => setImgError(true)}
          className="object-cover w-full h-full"
        />
      ) : fallback ? (
        <span className="text-sm font-semibold">{fallback}</span>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width={size * 0.7}
          height={size * 0.7}
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