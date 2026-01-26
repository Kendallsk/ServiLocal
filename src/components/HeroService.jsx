import { motion, AnimatePresence } from 'framer-motion';
import CategoryCarousel from './CategoryCarousel';

const HeroService = ({
  categorias,
  activeCategory,
  setActiveCategory,
}) => {
  if (!activeCategory) return null;

  return (
    <div
      style={{
        position: 'relative',
        height: '80vh',
        minHeight: '520px',
        overflow: 'hidden',
      }}
    >
      {/* Fondo dinámico */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${activeCategory.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </AnimatePresence>

      {/* Overlay oscuro */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(0,0,0,0.75), rgba(0,0,0,0.25))',
        }}
      />

      {/* Contenido */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          padding: '60px',
          boxSizing: 'border-box',
        }}
      >
        {/* Texto izquierdo */}
        <div style={{ maxWidth: '480px', color: 'white' }}>
          <motion.h1
            key={activeCategory.nombre}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              fontSize: '46px',
              marginBottom: '16px',
            }}
          >
            {activeCategory.nombre}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{
              fontSize: '18px',
              lineHeight: 1.6,
              opacity: 0.9,
            }}
          >
            {activeCategory.descripcion}
          </motion.p>
        </div>

        {/* Carousel pequeño */}
        <div style={{ alignSelf: 'flex-end' }}>
          <CategoryCarousel
            categorias={categorias}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            compact
          />
        </div>
      </div>
    </div>
  );
};

export default HeroService;
