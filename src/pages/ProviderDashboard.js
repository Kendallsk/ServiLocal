import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './ProviderDashboard.css';

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    username: '',
    telefono: '',
    oficio: '',
    ciudad: '',
    direccion: '',
    dias_atencion: '',
    horario_inicio: '',
    horario_fin: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedUser = localStorage.getItem('currentUser');
      if (loggedUser) {
        const userData = JSON.parse(loggedUser);
        
        try {
          // Obtener datos actualizados desde la base de datos
          const response = await fetch(`http://localhost:5000/api/prestador/${userData.id}`);
          const data = await response.json();
          
          if (data.prestador) {
            const prestador = data.prestador;
            setUser(prestador);
            setFormData({
              nombre: prestador.nombre || '',
              cedula: prestador.cedula || '',
              username: prestador.username || '',
              telefono: prestador.telefono || '',
              oficio: prestador.oficio || '',
              ciudad: prestador.ciudad || '',
              direccion: prestador.direccion || '',
              dias_atencion: prestador.dias_atencion || '',
              horario_inicio: prestador.horario_inicio?.substring(0, 5) || '',
              horario_fin: prestador.horario_fin?.substring(0, 5) || ''
            });
          }
        } catch (error) {
          console.error('Error al cargar datos del prestador:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/prestador/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          cedula: formData.cedula,
          telefono: formData.telefono,
          oficio: formData.oficio,
          ciudad: formData.ciudad,
          direccion: formData.direccion,
          dias_atencion: formData.dias_atencion,
          horario_inicio: formData.horario_inicio + ':00',
          horario_fin: formData.horario_fin + ':00'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const updatedUser = { ...user, ...formData };
        setUser(updatedUser);
        setIsEditing(false);
        alert('Datos actualizados correctamente');
      } else {
        alert('Error al actualizar los datos');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar los cambios');
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: user.nombre || '',
      cedula: user.cedula || '',
      username: user.username || '',
      telefono: user.telefono || '',
      oficio: user.oficio || '',
      ciudad: user.ciudad || '',
      direccion: user.direccion || '',
      dias_atencion: user.dias_atencion || '',
      horario_inicio: user.horario_inicio || '',
      horario_fin: user.horario_fin || ''
    });
    setIsEditing(false);
  };

  const descargarQR = () => {
    const svg = document.getElementById('qr-code-svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Tamaño del canvas con espacio para decoración
    canvas.width = 400;
    canvas.height = 500;
    
    // Fondo con gradiente
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#00bcd4');
    gradient.addColorStop(0.5, '#4caf50');
    gradient.addColorStop(1, '#ff9800');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Rectángulo blanco para el QR
    ctx.fillStyle = 'white';
    ctx.roundRect = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };
    ctx.roundRect(30, 80, 340, 340, 20);
    ctx.fill();
    
    // Título
    ctx.fillStyle = 'white';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ServiLocal', canvas.width / 2, 50);
    
    // Información del prestador
    ctx.font = 'bold 22px Arial';
    ctx.fillText(user?.nombre || 'Prestador', canvas.width / 2, 450);
    ctx.font = '18px Arial';
    ctx.fillText(user?.oficio || '', canvas.width / 2, 480);
    
    // Cargar y dibujar el QR
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 50, 100, 300, 300);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `QR-${user?.nombre || 'prestador'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  if (loading || !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ fontSize: '20px', color: '#666' }}>Cargando datos...</div>
      </div>
    );
  }

  const getLocalIP = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000'; // Cambiar la Ip mi computadora http://192.168.1.105:3000
    }
    return window.location.origin;
  };

  // Crear link de WhatsApp con número de teléfono
  const whatsappURL = `https://wa.me/${user?.telefono?.replace(/\D/g, '')}?text=Hola,%20me%20interesa%20tus%20servicios%20de%20${user?.oficio || 'servicios'}`;
  const profileURL = whatsappURL;

  return (
    <div className="provider-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-container">
          <div className="logo-section">
            <img src="/images/LogoServiLocal.png" alt="ServiLocal" className="logo" />
            <h1 className="brand-name">ServiLocal</h1>
          </div>
          <button onClick={handleLogout} className="logout-btn" title="Cerrar Sesión">
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="profile-container">
          <div className="profile-card-wrapper">
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  <span className="avatar-icon"></span>
                </div>
                <h2 className="profile-name">{isEditing ? formData.nombre : user?.nombre}</h2>
                <p className="profile-username">@{isEditing ? formData.username : user?.username}</p>
              </div>

              {/* Modo vista */}
              {!isEditing ? (
              <div className="profile-view">
                <div className="profile-details">
                  <div className="detail-row">
                    <span className="detail-label">Cédula:</span>
                    <span className="detail-value">{user?.cedula || 'No especificado'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Oficio:</span>
                    <span className="detail-value">{user?.oficio || 'No especificado'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Teléfono:</span>
                    <span className="detail-value">{user?.telefono || 'No especificado'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Ciudad:</span>
                    <span className="detail-value">{user?.ciudad || 'No especificado'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Dirección:</span>
                    <span className="detail-value">{user?.direccion || 'No especificado'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Días de atención:</span>
                    <span className="detail-value">{user?.dias_atencion || 'No especificado'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Horario:</span>
                    <span className="detail-value">
                      {user?.horario_inicio && user?.horario_fin 
                        ? `${user.horario_inicio} - ${user.horario_fin}` 
                        : 'No especificado'}
                    </span>
                  </div>
                </div>
                <button className="btn-edit" onClick={() => setIsEditing(true)}>
                  Editar Perfil
                </button>
              </div>
            ) : (
              /* Modo edición */
              <div className="profile-edit">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nombre Completo</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Cédula</label>
                    <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Usuario</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Oficio</label>
                    <input type="text" name="oficio" value={formData.oficio} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Ciudad</label>
                    <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} />
                  </div>
                  <div className="form-group full-width">
                    <label>Dirección</label>
                    <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Días de Atención</label>
                    <input type="text" name="dias_atencion" value={formData.dias_atencion} onChange={handleChange} placeholder="Ej: Lunes a Viernes" />
                  </div>
                  <div className="form-group">
                    <label>Horario Inicio</label>
                    <input type="time" name="horario_inicio" value={formData.horario_inicio} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Horario Fin</label>
                    <input type="time" name="horario_fin" value={formData.horario_fin} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-actions">
                  <button className="btn-save" onClick={handleSave}>Guardar</button>
                  <button className="btn-cancel" onClick={handleCancel}>Cancelar</button>
                </div>
              </div>
            )}
            </div>

            {/* Sección de QR a la derecha */}
          <div className="qr-section-sidebar">
            <h3>Código QR del Perfil</h3>
            {!showQR ? (
              <button className="btn-generate-qr" onClick={() => setShowQR(true)}>
                Generar Código QR
              </button>
            ) : (
              <div className="qr-display">
                <div className="qr-code-wrapper">
                  <QRCodeSVG
                    id="qr-code-svg"
                    value={whatsappURL}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="qr-url" style={{fontSize: '12px', wordBreak: 'break-all'}}>WhatsApp: {user?.telefono}</p>
                <div className="qr-actions">
                  <button className="btn-download-qr" onClick={descargarQR}>
                    Descargar
                  </button>
                  <button className="btn-hide-qr" onClick={() => setShowQR(false)}>
                    Ocultar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default ProviderDashboard;