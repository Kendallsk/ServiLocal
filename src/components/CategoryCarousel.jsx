import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ServiceCard from './ServiceCard';

const CategoryCarousel = ({
  categorias = [],
  onSelectCategory,
  activeCategory,
  compact = false,
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

    // Obtener el índice del primer elemento visible
    const selectedIndex = emblaApi.selectedScrollSnap();
    if (categorias[selectedIndex]) {
      onSelectCategory?.(categorias[selectedIndex]);
    }
  }, [emblaApi, categorias, onSelectCategory]);

  useEffect(() => {
    if (!emblaApi) return;
    updateButtons();
    emblaApi.on('select', updateButtons);
    emblaApi.on('reInit', updateButtons);
  }, [emblaApi, updateButtons]);

  if (categorias.length === 0) return null;

  const handleScroll = (direction) => {
    if (direction === 'next') {
      emblaApi?.scrollNext();
    } else {
      emblaApi?.scrollPrev();
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      {/* Carrusel */}
      <div ref={emblaRef} style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          {categorias.map((cat) => (
            <div
              key={cat.id}
              style={{
                flex: '0 0 calc(33.333% - 10.67px)',
              }}
              onClick={() => onSelectCategory?.(cat)}
              onMouseEnter={() => onSelectCategory?.(cat)}
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '16px',
        }}
      >
        <button
          onClick={() => handleScroll('prev')}
          disabled={!canPrev}
          style={navButtonStyle(canPrev)}
        >
          ◀
        </button>

        <button
          onClick={() => handleScroll('next')}
          disabled={!canNext}
          style={navButtonStyle(canNext)}
        >
          ▶
        </button>
      </div>
    </div>
  );
};

const navButtonStyle = (enabled) => ({
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  border: 'none',
  background: enabled ? '#00bcd4' : '#ccc',
  color: 'white',
  fontSize: '16px',
  cursor: enabled ? 'pointer' : 'not-allowed',
});

export default CategoryCarousel;
