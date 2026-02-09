import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosPublic from '../api/axiosPublic';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [prestadores, setPrestadores] = useState([]);
  const [prestadoresPendientes, setPrestadoresPendientes] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
      cargarDatos();
    }
  }, []);

  const cargarDatos = async () => {
    try {
      const [resUsuarios, resPrestadores, resEstadisticas, resPendientes] = await Promise.all([
        axiosPublic.get('/api/usuarios'),
        axiosPublic.get('/api/prestadores'),
        axiosPublic.get('/api/estadisticas'),
        axiosPublic.get('/api/prestadores/pendientes')
      ]);
      
      setUsuarios(resUsuarios.data.usuarios || []);
      setPrestadores(resPrestadores.data.prestadores || []);
      setEstadisticas(resEstadisticas.data.estadisticas || {});
      setPrestadoresPendientes(resPendientes.data.prestadores || []);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setLoading(false);
    }
  };

  const eliminarUsuario = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await axiosPublic.delete(`/api/usuarios/${id}`);
        mostrarMensaje('Usuario eliminado exitosamente', 'success');
        cargarDatos();
      } catch (error) {
        mostrarMensaje('Error al eliminar usuario', 'error');
      }
    }
  };

  const aprobarPrestador = async (id) => {
    if (window.confirm('¿Deseas aprobar este prestador?')) {
      try {
        await axiosPublic.put(`/api/prestadores/${id}/aprobar`);
        mostrarMensaje('Prestador aprobado exitosamente', 'success');
        cargarDatos();
      } catch (error) {
        mostrarMensaje('Error al aprobar prestador', 'error');
      }
    }
  };

  const rechazarPrestador = async (id) => {
    if (window.confirm('¿Deseas rechazar este prestador? El usuario no podrá acceder al sistema.')) {
      try {
        await axiosPublic.put(`/api/prestadores/${id}/rechazar`);
        mostrarMensaje('Prestador rechazado', 'success');
        cargarDatos();
      } catch (error) {
        mostrarMensaje('Error al rechazar prestador', 'error');
      }
    }
  };

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(''), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f7fa' }}>
        <div style={{ fontSize: '24px', color: '#00bcd4' }}>Cargando...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        background: 'linear-gradient(180deg, #00bcd4 0%, #ff9800 100%)',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Logo */}
        <div style={{
          padding: '30px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '28px',
            color: 'white',
            margin: '0 0 5px 0',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            ServiLocal
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '14px' }}>Panel Admin</p>
        </div>

        {/* User Info */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          color: 'white'
        }}>
          <div style={{ fontSize: '40px', textAlign: 'center', marginBottom: '10px' }}>👤</div>
          <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>
            {currentUser?.nombre}
          </div>
          <div style={{ textAlign: 'center', fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>
            {currentUser?.rol}
          </div>
        </div>

        {/* Menu Navigation */}
        <div style={{ flex: 1, padding: '20px 0' }}>
          <MenuItem 
            icon="📊" 
            label="Dashboard" 
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          <MenuItem 
            icon="👥" 
            label="Usuarios" 
            active={activeTab === 'usuarios'}
            onClick={() => setActiveTab('usuarios')}
          />
          <MenuItem 
            icon="🛠️" 
            label="Prestadores" 
            active={activeTab === 'prestadores'}
            onClick={() => setActiveTab('prestadores')}
          />
          <MenuItem 
            icon="⏳" 
            label="Aprobar Prestadores" 
            active={activeTab === 'aprobar'}
            onClick={() => setActiveTab('aprobar')}
            badge={prestadoresPendientes.length}
          />
        </div>

        {/* Logout Button */}
        <div style={{ padding: '20px' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '30px', overflow: 'auto' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px 30px',
          marginBottom: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ 
            margin: 0, 
            color: '#333',
            fontSize: '24px'
          }}>
            {activeTab === 'dashboard' && '📊 Dashboard'}
            {activeTab === 'usuarios' && '👥 Gestión de Usuarios'}
            {activeTab === 'prestadores' && '🛠️ Prestadores de Servicios'}
            {activeTab === 'aprobar' && '⏳ Aprobar Prestadores'}
          </h2>
        </div>

        {/* Mensaje de notificación */}
        {mensaje && (
          <div style={{
            background: mensaje.tipo === 'success' ? '#4caf50' : '#f44336',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {mensaje.texto}
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && estadisticas && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '25px',
              marginBottom: '30px'
            }}>
              <StatCard 
                icon="👥" 
                title="Total Usuarios" 
                value={estadisticas.totalUsuarios} 
                color="#00bcd4"
                subtitle="Usuarios registrados"
              />
              <StatCard 
                icon="🛠️" 
                title="Prestadores" 
                value={estadisticas.totalPrestadores} 
                color="#ff9800"
                subtitle="Proveedores de servicio"
              />
              <StatCard 
                icon="👨‍💼" 
                title="Clientes" 
                value={estadisticas.totalClientes} 
                color="#9c27b0"
                subtitle="Clientes registrados"
              />
            </div>

            {/* Quick Actions */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              marginTop: '25px'
            }}>
              <h3 style={{ marginTop: 0, color: '#333', marginBottom: '20px' }}>⚡ Acciones Rápidas</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <QuickActionButton 
                  icon="👥" 
                  label="Ver Usuarios" 
                  onClick={() => setActiveTab('usuarios')}
                />
                <QuickActionButton 
                  icon="🛠️" 
                  label="Ver Prestadores" 
                  onClick={() => setActiveTab('prestadores')}
                />
                <QuickActionButton 
                  icon="🔄" 
                  label="Actualizar Datos" 
                  onClick={cargarDatos}
                />
              </div>
            </div>
          </div>
        )}

        {/* Usuarios Tab */}
        {activeTab === 'usuarios' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #00bcd4' }}>
                    <th style={tableHeaderStyle}>ID</th>
                    <th style={tableHeaderStyle}>Usuario</th>
                    <th style={tableHeaderStyle}>Nombre</th>
                    <th style={tableHeaderStyle}>Rol</th>
                    <th style={tableHeaderStyle}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                        📭 No hay usuarios registrados
                      </td>
                    </tr>
                  ) : (
                    usuarios.map(usuario => (
                      <tr key={usuario.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                        <td style={tableCellStyle}><strong>#{usuario.id}</strong></td>
                        <td style={tableCellStyle}>
                          <span style={{ 
                            background: '#e3f2fd', 
                            padding: '4px 10px', 
                            borderRadius: '6px',
                            color: '#0277bd',
                            fontWeight: '500'
                          }}>
                            @{usuario.username}
                          </span>
                        </td>
                        <td style={tableCellStyle}>{usuario.nombre}</td>
                        <td style={tableCellStyle}>
                          <span style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            background: usuario.rol === 'admin' ? '#ff9800' : '#00bcd4',
                            color: 'white',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                          }}>
                            {usuario.rol}
                          </span>
                        </td>
                        <td style={tableCellStyle}>
                          <button
                            onClick={() => eliminarUsuario(usuario.id)}
                            style={{
                              padding: '8px 16px',
                              background: '#f44336',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                          >
                            🗑️ Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Prestadores Tab */}
        {activeTab === 'prestadores' && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '25px'
            }}>
              {prestadores.length === 0 ? (
                <div style={{ 
                  gridColumn: '1 / -1', 
                  textAlign: 'center', 
                  padding: '60px', 
                  background: 'white',
                  borderRadius: '12px',
                  color: '#999'
                }}>
                  <div style={{ fontSize: '60px', marginBottom: '20px' }}>🛠️</div>
                  <p style={{ fontSize: '18px' }}>No hay prestadores registrados</p>
                </div>
              ) : (
                prestadores.map(prestador => (
                  <div key={prestador.id} style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{ fontSize: '60px', marginBottom: '15px' }}>🛠️</div>
                    <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '18px' }}>
                      {prestador.nombre}
                    </h3>
                    <p style={{ 
                      margin: '5px 0', 
                      color: '#666',
                      background: '#f5f5f5',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}>
                      @{prestador.username}
                    </p>
                    <div style={{ marginTop: '15px' }}>
                      <span style={{
                        padding: '6px 16px',
                        borderRadius: '20px',
                        background: '#4caf50',
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}>
                        ✅ Activo
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab Aprobar Prestadores */}
        {activeTab === 'aprobar' && (
          <div>
            {prestadoresPendientes.length === 0 ? (
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '60px 30px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '80px', marginBottom: '20px' }}>✅</div>
                <h3 style={{ color: '#333', marginBottom: '10px' }}>No hay prestadores pendientes</h3>
                <p style={{ color: '#666' }}>Todos los prestadores han sido procesados</p>
              </div>
            ) : (
              <div>
                <div style={{
                  background: '#fff3cd',
                  border: '1px solid #ffc107',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '20px',
                  color: '#856404'
                }}>
                  ⚠️ Tienes <strong>{prestadoresPendientes.length}</strong> prestador(es) esperando aprobación
                </div>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                  {prestadoresPendientes.map(prestador => (
                    <div key={prestador.id} style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '25px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto',
                      gap: '25px',
                      alignItems: 'center'
                    }}>
                      {/* Foto del prestador */}
                      <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {prestador.foto ? (
                          <img 
                            src={`http://localhost:5000${prestador.foto}`}
                            alt={prestador.nombre}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span style={{ fontSize: '50px' }}>👤</span>
                        )}
                      </div>

                      {/* Información del prestador */}
                      <div>
                        <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '20px' }}>
                          {prestador.nombre}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                          <div>
                            <strong>Usuario:</strong> @{prestador.username}
                          </div>
                          <div>
                            <strong>Cédula:</strong> {prestador.cedula}
                          </div>
                          <div>
                            <strong>Oficio:</strong> {prestador.oficio}
                          </div>
                          <div>
                            <strong>Teléfono:</strong> {prestador.telefono}
                          </div>
                          <div>
                            <strong>Ciudad:</strong> {prestador.ciudad}
                          </div>
                          <div>
                            <strong>Dirección:</strong> {prestador.direccion}
                          </div>
                          <div style={{ gridColumn: '1 / -1' }}>
                            <strong>Horario:</strong> {prestador.dias_atencion} - {prestador.horario_inicio} a {prestador.horario_fin}
                          </div>
                        </div>
                        <div style={{
                          marginTop: '10px',
                          padding: '8px 12px',
                          background: '#fff3cd',
                          borderRadius: '6px',
                          display: 'inline-block',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          color: '#856404'
                        }}>
                          ⏳ Estado: Pendiente
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button
                          onClick={() => aprobarPrestador(prestador.id)}
                          style={{
                            padding: '12px 24px',
                            background: '#4caf50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            transition: 'background 0.3s',
                            whiteSpace: 'nowrap'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#45a049'}
                          onMouseOut={(e) => e.currentTarget.style.background = '#4caf50'}
                        >
                          ✅ Aprobar
                        </button>
                        <button
                          onClick={() => rechazarPrestador(prestador.id)}
                          style={{
                            padding: '12px 24px',
                            background: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            transition: 'background 0.3s',
                            whiteSpace: 'nowrap'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#da190b'}
                          onMouseOut={(e) => e.currentTarget.style.background = '#f44336'}
                        >
                          ❌ Rechazar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente MenuItem
const MenuItem = ({ icon, label, active, onClick, badge }) => (
  <div
    onClick={onClick}
    style={{
      padding: '15px 25px',
      color: 'white',
      cursor: 'pointer',
      background: active ? 'rgba(255,255,255,0.2)' : 'transparent',
      borderLeft: active ? '4px solid white' : '4px solid transparent',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      fontSize: '15px',
      fontWeight: active ? 'bold' : 'normal'
    }}
    onMouseOver={(e) => {
      if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
    }}
    onMouseOut={(e) => {
      if (!active) e.currentTarget.style.background = 'transparent';
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <span>{label}</span>
    </div>
    {badge > 0 && (
      <span style={{
        background: '#ff5252',
        color: 'white',
        borderRadius: '12px',
        padding: '2px 8px',
        fontSize: '12px',
        fontWeight: 'bold',
        minWidth: '20px',
        textAlign: 'center'
      }}>
        {badge}
      </span>
    )}
  </div>
);

// Componente StatCard
const StatCard = ({ icon, title, value, color, subtitle }) => (
  <div style={{
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    transition: 'transform 0.2s'
  }}
  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
  >
    <div style={{
      width: '80px',
      height: '80px',
      borderRadius: '12px',
      background: `linear-gradient(135deg, ${color}dd, ${color})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '40px',
      boxShadow: `0 4px 12px ${color}40`
    }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '36px', fontWeight: 'bold', color: color, marginBottom: '5px' }}>
        {value}
      </div>
      <div style={{ fontSize: '16px', color: '#666', fontWeight: '500' }}>
        {title}
      </div>
      <div style={{ fontSize: '13px', color: '#999', marginTop: '3px' }}>
        {subtitle}
      </div>
    </div>
  </div>
);

// Componente QuickActionButton
const QuickActionButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '15px 20px',
      background: 'linear-gradient(to right, #00bcd4, #ff9800)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      justifyContent: 'center',
      transition: 'all 0.3s',
      boxShadow: '0 2px 8px rgba(0,188,212,0.3)'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,188,212,0.4)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,188,212,0.3)';
    }}
  >
    <span style={{ fontSize: '20px' }}>{icon}</span>
    <span>{label}</span>
  </button>
);

const tableHeaderStyle = {
  padding: '15px 12px',
  textAlign: 'left',
  fontWeight: 'bold',
  color: '#333',
  fontSize: '14px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const tableCellStyle = {
  padding: '15px 12px',
  textAlign: 'left',
  color: '#555',
  fontSize: '14px'
};

export default AdminDashboard;