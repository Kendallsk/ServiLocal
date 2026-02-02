import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = ({ activeCategory }) => {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      overflow: 'hidden',
      backdropFilter: 'blur(10px)',
    }}>
      {/* Fondo dinámico */}
      {activeCategory?.image && (
        <motion.div
          key={activeCategory.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${activeCategory.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)',
            zIndex: -1,
          }}
        />
      )}

      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.2))',
          zIndex: -1,
        }}
      />

      {/* Contenido */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '6px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '55px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '45px',
            height: '45px',
            backgroundImage: "url(/images/LogoServiLocal.png)",
            backgroundSize: 'cover',
            borderRadius: '50%',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }} />
          <h1 style={{
            fontSize: '20px',
            background: 'linear-gradient(to right, #00bcd4, #ff9800)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            fontWeight: 'bold',
          }}>
            ServiLocal
          </h1>
        </div>

        {/* CTA */}
        <Link
          to="/login"
          style={{
            padding: '8px 20px',
            background: 'linear-gradient(to right, #00bcd4, #ff9800)',
            color: 'white',
            borderRadius: '50px',
            fontSize: '14px',
            fontWeight: 'bold',
            textDecoration: 'none',
            boxShadow: '0 3px 12px rgba(0, 188, 212, 0.4)',
          }}
        >
          Registrarme como prestador
        </Link>
      </div>
    </header>
  );
};

export default Header;
