import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ServiceCard from './ServiceCard';

const CategoryCarousel = ({
  categorias = [],
  onSelectCategory,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateButtons = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateButtons();
    emblaApi.on('select', updateButtons);
    emblaApi.on('reInit', updateButtons);
  }, [emblaApi, updateButtons]);

  if (categorias.length === 0) return null;

  const handleScroll = (direction) => {
    if (direction === 'next') emblaApi?.scrollNext();
    else emblaApi?.scrollPrev();
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Carrusel */}
      <div ref={emblaRef} style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          {categorias.map((cat) => (
            <div
              key={cat.id}
              style={{ flex: '0 0 calc(33.333% - 10px)' }}
              onClick={() => onSelectCategory(cat)} // ✅ SOLO CLICK
            >
              <ServiceCard
                title={cat.nombre}
                description={cat.descripcion}
                image={cat.image}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Flechas */}
      <button
        onClick={() => handleScroll('prev')}
        disabled={!canPrev}
        style={arrowStyle('left', canPrev)}
      >
        ❮
      </button>

      <button
        onClick={() => handleScroll('next')}
        disabled={!canNext}
        style={arrowStyle('right', canNext)}
      >
        ❯
      </button>
    </div>
  );
};

const arrowStyle = (side, enabled) => ({
  position: 'absolute',
  top: '50%',
  [side]: '-18px',
  transform: 'translateY(-50%)',
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  border: 'none',
  background: enabled ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.25)',
  color: 'white',
  fontSize: '18px',
  cursor: enabled ? 'pointer' : 'not-allowed',
  backdropFilter: 'blur(4px)',
});

export default CategoryCarousel;
