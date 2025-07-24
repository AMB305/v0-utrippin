import React, { useState } from 'react';

export const GallerySection = () => {
  const [images, setImages] = useState<string[]>([]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...urls]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">📷 Trip Photos</h2>
        <label className="bg-zinc-700 text-white /* main text color: white */ px-3 py-1 rounded cursor-pointer">
          Upload
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Trip Photo ${i + 1}`}
            className="rounded-lg object-cover h-28 w-full"
          />
        ))}
      </div>
    </div>
  );
};