import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MagicCard } from "react-magic-motion";
import "react-magic-motion/card.css";

const ServicesByCategory = () => {
  const { categoria } = useParams();
  const navigate = useNavigate();
  const [prestadores, setPrestadores] = useState([]);
  const [selected, setSelected] = useState(null);
  const backendURL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
      ? "http://localhost:5000"
      : `http://${window.location.hostname}:5000`;

  // Formatear teléfono para WhatsApp con código de país
  const formatPhoneForWhatsApp = (phone) => {
    if (!phone) return '';
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.substring(1);
    }
    if (!cleanPhone.startsWith('593')) {
      cleanPhone = '593' + cleanPhone;
    }
    return cleanPhone;
  };

  const categoryBackgrounds = {
    electricista:
      "https://plus.unsplash.com/premium_photo-1661908782924-de673a5c6988?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZWxlY3RyaWNpc3RhfGVufDB8fDB8fHww",
    plomero:
      "https://plus.unsplash.com/premium_photo-1663045495725-89f23b57cfc5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGxvbWVyb3xlbnwwfHwwfHx8MA%3D%3D",
    gas: "https://imagenes.primicias.ec/files/og_thumbnail/uploads/2024/05/25/6652b9f900cd0.jpeg",
    carpintero:
      "https://plus.unsplash.com/premium_photo-1664300494539-313eac2a6095?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FycGludGVyb3xlbnwwfHwwfHx8MA%3D%3D",
    albanil:
      "https://media.istockphoto.com/id/2183863027/es/foto/trabajador-de-la-construcci%C3%B3n-sonriendo-y-usando-su-tel%C3%A9fono-celular-en-una-obra.webp?a=1&b=1&s=612x612&w=0&k=20&c=sxEkWS8rnPw2OEzPOnrjmJ0ImTPmrcM5jgV6CzX9Vgo=",
    ninera:
      "https://plus.unsplash.com/premium_photo-1710024588156-8fd763d86961?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bmklQzMlQjFlcmF8ZW58MHx8MHx8fDA%3D",
    pintor:
      "https://images.unsplash.com/photo-1602910344216-bd2226c18d4c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGludG9yfGVufDB8fDB8fHww",
  };

  const backgroundImage =
    categoryBackgrounds[String(categoria || "").toLowerCase()];

useEffect(() => {
  fetch(`${backendURL}/api/prestadores?oficio=${categoria}`)
    .then(res => res.json())
    .then(data => {
      // 🔒 PROTECCIÓN TOTAL
      setPrestadores(data.prestadores || []);
    })
    .catch(err => {
      console.error(err);
      setPrestadores([]);
    });
}, [categoria]);


  const img =
    "https://st3.depositphotos.com/14807954/19325/i/450/depositphotos_193252528-stock-photo-a-young-man-mimicing-against.jpg";
  const getFotoUrl = (foto) => (foto ? `${backendURL}${foto}` : img);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 30,
        position: "relative",
        backgroundColor: "#accbf3",
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {backgroundImage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(225, 238, 248, 0.82)",
          }}
        />
      )}

      <div style={{ position: "relative", zIndex: 1 }}>

      {/* BOTÓN HOME */}
     <button
  onClick={() => navigate("/")}
  title="Volver al inicio"
  style={{
    position: "fixed",
    top: 20,
    right: 20,
    zIndex: 3000,
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(255,255,255,0.75)",
    color: "white",
    fontSize: "1.5rem",
    cursor: "pointer",
    boxShadow: "0 6px 15px rgba(255,255,255,0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}
>
  🏠
</button>

      {/* HEADER */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto 50px",
          padding: 30,
          textAlign: "center",
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(12px)",
          borderRadius: 22,
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
        }}
      >
        <h1 style={{
          margin: 0,
          fontSize: "2.6rem",
          color: "#00bcd4"
        }}>
          Servicios de {categoria}
        </h1>

        <p style={{ marginTop: 10, color: "#555", fontSize: "1.15rem" }}>
          Profesionales disponibles para ayudarte
        </p>
      </div>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 26,
          maxWidth: 1200,
          margin: "0 auto"
        }}
      >
        {prestadores.map(p => (
          <div
            key={p.id}
            onClick={() => setSelected(p)}
            style={{
              background: "white",
              borderRadius: 18,
              overflow: "hidden",
              cursor: "pointer",
              border: "1.5px solid #bcf5ec",
              boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
              transition: "transform 0.3s"
            }}
            onMouseEnter={e =>
              (e.currentTarget.style.transform = "translateY(-6px)")
            }
            onMouseLeave={e =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <img
              src={getFotoUrl(p.foto)}
              alt={p.nombre}
              onError={(e) => {
                e.currentTarget.src = img;
              }}
              style={{ width: "100%", height: 200, objectFit: "cover" }}
            />
            <div style={{ padding: 18 }}>
              <h3 style={{ margin: 0, color: "#00bcd4" }}>{p.nombre}</h3>
              <p style={{ marginTop: 6, color: "#555" }}>
                {p.oficio} · {p.ciudad}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL EXPANDIDO */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 4000,
            animation: "fadeIn 0.35s ease"
          }}
        >
          <MagicCard
            onClick={e => e.stopPropagation()}
            transition={{ type: "spring", stiffness: 160, damping: 18 }}
            style={{
              width: 720,
              maxWidth: "92%",
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(18px)",
              borderRadius: 28,
              overflow: "hidden",
              border: "1.8px solid rgba(255,255,255,0.6)",
              boxShadow: "0 40px 90px rgba(0,0,0,0.6)",
              animation: "scaleUp 0.45s ease"
            }}
          >
            {/* IMAGEN */}
            <div style={{ height: 360 }}>
              <img
                src={getFotoUrl(selected.foto)}
                alt={selected.nombre}
                onError={(e) => {
                  e.currentTarget.src = img;
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </div>

            {/* INFO */}
            <div style={{ padding: 32 }}>
              <h2 style={{ color: "#00bcd4", marginTop: 0 }}>
                {selected.nombre}
              </h2>

              <p><strong>Ciudad:</strong> {selected.ciudad}</p>
              <p><strong>Dirección:</strong> {selected.direccion}</p>
              <p><strong>Teléfono:</strong> {selected.telefono}</p>
              <p>
                <strong>Horario:</strong>{" "}
                {selected.horario_inicio} - {selected.horario_fin}
              </p>
              <p><strong>Días de atención:</strong> {selected.dias_atencion}</p>

              <a
                href={`https://wa.me/${formatPhoneForWhatsApp(selected.telefono)}?text=Hola,%20vi%20tu%20anuncio%20en%20ServiLocal%20y%20me%20interesa%20tu%20servicio%20de%20${selected.oficio}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: 28,
                  padding: "12px 34px",
                  background: "#25D366",
                  color: "white",
                  borderRadius: 40,
                  fontWeight: "bold",
                  textDecoration: "none",
                  fontSize: "1.05rem"
                }}
              >
                Contactar por WhatsApp
              </a>
            </div>
          </MagicCard>
        </div>
      )}

      {/* ANIMACIONES */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes scaleUp {
            from {
              opacity: 0;
              transform: scale(0.92) translateY(30px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}
      </style>
      </div>
    </div>
  );
};

export default ServicesByCategory;
