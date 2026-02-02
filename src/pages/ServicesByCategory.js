import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MagicCard } from "react-magic-motion";
import "react-magic-motion/card.css";

const ServicesByCategory = () => {
  const { categoria } = useParams();
  const navigate = useNavigate();
  const [prestadores, setPrestadores] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/prestadores?oficio=${categoria}`)
      .then(res => res.json())
      .then(data => setPrestadores(data))
      .catch(console.error);
  }, [categoria]);

  const img =
    "https://st3.depositphotos.com/14807954/19325/i/450/depositphotos_193252528-stock-photo-a-young-man-mimicing-against.jpg";

  return (
    <div style={{ minHeight: "100vh", background: "#accbf3", padding: 30 }}>

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
              src={img}
              alt={p.nombre}
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
                src={img}
                alt={selected.nombre}
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

              <p><strong>Oficio:</strong> {selected.oficio}</p>
              <p><strong>Ciudad:</strong> {selected.ciudad}</p>
              <p><strong>Teléfono:</strong> {selected.telefono}</p>
              <p>
                <strong>Horario:</strong>{" "}
                {selected.horario_inicio} - {selected.horario_fin}
              </p>

              <a
                href={`https://wa.me/593${selected.telefono}`}
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
  );
};

export default ServicesByCategory;
