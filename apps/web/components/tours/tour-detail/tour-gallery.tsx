"use client";

import { useState } from "react";

interface TourGalleryProps {
  coverImage?: string;
  images: string[];
}

export function TourGallery({ coverImage, images }: TourGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const allImages = coverImage
    ? [coverImage, ...images.filter((img) => img !== coverImage)]
    : images;

  if (allImages.length === 0) {
    return (
      <div className="aspect-video w-full rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-gray-400">
          image
        </span>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Grid Gallery */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-xl overflow-hidden h-[300px] sm:h-[400px]">
        {/* Main Image */}
        <button
          onClick={() => openLightbox(0)}
          className="col-span-4 row-span-2 sm:col-span-2 relative group cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={allImages[0]}
            alt="Tour main photo"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </button>

        {/* Secondary Images */}
        {allImages.slice(1, 5).map((img, i) => (
          <button
            key={i}
            onClick={() => openLightbox(i + 1)}
            className="hidden sm:block relative group cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={`Tour photo ${i + 2}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            {i === 3 && allImages.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                  +{allImages.length - 5} more
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>

          {/* Prev/Next */}
          {lightboxIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => prev - 1);
              }}
              className="absolute left-4 text-white hover:text-gray-300"
            >
              <span className="material-symbols-outlined text-4xl">
                chevron_left
              </span>
            </button>
          )}
          {lightboxIndex < allImages.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => prev + 1);
              }}
              className="absolute right-4 text-white hover:text-gray-300"
            >
              <span className="material-symbols-outlined text-4xl">
                chevron_right
              </span>
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={allImages[lightboxIndex]}
            alt={`Tour photo ${lightboxIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Counter */}
          <div className="absolute bottom-4 text-white text-sm">
            {lightboxIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </>
  );
}
