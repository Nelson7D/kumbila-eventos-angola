
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize } from 'lucide-react';

interface SpaceGalleryProps {
  images: string[];
  name: string;
}

const SpaceGallery = ({ images, name }: SpaceGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="relative">
        {/* Main image */}
        <div className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-lg">
          <img 
            src={images[currentIndex]} 
            alt={`${name} - imagem ${currentIndex + 1}`} 
            className="w-full h-full object-cover"
          />
          
          {/* Navigation controls */}
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <button 
              onClick={prevImage}
              className="p-2 rounded-full bg-white/70 hover:bg-white text-gray-800 transition-colors"
              aria-label="Imagem anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextImage}
              className="p-2 rounded-full bg-white/70 hover:bg-white text-gray-800 transition-colors"
              aria-label="Próxima imagem"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
          {/* Fullscreen button */}
          <button 
            onClick={() => setShowLightbox(true)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/70 hover:bg-white text-gray-800 transition-colors"
            aria-label="Ver em tela cheia"
          >
            <Maximize size={20} />
          </button>
          
          {/* Image counter */}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
        
        {/* Thumbnails */}
        <div className="mt-4 grid grid-cols-5 gap-2">
          {images.slice(0, 5).map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-20 rounded-lg overflow-hidden ${index === currentIndex ? 'ring-2 ring-primary' : 'opacity-70'}`}
            >
              <img 
                src={image} 
                alt={`${name} - thumbnail ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
      
      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center" onClick={() => setShowLightbox(false)}>
          <div className="relative max-w-4xl max-h-[80vh]" onClick={e => e.stopPropagation()}>
            <img 
              src={images[currentIndex]} 
              alt={`${name} - imagem em tela cheia`} 
              className="max-w-full max-h-[80vh] object-contain"
            />
            
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <button 
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
                aria-label="Imagem anterior"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
                aria-label="Próxima imagem"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            
            <button 
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
            
            <div className="absolute bottom-4 right-4 bg-white/20 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const X = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default SpaceGallery;
