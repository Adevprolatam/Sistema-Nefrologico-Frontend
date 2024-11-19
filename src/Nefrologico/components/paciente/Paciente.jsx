import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const PacienteComponent = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Función para cargar los pacientes desde la API
    const fetchPacientes = async () => {
      try {
        const response = await axios.get('http://localhost:3200/api/paciente');
        const pacientesData = response.data.user || [];

        if (pacientesData.length === 0) {
          setNoData(true);
        } else {
          setPacientes(pacientesData);  
        }
      } catch (error) {
        console.error('Error al cargar los pacientes:', error);
        setError(true); 
      } finally {
        setLoading(false); 
      }
    };

    fetchPacientes(); 
  }, []); 

  if (loading) {
    return (
      <div>
      <div className="border-bottom pt-5 mt-2 mb-5">
        <h1 className="mt-2 mt-md-4 mb-3 pt-5">Pacientes</h1>
        <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
          <p className="text-muted">Este módulo lista todos los pacientes registrados.</p>
          <p className="font-size-sm font-weight-medium pl-md-4">
            <a className="text-nowrap" href="./paciente/nuevo" target="_blank" rel="noopener noreferrer">
              Registrar nuevo
              <i className="cxi-angle-right font-size-base align-middle ml-1"></i>
            </a>
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

  return (
    <div>
      <div className="border-bottom pt-5 mt-2 mb-5">
        <h1 className="mt-2 mt-md-4 mb-3 pt-5">Pacientes</h1>
        <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
          <p className="text-muted">Este módulo lista todos los pacientes registrados.</p>
          <p className="font-size-sm font-weight-medium pl-md-4">

          <Link className="text-nowrap" to="./nuevo">
              Registrar nuevo
          <i className="cxi-angle-right font-size-base align-middle ml-1"></i>
          </Link>

          </p>
        </div>
      </div>

      {error ? (
        <div className="card text-center mt-4 ">
          <div className="card-body">
            <h5 className="card-title">
              <i className="bi bi-exclamation-triangle" style={{ fontSize: '2rem', color: 'red' }}></i>
            </h5>
            <p className="card-text">No es posible establecer conexión con el servidor 😢 </p>
          </div>
        </div>
      ) : noData ? (
        <div className="card text-center mt-4">
          <div className="card-body">
            <h5 className="card-title">
              <i className="bi bi-exclamation-triangle" style={{ fontSize: '2rem', color: 'red' }}></i>
            </h5>
            <p className="card-text">No hay pacientes registrados en la base de datos.</p>
          </div>
        </div>
      ) : (
        <div className="table-responsive mt-4">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Edad</th>
                <th>Genero</th>
                <th>Etnia</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente, index) => (
                <tr key={paciente._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{paciente.nombres}</td>
                  <td>{paciente.apellidos}</td>
                  <td>{paciente.edad}</td>
                  <td>{paciente.genero}</td>
                  <td>{paciente.etnia}</td>
                  <td>{paciente.estado ? paciente.estado : 's/n'}</td>
                  <td>
                    <a href={`/paciente/${paciente._id}`} className="btn btn-primary mb-3">Ver</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PacienteComponent;
