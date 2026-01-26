import { motion } from 'framer-motion';
import CategoryCarousel from './CategoryCarousel';
import SearchBar from './SearchBar';

const ServiceShowcase = ({
  categorias,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
}) => {
  if (!activeCategory) return null;

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '500px',
        marginTop: '0px',
        borderRadius: '0px',
        overflow: 'hidden',
      }}
    >
      {/* Fondo dinámico */}
      <motion.div
        key={activeCategory.id}
        initial={{ opacity: 0.4, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${activeCategory.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

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
          display: 'flex',
          flexDirection: 'column',
          padding: '0px',
        }}
      >
        {/* SearchBar dentro del fondo */}
        <div style={{ padding: '24px 48px' }}>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        {/* Contenido principal */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            padding: '24px 48px 48px',
            alignItems: 'center',
            flex: 1,
          }}
        >
        {/* Texto izquierda */}
        <div style={{ color: 'white', maxWidth: '520px' }}>
          <motion.h2
            key={activeCategory.nombre}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              fontSize: '42px',
              fontWeight: 700,
              marginBottom: '16px',
            }}
          >
            {activeCategory.nombre}
          </motion.h2>

          <motion.p
            key={activeCategory.descripcion}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: '18px',
              lineHeight: 1.6,
              opacity: 0.95,
            }}
          >
            {activeCategory.descripcion}
          </motion.p>
        </div>

        {/* Carousel abajo/derecha */}
        <div style={{ alignSelf: 'flex-end' }}>
          <CategoryCarousel
            categorias={categorias}
            onSelectCategory={setActiveCategory}
            activeCategory={activeCategory}
            compact
          />
        </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceShowcase;
