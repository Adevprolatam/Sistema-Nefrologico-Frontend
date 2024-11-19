/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import './styles.css';
import { DiagnosticoCard } from '../../hooks/DiagnosticoCard';

export const PacienteDetalleComponent = () => {
  const { id } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [visitas, setVisitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const response = await axios.get(`http://localhost:3200/api/paciente/${id}`);
        setPaciente(response.data.paciente);
        const cedula = response.data.paciente.ci;
        await fetchVisitas(cedula); // Llama a la función para obtener las visitas después de obtener el paciente y su cédula
      } catch (error) {
        setError('Error al cargar los datos del paciente');
      } finally {
        setLoading(false);
      }
    };

    const fetchVisitas = async (cedula) => {
      try {
        const response = await axios.get(`http://localhost:3200/api/busqueda/visitas/paciente/${cedula}`);
        setVisitas(response.data.visitas);
      } catch (error) {
        setError('Error al cargar las visitas del paciente');
      }
    };

    fetchPaciente();
  }, [id]);

  const handleActualizar = () => {
    Swal.fire({
      title: 'Actualizar Información del Paciente',
      html: `
      <div class="swal2-form-container">
        <div class="swal2-form-row">
          <div class="swal2-form-group">
            <label for="nombres">Nombres</label>
            <input id="nombres" class="swal2-input" placeholder="Nombres" value="${paciente.nombres}">
          </div>
          <div class="swal2-form-group">
            <label for="apellidos">Apellidos</label>
            <input id="apellidos" class="swal2-input" placeholder="Apellidos" value="${paciente.apellidos}">
          </div>
        </div>
        <div class="swal2-form-row">
          <div class="swal2-form-group">
            <label for="ci">CI</label>
            <input id="ci" class="swal2-input" placeholder="CI" value="${paciente.ci}" disabled>
          </div>
          <div class="swal2-form-group">
            <label for="tipo_sangre">Tipo de Sangre</label>
            <input id="tipo_sangre" class="swal2-input" placeholder="Tipo de Sangre" value="${paciente.tipo_sangre}">
          </div>
          
        </div>
        <div class="swal2-form-row">
          <div class="swal2-form-group">
            <label for="etnia">Etnia</label>
            <input id="etnia" class="swal2-input" placeholder="Etnia" value="${paciente.etnia}">
          </div>
          <div class="swal2-form-group">
            <label for="edad">Edad</label>
            <input id="edad" class="swal2-input" placeholder="Edad" value="${paciente.edad}">
          </div>
        </div>
        <div class="swal2-form-row">
          <div class="swal2-form-group">
            <label for="genero">Género</label>
            <select id="genero" class="swal2-input">
              <option value="m" ${paciente.genero === 'm' ? 'selected' : ''}>Masculino</option>
              <option value="f" ${paciente.genero === 'f' ? 'selected' : ''}>Femenino</option>
              <option value="no-specific" ${paciente.genero === 'no-specific' ? 'selected' : ''}>Sin Especificar</option>
            </select>
          </div>
          <div class="swal2-form-group">
            <label for="estado">Estado</label>
            <select id="estado" class="swal2-input">
              <option value="Estable" ${paciente.estado === 'Estable' ? 'selected' : ''}>Estable</option>
              <option value="Leve" ${paciente.estado === 'Leve' ? 'selected' : ''}>Leve</option>
              <option value="Grave" ${paciente.estado === 'Grave' ? 'selected' : ''}>Grave</option>
              <option value="Terminal" ${paciente.estado === 'Terminal' ? 'selected' : ''}>Terminal</option>
            </select>
          </div>
        </div>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          nombres: document.getElementById('nombres').value,
          apellidos: document.getElementById('apellidos').value,
          ci: document.getElementById('ci').value,
          genero: document.getElementById('genero').value,
          etnia: document.getElementById('etnia').value,
          edad: document.getElementById('edad').value,
          tipo_sangre: document.getElementById('tipo_sangre').value,
          estado: document.getElementById('estado').value
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedData = result.value;
  
        axios.post(`http://localhost:3200/api/paciente/${id}`, updatedData)
          .then((response) => {
            if (response.data.ok) {
              Swal.fire({
                title: 'Actualizado',
                text: 'La información del paciente ha sido actualizada.',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(() => {
                setPaciente(response.data.paciente); // Actualizar el estado del paciente con la nueva información
              });
            } else {
              Swal.fire('Error', response.data.msg, 'error');
            }
          })
          .catch((error) => {
            console.error('Error al actualizar la informacion del paciente:', error);
            const errorMsg = error.response && error.response.data && error.response.data.errors
            ? Object.values(error.response.data.errors).map(err => err.msg).join(', ')
            : 'Error al actualizar la informacion del Paciente. Por favor, inténtelo de nuevo más tarde.';
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
            text: errorMsg,
            });
          });
      }
    });
  };
  
  
  
  const handleEliminar = () => {
    Swal.fire({
      title: 'Eliminar Paciente',
      text: '¿Está seguro de que desea eliminar este paciente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3200/api/paciente/${id}`)
          .then((response) => {
            Swal.fire({
              title: 'Eliminado',
              text: 'El paciente ha sido eliminado.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              window.location.href = '/dashboard/paciente'; // Redirigir a la lista de pacientes
            });
          })
          .catch((error) => {
            Swal.fire('Error', 'Hubo un problema al eliminar el paciente.', 'error');
          });
      }
    });
  };
  
  

  const mostrarDetallesVisita = (visita) => {
    let modalContent = `
      <div>
        <h5>Detalles de la Visita</h5>
        <p><strong>Fecha de Visita:</strong> ${new Date(visita.fechaVisita).toLocaleString()}</p>
        <table>
          <tr>
            <th>Presión Arterial:</th>
            <td>${visita.signosVitales.presionArterial}</td>
            <th>Frecuencia Cardíaca:</th>
            <td>${visita.signosVitales.frecuenciaCardiaca}</td>
          </tr>
          <tr>
            <th>Temperatura:</th>
            <td>${visita.signosVitales.temperatura}</td>
            <th>Peso:</th>
            <td>${visita.signosVitales.peso}</td>
          </tr>
          <tr>
            <th>Altura:</th>
            <td>${visita.signosVitales.altura}</td>
            <th></th>
            <td></td>
          </tr>
        </table>
        <p>Exámenes:</p>
        ${visita.examenes && visita.examenes.sangre ? `
        <div>
          <p>Biometría Hemática:</p>
          <table>
            ${Object.entries(visita.examenes.sangre.resultado.biometria_hematica).map(([key, value]) => `
              <tr>
                <th>${key.replace(/_/g, ' ')}:</th>
                <td>${value ? value : 'N/A'}</td>
              </tr>
            `).join('')}
          </table>
          <p>Otros Exámenes de Sangre:</p>
          <table>
            ${Object.entries(visita.examenes.sangre.resultado).filter(([key]) => key !== 'biometria_hematica').map(([key, value]) => `
              <tr>
                <th>${key.replace(/_/g, ' ')}:</th>
                <td>${value ? value : 'N/A'}</td>
              </tr>
            `).join('')}
          </table>
        </div>
        ` : '<p id="light">No se realizaron exámenes de sangre.</p>'}
        <p>Diagnóstico:</p>
        <table>
          <tr>
            <th>Enfermedad Diagnósticada:</th>
            <td>${visita.diagnostico.enfermedad}</td>
          </tr>
          <tr>
            <th>Clasificación:</th>
            <td>${visita.diagnostico.clasificacion}</td>
          </tr>
          <tr>
            <th>Tratamiento:</th>
            <td>${visita.diagnostico.tratamiento}</td>
          </tr>
        </table>
        <p>Síntomas:</p>
        <table>
          ${visita.sintomas.map((sintoma) => `
            <tr>
              <th>${sintoma.nombre}</th>
            </tr>
          `).join('')}
        </table>
        <hr />
      </div>
    `;
  
    // Mostrar el modal con SweetAlert
    Swal.fire({
      html: modalContent,
      showCloseButton: true,
      customClass: {
        popup: 'custom-modal' // Clase personalizada para estilos del modal
      }
    });
  };
  
  
  
  
  

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!paciente) {
    return <div>
      <div className="container mt-5">
      <div className="border-bottom mb-4 pb-2">
        <h1 className="mb-3">Detalles del Paciente</h1>
        <p className="text-muted">Este módulo muestra la información personal y médica del paciente.</p>
        <p>      No se encontró información del paciente        </p>
      </div>
      </div>

      </div>;
  }

  return (
    <div className="container mt-5">
      <div className="border-bottom mb-4 pb-2">
        <h1 className="mb-3">Detalles del Paciente</h1>
        <p className="text-muted">Este módulo muestra la información personal y médica del paciente.</p>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Información Personal</h5>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">Nombres</label>
              <p className="form-control">{paciente.nombres}</p>
            </div>
            <div className="col-md-4">
              <label className="form-label">Apellidos</label>
              <p className="form-control">{paciente.apellidos}</p>
            </div>
            <div className="col-md-4">
              <label className="form-label">CI</label>
              <p className="form-control">{paciente.ci}</p>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">Género</label>
              <select className="form-control" value={paciente.genero} disabled>
                <option value="m">Masculino</option>
                <option value="f">Femenino</option>
                <option value="no-specific">Sin Especificar</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Etnia</label>
              <input className="form-control" type="text" placeholder="Etnia" value={paciente.etnia} disabled />
            </div>
            <div className="col-md-4">
              <label className="form-label">Tipo de Sangre</label>
              <input className="form-control" type="text" placeholder="Etnia" value={paciente.tipo_sangre} disabled />
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
  <div className="card-header">
    <h5 className="mb-0">Antecedentes Médicos</h5>
  </div>
  <div className="card-body">
    {paciente.antecedentesMedicos && paciente.antecedentesMedicos.length > 0 ? (
      paciente.antecedentesMedicos.map((antecedente, index) => (
        <div key={index} className="mb-4 p-3 border rounded">
          <h6 className="mb-2">{antecedente.enfermedad ? antecedente.enfermedad : 'Sin Enfermedad Específica'}</h6>
          <p><strong>Descripción:</strong> {antecedente.descripcion ? antecedente.descripcion : 'Sin Descripción'}</p>
          <p><strong>Fecha de Diagnóstico:</strong> {antecedente.fechaDiagnostico ? new Date(antecedente.fechaDiagnostico).toLocaleDateString() : 'Sin Datos'}</p>
        </div>
      ))
    ) : (
      <p>No hay antecedentes médicos disponibles</p>
    )}
  </div>
</div>


<div className="card mb-4">
  <div className="card-header">
    <h5 className="mb-0">Notas Clínicas</h5>
  </div>
  <div className="card-body">
    {paciente.notas_clinicas && paciente.notas_clinicas.length > 0 ? (
      paciente.notas_clinicas.map((nota, index) => (
        <div key={index} className="mb-4 p-3 border rounded bg-light">
          <h6 className="mb-2">Nota #{index + 1}</h6>
          <p><strong>Contenido:</strong> {nota.nota ? nota.nota : 'Sin Contenido'}</p>
          <p><strong>Fecha:</strong> {new Date(nota.fecha).toLocaleDateString()}</p>
        </div>
      ))
    ) : (
      <p>No hay notas clínicas disponibles</p>
    )}
  </div>
</div>



<div className="card mb-4">
  <div className="card-header">
    <h5 className="mb-0">Historial Familiar</h5>
  </div>
  <div className="card-body">
    <p>{paciente.historial_familiar}</p>
  </div>
</div>


      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Visitas del Paciente</h5>
        </div>
        <div className="card-body">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha de Visita</th>
                <th>Diagnóstico Previo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visitas.length > 0 ? (
                visitas.map((visita, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{new Date(visita.fechaVisita ? visita.fechaVisita : 'SIN DATOS').toLocaleDateString()}</td>
                    <td>{visita.diagnostico.enfermedad}</td>
                    <td>
                      <button className="btn btn-primary" onClick={() => mostrarDetallesVisita(visita)}>Ver Detalles</button>
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
        </div>
      </div>

      <div className="card mb-4">
           <DiagnosticoCard visitas={visitas} mostrarDetallesVisita={mostrarDetallesVisita} />
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Configuraciones</h5>
        </div>
        <div className="card-body">
          <button className="btn btn-primary me-2" onClick={handleActualizar}>
            Actualizar Información
            <FontAwesomeIcon icon={faSyncAlt} className="font-size-base align-middle ml-1" />
          </button>
          <button className="btn btn-danger me-2" onClick={handleEliminar}>
            Eliminar Paciente
            <FontAwesomeIcon icon={faTrashAlt} className="font-size-base align-middle ml-1" />
          </button>
        </div>
      </div>

      <div className="mb-5">
          <Link className="btn btn-secondary me-2" to="/dashboard/paciente">
               Regresar
          <i className="cxi-angle-left font-size-base align-middle ml-1"></i>
          </Link>
      </div>
    </div>
  );
};

export default PacienteDetalleComponent;
