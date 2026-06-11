'use client';

import React from 'react';

export interface AvatarProps {
  className?: string;
  children?: React.ReactNode;
}

export function Avatar({ className = '', children }: AvatarProps) {
  return (
    <div className={`inline-flex items-center justify-center rounded-full overflow-hidden bg-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export interface AvatarImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

export function AvatarImage({ src, alt = '', className = '' }: AvatarImageProps) {
  if (!src) return null;
  return <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`} />;
}

export interface AvatarFallbackProps {
  className?: string;
  children?: React.ReactNode;
}

export function AvatarFallback({ className = '', children }: AvatarFallbackProps) {
  return (
    <span className={`flex items-center justify-center w-full h-full text-sm font-medium text-gray-600 ${className}`}>
      {children}
    </span>
  );
}
