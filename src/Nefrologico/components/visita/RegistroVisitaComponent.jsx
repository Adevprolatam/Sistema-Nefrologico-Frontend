/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';  

export const RegistroVisitaComponent = () => {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [formData, setFormData] = useState({
    paciente: '',
    fechaVisita: '',
    signosVitales: {
      presionArterial: '',
      frecuenciaCardiaca: '',
      temperatura: '',
      peso: '',
      altura: ''
    },
    sintomas: [],
    examenes: {
      sangre: ''
    },
    diagnostico: {
      enfermedad: '',
      clasificacion: '',
      tratamiento: ''
    }
  });
  const [showBloodTestForm, setShowBloodTestForm] = useState(false);
  const [bloodTestData, setBloodTestData] = useState({
    paciente: '',
    resultado: {
      creatinina_serica: '',
      tfg: '',
      proteina_orina: '',
      acido_urico: '',
      hba1c: '',
      colesterol_total: '',
      ldl: '',
      hdl: '',
      trigliceridos: '',
      biometria_hematica: {
        globulos_rojos: '',
        hemoglobina: '',
        hematocrito: '',
        plaquetas: ''
      }
    }
  });

  const [ci, setCi] = useState('');
  const [isPacienteFound, setIsPacienteFound] = useState(false);
  const [sintomasOptions, setSintomasOptions] = useState([]);
  const [selectedSintomas, setSelectedSintomas] = useState([]);
  //PARAMS SANGRE
  const bloodTestRanges = {
    creatinina_serica: [
      { label: '500 - 1000', value: '500-1000' },
      { label: '1001 - 1500', value: '1001-1500' },
      { label: '1501 - 2000', value: '1501-2000' },
    ],
    tfg: [
      { label: '60 - 90', value: '60-90' },
      { label: '91 - 120', value: '91-120' },
    ],
    proteina_orina: [
      { label: '0 - 150', value: '0-150' },
      { label: '151 - 300', value: '151-300' },
    ],
    acido_urico: [
      { label: '3.5 - 7.2', value: '3.5-7.2' },
      { label: '7.3 - 10.0', value: '7.3-10.0' },
    ],
    hba1c: [
      { label: '4.0 - 5.6', value: '4.0-5.6' },
      { label: '5.7 - 6.4', value: '5.7-6.4' },
    ],
    colesterol_total: [
      { label: '125 - 200', value: '125-200' },
      { label: '201 - 239', value: '201-239' },
    ],
    hdl: [
      { label: '40 - 59', value: '40-59' },
      { label: '60 - 100', value: '60-100' },
    ],
    ldl: [
      { label: '0 - 99', value: '0-99' },
      { label: '100 - 129', value: '100-129' },
    ],
    trigliceridos: [
      { label: '0 - 150', value: '0-150' },
      { label: '151 - 200', value: '151-200' },
    ],
    biometria_hematica: {
      globulos_rojos: [
        { label: '4.7 - 6.1', value: '4.7-6.1' },
        { label: '6.2 - 7.0', value: '6.2-7.0' },
      ],
      hemoglobina: [
        { label: '13.5 - 17.5', value: '13.5-17.5' },
        { label: '17.6 - 20.0', value: '17.6-20.0' },
      ],
      hematocrito: [
        { label: '38.8 - 50.0', value: '38.8-50.0' },
        { label: '50.1 - 60.0', value: '50.1-60.0' },
      ],
      plaquetas: [
        { label: '150 - 450', value: '150-450' },
        { label: '451 - 600', value: '451-600' },
        // Agrega más rangos según sea necesario
      ]
    }
  };
  
  
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

    const fetchSintomas = async () => {
      try {
        const response = await axios.get('http://localhost:3200/api/sintomas');
        if (response.data.msg === 'Succesfull') {
          setSintomasOptions(response.data.sintomas);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error al cargar los síntomas. Por favor, inténtelo de nuevo más tarde.',
          });
        }
      } catch (error) {
        console.error('Error al cargar los síntomas:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al cargar los síntomas. Por favor, inténtelo de nuevo más tarde.',
        });
      }
    };

    fetchPacientes();
    fetchSintomas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [section, key] = name.split('.');
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [key]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCiChange = (e) => {
    setCi(e.target.value);
  };

  const handleToggleBloodTestForm = () => {
    setShowBloodTestForm(!showBloodTestForm);
  };

  const handleBuscarPaciente = () => {
    const paciente = pacientes.find(p => p.ci === ci);
    if (paciente) {
      setFormData({
        ...formData,
        paciente: paciente._id,
      });
      setBloodTestData({
        ...bloodTestData,
        paciente: paciente._id,
      });
      setIsPacienteFound(true);
      Swal.fire({
        icon: 'success',
        title: 'Paciente encontrado',
        text: `Paciente con CI ${ci} encontrado.`,
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Paciente no encontrado',
        text: `No se encontró un paciente con CI ${ci}.`,
      });
      setCi('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Verifica y establece un valor predeterminado para `examenes.sangre` si está vacío
    const dataToSend = {
      ...formData,
      examenes: {
        sangre: formData.examenes.sangre || '60d21b4667d0d8992e610c85', // Reemplaza 'ID_POR_DEFECTO' con un valor válido
      },
      signosVitales: {
        ...formData.signosVitales,
        frecuenciaCardiaca: Number(formData.signosVitales.frecuenciaCardiaca),
        temperatura: Number(formData.signosVitales.temperatura),
        peso: Number(formData.signosVitales.peso),
        altura: Number(formData.signosVitales.altura)
      },
    };
  
    try {
      const response = await axios.post('http://localhost:3200/api/visita', dataToSend);
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Visita registrada correctamente.',
      });
      navigate('/dashboard/visita');
      setFormData({
        paciente: '',
        fechaVisita: '',
        signosVitales: {
          presionArterial: '',
          frecuenciaCardiaca: '',
          temperatura: '',
          peso: '',
          altura: ''
        },
        sintomas: [],
        examenes: {
          sangre: 'ID_POR_DEFECTO', // Reemplaza 'ID_POR_DEFECTO' con un valor válido
        },
        diagnostico: {
          enfermedad: '',
          clasificacion: '',
          tratamiento: ''
        }
      });
      setCi('');
      setIsPacienteFound(false);
      setSelectedSintomas([]);
    } catch (error) {
      console.error('Error al registrar la visita:', error);
      const errorMsg = error.response && error.response.data && error.response.data.errors
        ? Object.values(error.response.data.errors).map(err => err.msg).join(', ')
        : 'Error al registrar la visita. Por favor, inténtelo de nuevo más tarde.';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMsg,
      });
    }
  };
  
  const handleSintomasChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedSintomas(selectedOptions);
    setFormData({
      ...formData,
      sintomas: selectedOptions,
    });
  };

  const handleBloodTestChange = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split('.');
  
    if (nameParts.length === 2) {
      // Manejar campos en el nivel superior de `resultado`
      setBloodTestData(prevData => ({
        ...prevData,
        resultado: {
          ...prevData.resultado,
          [nameParts[1]]: value
        }
      }));
    } else if (nameParts.length === 3) {
      // Manejar campos en `biometria_hematica`
      setBloodTestData(prevData => ({
        ...prevData,
        resultado: {
          ...prevData.resultado,
          biometria_hematica: {
            ...prevData.resultado.biometria_hematica,
            [nameParts[2]]: value
          }
        }
      }));
    }
  };
  
  const handleSaveBloodTest = async () => {
    try {
      const response = await axios.post('http://localhost:3200/api/examenSangre', bloodTestData);
      const bloodTestId = response.data.examen._id;
  
      // Configura un valor predeterminado si el ID del examen está vacío
      const examIdToSend = bloodTestId || '60d21b4667d0d8992e610c85';
  
      setFormData(prevFormData => ({
        ...prevFormData,
        examenes: {
          sangre: examIdToSend
        }
      }));
  
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Examen de sangre registrado correctamente.',
      });
      setShowBloodTestForm(false);
    } catch (error) {
      console.error('Error al registrar el examen de sangre:', error);
      const errorMsg = error.response && error.response.data && error.response.data.errors
        ? Object.values(error.response.data.errors).map(err => err.msg).join(', ')
        : 'Error al registrar el examen de sangre. Por favor, inténtelo de nuevo más tarde.';
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
        <h1 className="mt-2 mt-md-4 mb-3 pt-5">Registrar Visita</h1>
      </div>

      <div className="card box-shadow-sm">
        <div className="card-header">
          <h5 style={{ marginBottom: '0px' }}>Datos de la Visita</h5>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4 form-group">
              <label htmlFor="ci" className="form-label">CI del Paciente</label>
              <input
                className="form-control"
                type="text"
                placeholder="CI"
                name="ci"
                value={ci}
                onChange={handleCiChange}
                required
              />
            </div>
            <div className="col-md-4 form-group align-self-end">
              <button type="button" className="btn btn-primary" onClick={handleBuscarPaciente}>
                Buscar Paciente
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 form-group">
                <label htmlFor="paciente" className="form-label">ID del Paciente</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="ID del Paciente"
                  name="paciente"
                  value={formData.paciente}
                  onChange={handleInputChange}
                  readOnly={isPacienteFound}
                  disabled
                  required
                />
              </div>
              <div className="col-md-4 form-group">
                <label htmlFor="fechaVisita" className="form-label">Fecha de Visita</label>
                <input
                  className="form-control"
                  type="datetime-local"
                  name="fechaVisita"
                  value={formData.fechaVisita}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 form-group">
                <label htmlFor="signosVitales.presionArterial" className="form-label">Presión Arterial (mm Hg)</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Presión Arterial"
                  name="signosVitales.presionArterial"
                  value={formData.signosVitales.presionArterial}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4 form-group">
                <label htmlFor="signosVitales.frecuenciaCardiaca" className="form-label">Frecuencia Cardíaca (l/min)</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Frecuencia Cardíaca"
                  name="signosVitales.frecuenciaCardiaca"
                  value={formData.signosVitales.frecuenciaCardiaca}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4 form-group">
                <label htmlFor="signosVitales.temperatura" className="form-label">Temperatura (°C)</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Temperatura"
                  name="signosVitales.temperatura"
                  value={formData.signosVitales.temperatura}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 form-group">
                <label htmlFor="signosVitales.peso" className="form-label">Peso (Kg)</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Peso"
                  name="signosVitales.peso"
                  value={formData.signosVitales.peso}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4 form-group">
                <label htmlFor="signosVitales.altura" className="form-label">Altura (m)</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Altura"
                  name="signosVitales.altura"
                  value={formData.signosVitales.altura}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 form-group">
                <label htmlFor="sintomas" className="form-label">Síntomas</label>
                <select
                  className="form-control"
                  multiple
                  name="sintomas"
                  value={selectedSintomas}
                  onChange={handleSintomasChange}
                  required
                >
                  {sintomasOptions.map(sintoma => (
                    <option key={sintoma._id} value={sintoma._id}>{sintoma.nombre}</option>
                  ))}
                </select>
              </div>
            </div>



            <div className="row">
            <div className="card-header col-md-12">
                  <h5 style={{ marginBottom: '0px' }}>Examenes del Paciente</h5>
            </div>
            <div className="card-body">
              <div className="row">

              <div className="col-md-4 form-group">
                <label htmlFor="examenes.sangre" className="form-label">ID Examen</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Examen de Sangre"
                  name="examenes.sangre"
                  value={formData.examenes.sangre ?formData.examenes.sangre :'No existe examen'}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
              <div className="col-md-4 form-group align-self-end">
                <button type="button" className="btn btn-primary" onClick={handleToggleBloodTestForm}>
                  {showBloodTestForm ? 'Cancelar' : 'Agregar Examen de Sangre'}
                </button>
              </div>
            </div>

            {showBloodTestForm && (
             <div className="mt-4">
             <h5>Formulario de Examen de Sangre</h5>
             <div className="row">
             <div className="col-md-4 form-group">
                <label htmlFor="creatinina_serica" className="form-label">Creatinina Sérica</label>
                  <select
                  className="form-control"
                  name="resultado.creatinina_serica"
                  value={bloodTestData.resultado.creatinina_serica}
                  onChange={handleBloodTestChange}
                  required
                 >
                <option value="">Seleccione un rango</option>
                    {bloodTestRanges.creatinina_serica.map((range) => (
                <option key={range.value} value={range.value}>
                    {range.label}
                </option>
                  ))}
                </select>
            </div>
            <div className="col-md-4 form-group">
      <label htmlFor="tfg" className="form-label">TFG</label>
      <select
        className="form-control"
        name="resultado.tfg"
        value={bloodTestData.resultado.tfg}
        onChange={handleBloodTestChange}
        required
      >
        <option value="">Seleccione un rango</option>
        {bloodTestRanges.tfg.map((range) => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>
    </div>
    <div className="col-md-4 form-group">
      <label htmlFor="proteina_orina" className="form-label">Proteína en Orina</label>
      <select
        className="form-control"
        name="resultado.proteina_orina"
        value={bloodTestData.resultado.proteina_orina}
        onChange={handleBloodTestChange}
        required
      >
        <option value="">Seleccione un rango</option>
        {bloodTestRanges.proteina_orina.map((range) => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>
    </div>

    <div className="col-md-4 form-group">
  <label htmlFor="acido_urico" className="form-label">Ácido Úrico</label>
  <select
    className="form-control"
    name="resultado.acido_urico"
    value={bloodTestData.resultado.acido_urico}
    onChange={handleBloodTestChange}
    required
  >
    <option value="">Selecciona un rango</option>
    {bloodTestRanges.acido_urico.map((range) => (
      <option key={range.value} value={range.value}>
        {range.label}
      </option>
    ))}
  </select>
</div>
<div className="col-md-4 form-group">
  <label htmlFor="hba1c" className="form-label">HbA1c</label>
  <select
    className="form-control"
    name="resultado.hba1c"
    value={bloodTestData.resultado.hba1c}
    onChange={handleBloodTestChange}
    required
  >
    <option value="">Selecciona un rango</option>
    {bloodTestRanges.hba1c.map((range) => (
      <option key={range.value} value={range.value}>
        {range.label}
      </option>
    ))}
  </select>
</div>
<div className="col-md-4 form-group">
  <label htmlFor="colesterol_total" className="form-label">Colesterol Total</label>
  <select
    className="form-control"
    name="resultado.colesterol_total"
    value={bloodTestData.resultado.colesterol_total}
    onChange={handleBloodTestChange}
    required
  >
    <option value="">Selecciona un rango</option>
    {bloodTestRanges.colesterol_total.map((range) => (
      <option key={range.value} value={range.value}>
        {range.label}
      </option>
    ))}
  </select>
</div>
<div className="col-md-4 form-group">
  <label htmlFor="hdl" className="form-label">HDL Colesterol</label>
  <select
    className="form-control"
    name="resultado.hdl"
    value={bloodTestData.resultado.hdl}
    onChange={handleBloodTestChange}
    required
  >
    <option value="">Selecciona un rango</option>
    {bloodTestRanges.hdl.map((range) => (
      <option key={range.value} value={range.value}>
        {range.label}
      </option>
    ))}
  </select>
</div>
<div className="col-md-4 form-group">
  <label htmlFor="ldl" className="form-label">LDL Colesterol</label>
  <select
    className="form-control"
    name="resultado.ldl"
    value={bloodTestData.resultado.ldl}
    onChange={handleBloodTestChange}
    required
  >
    <option value="">Selecciona un rango</option>
    {bloodTestRanges.ldl.map((range) => (
      <option key={range.value} value={range.value}>
        {range.label}
      </option>
    ))}
  </select>
</div>
<div className="col-md-4 form-group">
  <label htmlFor="trigliceridos" className="form-label">Triglicéridos</label>
  <select
    className="form-control"
    name="resultado.trigliceridos"
    value={bloodTestData.resultado.trigliceridos}
    onChange={handleBloodTestChange}
    required
  >
    <option value="">Selecciona un rango</option>
    {bloodTestRanges.trigliceridos.map((range) => (
      <option key={range.value} value={range.value}>
        {range.label}
      </option>
    ))}
  </select>
</div>
<div className="col-md-4 form-group">
  <label htmlFor="biometria_hematica.globulos_rojos" className="form-label">Glóbulos Rojos</label>
  <select
    className="form-control"
    name="resultado.biometria_hematica.globulos_rojos"
    value={bloodTestData.resultado.biometria_hematica.globulos_rojos}
    onChange={handleBloodTestChange}
    required
  >
    <option value="">Selecciona un rango</option>
    {bloodTestRanges.biometria_hematica.globulos_rojos.map((range) => (
      <option key={range.value} value={range.value}>
        {range.label}
      </option>
    ))}
  </select>
</div>
<div className="col-md-4 form-group">
  <label htmlFor="biometria_hematica.hemoglobina" className="form-label">Hemoglobina</label>
  <select
    className="form-control"
    name="resultado.biometria_hematica.hemoglobina"
    value={bloodTestData.resultado.biometria_hematica.hemoglobina}
    onChange={handleBloodTestChange}
    required
  >
    <option value="">Selecciona un rango</option>
    {bloodTestRanges.biometria_hematica.hemoglobina.map((range) => (
      <option key={range.value} value={range.value}>
        {range.label}
      </option>
    ))}
  </select>
</div>
<div className="col-md-4 form-group">
  <label htmlFor="biometria_hematica.hematocrito" className="form-label">Hematocrito</label>
  <select
    className="form-control"
    name="resultado.biometria_hematica.hematocrito"
    value={bloodTestData.resultado.biometria_hematica.hematocrito}
    onChange={handleBloodTestChange}
    required
  >
    <option value="">Selecciona un rango</option>
    {bloodTestRanges.biometria_hematica.hematocrito.map((range) => (
      <option key={range.value} value={range.value}>
        {range.label}
      </option>
    ))}
  </select>
</div>
<div className="col-md-4 form-group">
  <label htmlFor="biometria_hematica.plaquetas" className="form-label">Plaquetas</label>
  <select
    className="form-control"
    name="resultado.biometria_hematica.plaquetas"
    value={bloodTestData.resultado.biometria_hematica.plaquetas}
    onChange={handleBloodTestChange}
    required
  >
    <option value="">Selecciona un rango</option>
    {bloodTestRanges.biometria_hematica.plaquetas.map((range) => (
      <option key={range.value} value={range.value}>
        {range.label}
      </option>
    ))}
  </select>
</div>



               <div className="col-md-12 form-group align-self-end">
                 <button type="button" className="btn btn-secondary" onClick={handleSaveBloodTest}>
                   Guardar Examen de Sangre
                 </button>
               </div>
             </div>
           </div>
           
            )}
          </div>

          </div>


            <div className="row">
            <div className="card-header col-md-12">
                  <h5 style={{ marginBottom: '0px' }}>Diagnóstico Previo</h5>
            </div>
            <div className="card-body">
            <div className="row">
              <div className="col-md-4 form-group">
                <label htmlFor="diagnostico.enfermedad" className="form-label">Enfermedad</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enfermedad"
                  name="diagnostico.enfermedad"
                  value={formData.diagnostico.enfermedad}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4 form-group">
                <label htmlFor="diagnostico.clasificacion" className="form-label">Clasificación</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Clasificación"
                  name="diagnostico.clasificacion"
                  value={formData.diagnostico.clasificacion}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4 form-group">
                <label htmlFor="diagnostico.tratamiento" className="form-label">Tratamiento</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Tratamiento"
                  name="diagnostico.tratamiento"
                  value={formData.diagnostico.tratamiento}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            </div>
            </div>
            

            <div className="row">
              <div className="col-md-4 form-group">
                <button type="submit" className="btn btn-primary">
                  Registrar Visita
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
