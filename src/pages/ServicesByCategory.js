import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const ServicesByCategory = () => {
  const { categoria } = useParams();
  const [prestadores, setPrestadores] = useState([]);

  useEffect(() => {
    // Simulación (luego conectamos backend)
    fetch(`/api/prestadores?categoria=${categoria}`)
      .then(res => res.json())
      .then(data => setPrestadores(data))
      .catch(err => console.error(err));
  }, [categoria]);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Servicios de {categoria}</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
        {prestadores.map(p => (
          <div key={p.id} style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "12px" }}>
            <h3>{p.nombre}</h3>
            <p>{p.descripcion}</p>

            <a href={`https://wa.me/${p.whatsapp}`} target="_blank" rel="noreferrer">
              Contactar WhatsApp
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesByCategory;
