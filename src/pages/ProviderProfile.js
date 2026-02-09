import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProviderProfile.css';

const ProviderProfile = () => {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        // Usar IP local en lugar de localhost para que funcione desde el teléfono
        const backendURL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
          ? 'http://192.168.1.105:5000'
          : `http://${window.location.hostname}:5000`;
        
        const response = await fetch(`${backendURL}/api/prestador/${id}`);
        const data = await response.json();
        
        if (data.prestador) {
          setProvider(data.prestador);
        }
      } catch (error) {
        console.error('Error al cargar datos del prestador:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProviderData();
  }, [id]);

  const handleCall = () => {
    if (provider?.telefono) {
      window.location.href = `tel:${provider.telefono}`;
    }
  };

  const handleWhatsApp = () => {
    if (provider?.telefono) {
      const message = `Hola ${provider.nombre}, vi tu perfil en ServiLocal y me interesa tu servicio de ${provider.oficio}`;
      // Limpiar el número de teléfono (quitar espacios, guiones, etc)
      let cleanPhone = provider.telefono.replace(/\D/g, '');
      // Si empieza con 0, quitarlo (números locales en Ecuador)
      if (cleanPhone.startsWith('0')) {
        cleanPhone = cleanPhone.substring(1);
      }
      // Si el número no empieza con código de país, agregar 593 (Ecuador)
      const phone = cleanPhone.startsWith('593') ? cleanPhone : `593${cleanPhone}`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  const handleLocation = () => {
    if (provider?.direccion) {
      const query = encodeURIComponent(`${provider.direccion}, ${provider.ciudad}, Ecuador`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="provider-profile-loading">
        <div className="loading-spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="provider-profile-error">
        <h2>Prestador no encontrado</h2>
        <p>El perfil que buscas no está disponible.</p>
      </div>
    );
  }

  return (
    <div className="provider-profile">
      {/* Header con logo */}
      <header className="profile-header-public">
        <div className="header-content">
          <img src="/images/LogoServiLocal.png" alt="ServiLocal" className="logo-public" />
          <h1 className="brand-name-public">ServiLocal</h1>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="profile-main">
        <div className="profile-container-public">
          {/* Tarjeta principal del perfil */}
          <div className="profile-card-public">
            {/* Avatar y nombre */}
            <div className="profile-hero">
              <div className="profile-avatar-public">
                {provider.foto ? (
                  <img 
                    src={`http://localhost:5000${provider.foto}`} 
                    alt={provider.nombre} 
                    className="avatar-image"
                  />
                ) : (
                  <div className="avatar-circle">👤</div>
                )}
              </div>
              <h2 className="provider-name">{provider.nombre}</h2>
              <p className="provider-role">{provider.oficio}</p>
              <div className="provider-location">
                <span className="location-icon">📍</span>
                <span>{provider.ciudad}</span>
              </div>
            </div>

            {/* Botones de acción principales */}
            <div className="action-buttons">
              <button className="btn-action btn-call" onClick={handleCall}>
                <span className="btn-icon">📞</span>
                <span className="btn-text">Llamar</span>
              </button>
              <button className="btn-action btn-whatsapp" onClick={handleWhatsApp}>
                <span className="btn-icon">💬</span>
                <span className="btn-text">WhatsApp</span>
              </button>
              <button className="btn-action btn-location" onClick={handleLocation}>
                <span className="btn-icon">📍</span>
                <span className="btn-text">Ubicación</span>
              </button>
            </div>

            {/* Información de contacto */}
            <div className="contact-info-section">
              <h3 className="section-title">Información de Contacto</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Teléfono:</span>
                  <span className="info-value">{provider.telefono}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Ciudad:</span>
                  <span className="info-value">{provider.ciudad}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Dirección:</span>
                  <span className="info-value">{provider.direccion}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Usuario:</span>
                  <span className="info-value">@{provider.username}</span>
                </div>
              </div>
            </div>

            {/* Horarios */}
            <div className="schedule-section">
              <h3 className="section-title">Horarios de Atención</h3>
              <div className="schedule-box">
                <div className="schedule-item">
                  <span className="schedule-icon">📅</span>
                  <span className="schedule-text">{provider.dias_atencion || 'No especificado'}</span>
                </div>
                <div className="schedule-item">
                  <span className="schedule-icon">🕐</span>
                  <span className="schedule-text">
                    {provider.horario_inicio && provider.horario_fin 
                      ? `${provider.horario_inicio} - ${provider.horario_fin}`
                      : 'No especificado'}
                  </span>
                </div>
              </div>
            </div>

            {/* Cédula */}
            {provider.cedula && (
              <div className="verification-section">
                <div className="verification-badge">
                  <span className="badge-icon">✓</span>
                  <span className="badge-text">Cédula verificada: {provider.cedula}</span>
                </div>
              </div>
            )}

            {/* Pie de página */}
            <div className="profile-footer">
              <p className="footer-text">Perfil proporcionado por ServiLocal</p>
              <p className="footer-subtext">Conectando servicios locales con la comunidad</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProviderProfile;
