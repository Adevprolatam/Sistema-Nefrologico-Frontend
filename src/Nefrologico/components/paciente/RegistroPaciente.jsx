import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';  
import { Link } from 'react-router-dom';

export const RegistroPacienteComponent = () => {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [showAntecedentes, setShowAntecedentes] = useState(false);
  const [formData, setFormData] = useState({
    ci: '',
    nombres: '',
    apellidos: '',
    edad: '',
    genero: 'm',
    etnia: '',
    tipo_sangre:'',
    antecedentesMedicos: [{
      enfermedad: '',
      descripcion: '',
      fechaDiagnostico: ''
    }],
    notas_clinicas: [],
    historial_familiar:''
  });

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await axios.get('http://localhost:3200/api/paciente');
        setPacientes(response.data.user);
      } catch (error) {
        console.error('Error al cargar los pacientes:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al cargar los pacientes. Por favor, inténtelo de nuevo más tarde.',
        });
      }
    };

    fetchPacientes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //Antescedentes
  const handleAntecedenteChange = (index, e) => {
    const { name, value } = e.target;
    const nuevosAntecedentes = formData.antecedentesMedicos.map((antecedente, i) =>
      i === index ? { ...antecedente, [name]: value } : antecedente
    );
    setFormData({
      ...formData,
      antecedentesMedicos: nuevosAntecedentes,
    });
  };  
  const agregarAntecedente = () => {
    setFormData({
      ...formData,
      antecedentesMedicos: [...formData.antecedentesMedicos, { enfermedad: '', descripcion: '', fechaDiagnostico: '' }]
    });
  };
  
  //NOTAS
  const handleNotaChange = (index, e) => {
    const { name, value } = e.target;
    const updatedNotas = [...formData.notas_clinicas];
    if (name.startsWith('nota-')) {
        updatedNotas[index].nota = value;
    } else if (name.startsWith('fechaNota-')) {
        updatedNotas[index].fecha = value;
    }
    setFormData({
        ...formData,
        notas_clinicas: updatedNotas
    });
};

const agregarNota = () => {
    setFormData({
        ...formData,
        notas_clinicas: [...formData.notas_clinicas, { nota: '', fecha: '' }]
    });
};

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3200/api/paciente', formData);
      setPacientes([...pacientes, response.data.user]);
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Paciente registrado correctamente.',
      });
      navigate('/dashboard/paciente');
      setFormData({
        ci: '',
        nombres: '',
        apellidos: '',
        edad: '',
        genero: 'm',
        etnia: '',
        tipo_sangre:'',
        antecedentesMedicos: [{
          enfermedad: '',
          descripcion: '',
          fechaDiagnostico: ''
        }]
      });

    } catch (error) {
      console.error('Error al registrar el paciente:', error);
      let errorMsg = 'Error al registrar el paciente. Por favor, inténtelo de nuevo más tarde.';
      if (error.response) {
          console.log('Error completo:', error);
          console.log('Estructura de error.response:', error.response);
          const { data, status } = error.response;
          if (data && data.msg) {
              errorMsg = data.msg;
          } else if (data && data.errors) {
              errorMsg = Object.values(data.errors).map(err => err.msg).join(', ');
          } else if (status === 400 && data && data.data && data.data.msg) {
              errorMsg = data.data.msg;
          } else if (status === 400) {
              errorMsg = 'Error de solicitud: Datos inválidos';
          }
      } else if (error.message) {
          errorMsg = error.message;
      }
  
      Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMsg,
      });
  }
  };

  return (
    <div>
      <div className="border-bottom pt-5 mt-2 mb-5">
        <h1 className="mt-2 mt-md-4 mb-3 pt-5">Pacientes</h1>
        <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
          <p className="text-muted">Este módulo lista todos los pacientes registrados.</p>
          <p className="font-size-sm font-weight-medium pl-md-4">
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card box-shadow-sm">
          <div className="card-header">
            <h5 style={{ marginBottom: '0px' }}>Datos Personales</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4 form-group">
                <label htmlFor="ci" className="form-label">CI</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="CI"
                  name="ci"
                  value={formData.ci}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4 form-group">
                <label htmlFor="nombres" className="form-label">Nombres</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Nombres"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4 form-group">
                <label htmlFor="apellidos" className="form-label">Apellidos</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4 form-group">
                <label htmlFor="edad" className="form-label">Edad</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder="Edad"
                  name="edad"
                  value={formData.edad}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4 form-group">
                <label htmlFor="genero" className="form-label">Género</label>
                <select
                  className="form-control custom-select"
                  name="genero"
                  value={formData.genero}
                  onChange={handleInputChange}
                  required
                >
                  <option value="m">Masculino</option>
                  <option value="f">Femenino</option>
                  <option value="no-specific">No especificado</option>
                </select>
              </div>

              <div className="col-md-4 form-group">
                <label htmlFor="etnia" className="form-label">Etnia</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Etnia"
                  name="etnia"
                  value={formData.etnia}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4 form-group">
                <label htmlFor="etnia" className="form-label">Tipo Sangre</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="tipo_sangre"
                  name="tipo_sangre"
                  value={formData.tipo_sangre}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card box-shadow-sm">
  <div className="card-header">
    <h5
      onClick={() => setShowAntecedentes(!showAntecedentes)}
      style={{ marginBottom: '0px', cursor: 'pointer' }}
    >
      {showAntecedentes ? 'Ocultar Antecedentes Médicos' : 'Antecedentes Médicos'}
    </h5>
  </div>
  {showAntecedentes && (
    <div className="card-body">
      {formData.antecedentesMedicos.map((antecedente, index) => (
        <div className="row" key={index}>
          <div className="col-md-4 form-group">
            <label htmlFor="enfermedad" className="form-label">Enfermedad</label>
            <input
              className="form-control"
              type="text"
              placeholder="Enfermedad"
              name="enfermedad"
              value={antecedente.enfermedad}
              onChange={(e) => handleAntecedenteChange(index, e)}
            />
          </div>
          <div className="col-md-4 form-group">
            <label htmlFor="descripcion" className="form-label">Descripción</label>
            <input
              className="form-control"
              type="text"
              placeholder="Descripción"
              name="descripcion"
              value={antecedente.descripcion}
              onChange={(e) => handleAntecedenteChange(index, e)}
            />
          </div>
          <div className="col-md-4 form-group">
            <label htmlFor="fechaDiagnostico" className="form-label">Fecha de diagnóstico</label>
            <input
              className="form-control"
              type="date"
              name="fechaDiagnostico"
              value={antecedente.fechaDiagnostico}
              onChange={(e) => handleAntecedenteChange(index, e)}
            />
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-primary mt-3" onClick={agregarAntecedente}>
        Agregar Antecedente
      </button>
    </div>
  )}
</div>

<div className="card box-shadow-sm">
    <div className="card-header">
        <h5 style={{ marginBottom: '0px' }}>Historial Familiar</h5>
    </div>
    <div className="card-body">
        <div className="row">
            <div className="col-md-12 form-group">
                <label htmlFor="historialFamiliar" className="form-label">Historial Familiar</label>
                <textarea
                    className="form-control"
                    id="historialFamiliar"
                    placeholder="Describa el historial familiar"
                    name="historial_familiar"
                    value={formData.historial_familiar}
                    onChange={(e) => setFormData({ ...formData, historial_familiar: e.target.value })}
                />
            </div>
        </div>
    </div>
</div>


        
        <div className="card box-shadow-sm">
        <div className="card-header">
        <h5 style={{ marginBottom: '0px' }}>Notas Clínicas</h5>
    </div>
    <div className="card-body">
        {formData.notas_clinicas && formData.notas_clinicas.length > 0 ? (
            formData.notas_clinicas.map((nota, index) => (
                <div className="row" key={index}>
                    <div className="col-md-8 form-group">
                        <label htmlFor={`nota-${index}`} className="form-label">Nota</label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Nota"
                            name={`nota-${index}`}
                            value={nota.nota}
                            onChange={(e) => handleNotaChange(index, e)}
                        />
                    </div>
                    <div className="col-md-4 form-group">
                        <label htmlFor={`fechaNota-${index}`} className="form-label">Fecha</label>
                        <input
                            className="form-control"
                            type="date"
                            name={`fechaNota-${index}`}
                            value={nota.fecha}
                            onChange={(e) => handleNotaChange(index, e)}
                        />
                    </div>
                </div>
            ))
        ) : (
            <p>No hay notas clínicas disponibles.</p>
        )}
        <button type="button" className="btn btn-primary mt-3" onClick={agregarNota}>
            Agregar Nota
        </button>
    </div>   
          <div className="card-footer">
            <button type="submit" className="btn btn-primary">Crear</button>
            <Link className="btn btn-secondary me-2" to="/dashboard/paciente">
               Regresar
          <i className="cxi-angle-left font-size-base align-middle ml-1"></i>
          </Link>          </div>
        </div>

      </form>
    </div>
  );
};
