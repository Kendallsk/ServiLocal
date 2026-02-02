import { useEffect, useState } from "react";
import axios from "axios";

const usePrestadoresByCategoria = (categoria) => {
  const [prestadores, setPrestadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoria) return;

    const fetchPrestadores = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/prestadores/categoria/${categoria}`
        );

        // 👇 IMPORTANTE
        setPrestadores(res.data.prestadores || []);
      } catch (err) {
        setError("Error al cargar prestadores");
        setPrestadores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrestadores();
  }, [categoria]);

  return { prestadores, loading, error };
};

export default usePrestadoresByCategoria;
