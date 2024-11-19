/* eslint-disable react/prop-types */
import { useState } from 'react';
import '../components/paciente/styles.css';

export const DiagnosticoCard = ({ visitas, mostrarDetallesVisita }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [diagnostico, setDiagnostico] = useState({}); // Estado para almacenar el diagnóstico
  const [modalContent, setModalContent] = useState(''); // Estado para almacenar el contenido del modal
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal

  const diagnosticar = async (visita) => {
    setLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 10;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 300);

    try {
      // Enviar solo el ID de la visita al servidor
      const response = await fetch('http://localhost:3200/api/diagnostico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visita: visita._id }),
      });
      const data = await response.json();

      // Actualizar el progreso al 100% al recibir la respuesta
      clearInterval(interval);
      setProgress(100);

      // Manejar la respuesta del servidor
      console.log("Respuesta del servidor:", data);
      setDiagnostico(data.diagnostico);
      setModalContent(data.diagnostico.resultados);
      setShowModal(true);
    } catch (error) {
      console.error('Error al realizar el diagnóstico:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">Diagnóstico</h5>
      </div>
      <div className="card-body">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Fecha de Análisis</th>
              <th>Enfermedad Detectada</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visitas.length > 0 ? (
              visitas.map((visita, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{new Date(visita.fechaVisita ? visita.fechaVisita : 'SIN DATOS').toLocaleDateString()}</td>
                  <td>
                    {diagnostico.visita === visita._id ? (
                      <button className="btn btn-info" onClick={() => setShowModal(true)}>
                        Ver Resultados
                      </button>
                    ) : (
                      'No diagnosticado'
                    )}
                  </td>
                  <td>
                    {diagnostico.visita === visita._id ? (
                      <button className="btn btn-primary" onClick={() => mostrarDetallesVisita(visita)}>
                        Ver Detalles
                      </button>
                    ) : (
                      <button className="btn btn-success" onClick={() => diagnosticar(visita)}>
                        Diagnosticar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No hay visitas registradas para este paciente.</td>
              </tr>
            )}
          </tbody>
        </table>
        {loading && (
          <div className="progress mt-3">
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {progress}%
            </div>
          </div>
        )}
      </div>

      {/* Modal para mostrar el diagnóstico */}
      {showModal && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} aria-modal="true">
          <div className="modal-dialog custom-modal"> {/* Aplicar clase custom-modal */}
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Resultados del Diagnóstico</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <pre>{modalContent}</pre>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
