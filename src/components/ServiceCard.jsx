import { motion } from 'framer-motion';

const ServiceCard = ({ title, description, image }) => {
  return (
    <div
      style={{
        position: 'relative',
        height: '230px',
        borderRadius: '14px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      }}
    >
      {/* Imagen */}
      <motion.img
        src={image}
        alt={title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.35 }}
      />

      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.15))',
        }}
      />

      {/* Título */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          color: 'white',
          fontSize: '18px',
          fontWeight: 600,
        }}
      >
        {title}
      </div>
    </div>
  );
};

export default ServiceCard;
