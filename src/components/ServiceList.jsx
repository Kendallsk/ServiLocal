import { useParams } from 'react-router-dom';
import usePrestadoresByCategoria from '../hooks/usePrestadoresByCategoria';

const ServiceList = () => {
  const { categoria } = useParams();
  const { prestadores, loading, error } =
    usePrestadoresByCategoria(categoria);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Prestadores de {categoria}</h2>

      {prestadores.length === 0 && <p>No hay resultados</p>}

      {prestadores.map((p) => (
        <div key={p.id}>
          <h4>{p.nombre}</h4>
          <p>{p.telefono}</p>
        </div>
      ))}
    </div>
  );
};

export default ServiceList;
