/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

export default function LazyImage({ src, alt, className = '', containerClassName = '', ...props }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Loading Placeholder Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-cyan/20 border-t-brand-cyan"></div>
        </div>
      )}
      
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        initial={{ opacity: 0, filter: 'blur(8px)' }}
        animate={{ 
          opacity: isLoaded ? 1 : 0, 
          filter: isLoaded ? 'blur(0px)' : 'blur(8px)' 
        }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`w-full h-full object-cover ${className}`}
        {...props}
      />
    </div>
  );
}
