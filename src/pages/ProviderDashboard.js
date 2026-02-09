import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';
import './ProviderDashboard.css';

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(true);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no debe superar 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast.error('Solo se permiten imágenes JPG, JPEG o PNG');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
        if (photoFile) {
          const photoData = new FormData();
          photoData.append('foto', photoFile);
          photoData.append('userId', user.id);
          
          const photoResponse = await fetch('http://localhost:5000/api/prestador/upload-foto', {
            method: 'POST',
            body: photoData
          });
          
          const photoResult = await photoResponse.json();
          
          if (photoResult.success) {
            const updatedUser = { ...user, ...formData, foto: photoResult.fotoPath };
            setUser(updatedUser);
            setPhotoFile(null);
            setPhotoPreview(null);
            toast.success('Perfil y foto actualizados correctamente');
          } else {
            toast.warning('Datos actualizados, pero hubo un error al subir la foto');
          }
        } else {
          const updatedUser = { ...user, ...formData };
          setUser(updatedUser);
          toast.success('Datos actualizados correctamente');
        }
        setIsEditing(false);
      } else {
        toast.error('Error al actualizar los datos');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error('Error al guardar los cambios');
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
    setPhotoFile(null);
    setPhotoPreview(null);
    setIsEditing(false);
  };

  const descargarQR = () => {
    const svg = document.getElementById('qr-code-svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Tamaño del canvas
    canvas.width = 500;
    canvas.height = 800;
    
    // Fondo blanco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Decoración superior con curvas - gradiente del sistema
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 140);
    gradient.addColorStop(0, '#00bcd4');
    gradient.addColorStop(1, '#4caf50');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.lineTo(canvas.width, 120);
    ctx.bezierCurveTo(canvas.width * 0.7, 160, canvas.width * 0.3, 100, 0, 140);
    ctx.closePath();
    ctx.fill();
    
    // Función para dibujar rectángulos redondeados
    const roundRect = (x, y, w, h, r) => {
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
    
    let imagesLoaded = 0;
    const totalImages = 3; // logo, foto perfil, QR
    
    const checkAndDownload = () => {
      imagesLoaded++;
      if (imagesLoaded === totalImages) {
        // Texto inferior
        ctx.fillStyle = '#666666';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Escanea para comunicarte directamente con el prestador', canvas.width / 2, 730);
        
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `QR-${user?.nombre || 'prestador'}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    
    // Cargar logo de ServiLocal
    const logo = new Image();
    logo.crossOrigin = 'anonymous';
    logo.onload = () => {
      // Dibujar logo centrado y más grande
      const logoWidth = 180;
      const logoHeight = 60;
      const logoX = (canvas.width - logoWidth) / 2;
      const logoY = 40;
      ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
      checkAndDownload();
    };
    logo.onerror = () => {
      // Si falla, no dibujar nada
      checkAndDownload();
    };
    logo.src = '/images/LogoServiLocalQR.png';
    
    // Tarjeta blanca principal
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;
    roundRect(30, 160, 440, 540, 25);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    
    // Cargar foto de perfil
    const profileImg = new Image();
    profileImg.crossOrigin = 'anonymous';
    profileImg.onload = () => {
      // Círculo con gradiente para la foto
      ctx.save();
      const profileGradient = ctx.createLinearGradient(185, 185, 315, 315);
      profileGradient.addColorStop(0, '#00bcd4');
      profileGradient.addColorStop(1, '#4caf50');
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 250, 65, 0, Math.PI * 2);
      ctx.closePath();
      ctx.strokeStyle = profileGradient;
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.clip();
      ctx.drawImage(profileImg, canvas.width / 2 - 65, 185, 130, 130);
      ctx.restore();
      checkAndDownload();
    };
    profileImg.onerror = () => {
      // Si falla, dibujar círculo con emoji
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 250, 65, 0, Math.PI * 2);
      ctx.fillStyle = '#f0f0f0';
      ctx.fill();
      const profileGradient = ctx.createLinearGradient(185, 185, 315, 315);
      profileGradient.addColorStop(0, '#00bcd4');
      profileGradient.addColorStop(1, '#4caf50');
      ctx.strokeStyle = profileGradient;
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.font = '70px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#666';
      ctx.fillText('👤', canvas.width / 2, 250);
      checkAndDownload();
    };
    if (user?.foto) {
      profileImg.src = `http://localhost:5000${user.foto}`;
    } else {
      profileImg.onerror();
    }
    
    // Nombre del usuario
    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(user?.nombre || 'Prestador', canvas.width / 2, 350);
    
    // Oficio
    ctx.fillStyle = '#6b7280';
    ctx.font = '24px Arial';
    ctx.fillText(user?.oficio || 'Servicio', canvas.width / 2, 385);
    
    // Rectángulo para el QR con gradiente
    const qrGradient = ctx.createLinearGradient(90, 420, 410, 670);
    qrGradient.addColorStop(0, '#00bcd4');
    qrGradient.addColorStop(1, '#4caf50');
    ctx.strokeStyle = qrGradient;
    ctx.lineWidth = 4;
    roundRect(90, 420, 320, 250, 20);
    ctx.stroke();
    
    // Cargar y dibujar el QR
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 105, 435, 290, 220);
      checkAndDownload();
    };
    qrImg.src = 'data:image/svg+xml;base64,' + btoa(svgData);
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

  // Crear link de WhatsApp con número de teléfono y código de país Ecuador (+593)
  const formatPhoneForWhatsApp = (phone) => {
    if (!phone) return '';
    // Eliminar todo excepto números
    let cleanPhone = phone.replace(/\D/g, '');
    // Si empieza con 0, quitarlo (números locales en Ecuador)
    if (cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.substring(1);
    }
    // Si no tiene código de país, agregar 593 (Ecuador)
    if (!cleanPhone.startsWith('593')) {
      cleanPhone = '593' + cleanPhone;
    }
    return cleanPhone;
  };
  
  const whatsappURL = `https://wa.me/${formatPhoneForWhatsApp(user?.telefono)}?text=Hola,%20vi%20tu%20anuncio%20en%20ServiLocal%20y%20me%20interesa%20tu%20servicio%20de%20${user?.oficio || 'servicios'}`;
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
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="avatar-img" />
                  ) : user?.foto ? (
                    <img src={`http://localhost:5000${user.foto}`} alt={user.nombre} className="avatar-img" />
                  ) : (
                    <span className="avatar-icon">👤</span>
                  )}
                  {isEditing && (
                    <label className="edit-photo-overlay">
                      <input 
                        type="file" 
                        accept="image/jpeg,image/png,image/jpg" 
                        onChange={handlePhotoChange}
                        className="photo-input-hidden"
                      />
                      <span className="edit-icon">✏️</span>
                    </label>
                  )}
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
                {photoFile && (
                  <div className="photo-selected-info">
                    Nueva foto seleccionada
                  </div>
                )}
                
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
                    <input type="text" name="username" value={formData.username} onChange={handleChange} disabled />
                  </div>
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Oficio</label>
                    <select name="oficio" value={formData.oficio} onChange={handleChange}>
                      <option value="">Seleccionar oficio</option>
                      <option value="Electricista">Electricista</option>
                      <option value="Plomero">Plomero</option>
                      <option value="Gas">Gas</option>
                      <option value="Carpintero">Carpintero</option>
                      <option value="Albañil">Albañil</option>
                      <option value="Niñera">Niñera</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Ciudad</label>
                    <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Dirección</label>
                    <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Días de Atención</label>
                    <select name="dias_atencion" value={formData.dias_atencion} onChange={handleChange}>
                      <option value="">Seleccionar días</option>
                      <option value="Lunes a Viernes">Lunes a Viernes</option>
                      <option value="Lunes a Sábado">Lunes a Sábado</option>
                      <option value="Todos los días">Todos los días</option>
                    </select>
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
