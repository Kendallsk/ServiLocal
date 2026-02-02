import { useEffect, useState } from 'react';
import axios from 'axios';

const usePrestadoresByCategoria = (categoria) => {
  const [prestadores, setPrestadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoria) return;

    const fetchPrestadores = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:3000/api/prestadores?oficio=${categoria}`
        );
        setPrestadores(response.data);
      } catch (err) {
        setError('Error al obtener los prestadores');
      } finally {
        setLoading(false);
      }
    };

    fetchPrestadores();
  }, [categoria]);

  return { prestadores, loading, error };
};

export default usePrestadoresByCategoria;
