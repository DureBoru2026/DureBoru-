import React, { useState, useEffect, useRef } from "react";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src) return;
    
    if (!("IntersectionObserver" in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px",
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src]);

  return (
    <div 
      ref={imgRef}
      className={cn("relative w-full h-full overflow-hidden bg-slate-50 flex items-center justify-center", className)}
    >
      {(!isInView || !isLoaded) && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 animate-pulse flex items-center justify-center">
          <ImageIcon className="text-slate-300 animate-bounce duration-1000" size={32} />
        </div>
      )}
      
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-all duration-700",
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95",
            props.className
          )}
          referrerPolicy="no-referrer"
          {...props}
        />
      )}
    </div>
  );
};
