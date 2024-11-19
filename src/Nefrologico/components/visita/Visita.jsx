import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const VisitaComponent = () => {
  const [visitas, setVisitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    // Función para cargar las visitas desde la API
    const fetchVisitas = async () => {
      try {
        const response = await axios.get('http://localhost:3200/api/visita');
        const visitasData = response.data.visitas || [];

        if (visitasData.length === 0) {
          setNoData(true);
        } else {
          setVisitas(visitasData); // Asignar el array de visitas desde la respuesta
        }
      } catch (error) {
        console.error('Error al cargar las visitas:', error);
        setError(true); // Establece el estado de error si ocurre un problema
      } finally {
        setLoading(false); // Deja de cargar una vez que los datos hayan sido procesados
      }
    };

    fetchVisitas(); // Llamar a la función para cargar visitas al montar el componente
  }, []); // El segundo argumento [] asegura que useEffect solo se ejecute una vez

  if (loading) {
    return (
      <div>
      <div className="border-bottom pt-5 mt-2 mb-5">
        <h1 className="mt-2 mt-md-4 mb-3 pt-5">Visitas</h1>
        <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
          <p className="text-muted">Este módulo lista todas las visitas registradas.</p>
          <p className="font-size-sm font-weight-medium pl-md-4">
          <Link className="text-nowrap" to="./nuevo">
              Registrar nueva
          <i className="cxi-angle-right font-size-base align-middle ml-1"></i>
          </Link>
          </p>
        </div>
      </div>
      <div className="d-flex justify-content-center align-items-center mt-5">
              <div className="spinner-border" role="status">
      </div>
      </div>
  
    </div>
    );
  }

  if (error) {
    return (
    <div>
      <div className="border-bottom pt-5 mt-2 mb-5">
        <h1 className="mt-2 mt-md-4 mb-3 pt-5">Visitas</h1>
        <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
          <p className="text-muted">Este módulo lista todas las visitas registradas.</p>
          <p className="font-size-sm font-weight-medium pl-md-4">
          <Link className="text-nowrap" to="./nuevo">
              Registrar nueva
          <i className="cxi-angle-right font-size-base align-middle ml-1"></i>
          </Link>
          </p>
        </div>
      </div>
      <div className="card text-center mt-4">
        <div className="card-body">
          <h5 className="card-title">
            <i className="bi bi-exclamation-triangle" style={{ fontSize: '2rem', color: 'red' }}></i>
          </h5>
          <p className="card-text">No es posible establecer conexión con el servidor 😢 </p>
        </div>
      </div>
  
    </div>
  
    );
  }

  return (
    <div>
      <div className="border-bottom pt-5 mt-2 mb-5">
        <h1 className="mt-2 mt-md-4 mb-3 pt-5">Visitas</h1>
        <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
          <p className="text-muted">Este módulo lista todas las visitas registradas.</p>
          <p className="font-size-sm font-weight-medium pl-md-4">
          <Link className="text-nowrap" to="./nuevo">
              Registrar nueva
          <i className="cxi-angle-right font-size-base align-middle ml-1"></i>
          </Link>
          </p>
        </div>
      </div>

      {noData ? (
        <div className="card text-center mt-4">
          <div className="card-body">
            <h5 className="card-title">
              <i className="bi bi-exclamation-triangle" style={{ fontSize: '2rem', color: 'red' }}></i>
            </h5>
            <p className="card-text">No hay visitas registradas en la base de datos.</p>
          </div>
        </div>
      ) : (
        <div className=" mt-4">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha de Visita</th>
                <th>Paciente</th>
                <th>PA</th>
                <th>FrC</th>
                <th>T(C)</th>
                <th>P(Kg)</th>
                <th>A(m)</th>
                <th>Edad</th>
                <th>Género</th>
                <th>Etnia</th>
                <th>Enfermedad</th>
              </tr>
            </thead>
            <tbody>
              {visitas.map((visita, index) => (
                <tr key={visita._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{new Date(visita.fechaVisita).toLocaleDateString()}</td>
                  <td>{visita.paciente ? visita.paciente.ci : 'N/A'}</td>
                  <td>{visita.signosVitales.presionArterial}</td>
                  <td>{visita.signosVitales.frecuenciaCardiaca}</td>
                  <td>{visita.signosVitales.temperatura}</td>
                  <td>{visita.signosVitales.peso}</td>
                  <td>{visita.signosVitales.altura}</td>
                  <td>{visita.paciente ? visita.paciente.edad : 'N/A'}</td>
                  <td>{visita.paciente ? visita.paciente.genero : 'N/A'}</td>
                  <td>{visita.paciente ? visita.paciente.etnia : 'N/A'}</td>
                  <td>{visita.diagnostico.enfermedad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VisitaComponent;
