import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

const ChangeView = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo([center.lat, center.lng], 15, {
      animate: true,
      duration: 1.5,
    });
  }, [center, map]);

  return null;
};

const HeroMap = ({ mapCenter, markers, activeCategory }) => {
  return (
    <section
      style={{
        position: 'relative',
        height: '100vh',
        marginTop: '80px',
        padding: '0 32px',
        overflow: 'hidden',
      }}
    >
      {/* Fondo dinámico (igual que ServiceShowcase) */}
      <motion.div
        key={activeCategory?.id}
        initial={{ opacity: 0.4, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${activeCategory?.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* Overlay oscuro */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
          zIndex: 1,
        }}
      />

      {/* Texto central */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
          textAlign: 'center',
          color: 'white',
          maxWidth: '800px',
          padding: '24px',
          background: 'rgba(0,0,0,0.35)',
          borderRadius: '16px',
          pointerEvents: 'none',
        }}
      >
        <h2 style={{ fontSize: '48px', marginBottom: '16px' }}>
          Encuentra los mejores prestadores de servicios locales
        </h2>
        <p style={{ fontSize: '22px' }}>
          Electricistas, plomeros, gasfiteros y más — cerca de ti
        </p>
      </div>

      {/* Contenedor del mapa */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          borderRadius: '24px',
          overflow: 'hidden',
        }}
      >
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={13}
          style={{ width: '100%', height: '100%' }}
          scrollWheelZoom
        >
          <ChangeView center={mapCenter} />

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />

          {markers.map((m, i) => (
            <Marker key={i} position={[m.position.lat, m.position.lng]}>
              <Popup>{m.title}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
};

export default HeroMap;
