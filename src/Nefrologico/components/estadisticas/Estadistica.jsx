import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ChartDataLabels
);

export const EstadisticaComponent = () => {
  // Datos de prueba para cada gráfica
  const dataPie = {
    labels: ['Estables', 'Enfermos', 'En tratamiento'],
    datasets: [
      {
        label: 'Estado de Salud',
        data: [10, 20, 30],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      },
    ],
  };

  const optionsPie = {
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const total = ctx.dataset.data.reduce((acc, curr) => acc + curr, 0);
          const percentage = ((value / total) * 100).toFixed(2) + '%';
          return percentage;
        },
        color: '#fff',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const dataset = tooltipItem.dataset;
            const total = dataset.data.reduce((acc, curr) => acc + curr, 0);
            const currentValue = dataset.data[tooltipItem.dataIndex];
            const percentage = ((currentValue / total) * 100).toFixed(2) + '%';
            return `${tooltipItem.label}: ${currentValue} (${percentage})`;
          },
        },
      },
    },
  };

  const dataLine = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
    datasets: [
      {
        label: "Visitas por mes",
        data: [12, 6, 25, 5, 2, 3], // Ejemplo de visitas
        fill: false,
        backgroundColor: "#36A2EB",
        borderColor: "#36A2EB",
      },
    ],
  };

  const dataBarEnfermedades = {
    labels: [
      "Insuficiencia Renal Crónica",
      "Glomerulonefritis",
      "Nefropatía Diabética",
      "Pielonefritis",
      "Renal Aguda",
    ],
    datasets: [
      {
        label: "Enfermedades Renales Más Comunes",
        data: [38, 20, 25, 15, 5], // Datos de ejemplo
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  const dataBarSintomas = {
    labels: [
      "Fatiga",
      "Hinchazón",
      "Cambios en la micción",
      "Pérdida de apetito",
      "Dolor en el costado",
    ],
    datasets: [
      {
        label: "Síntomas Más Comunes",
        data: [40, 25, 30, 10, 20], // Datos de ejemplo
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  // Total de pacientes registrados (dato de ejemplo)
  const totalPacientes = 1;

  return (
    <div className="border-bottom pt-5 mt-2 mb-5">
      <h1 className="mt-2 mt-md-4 mb-3 pt-5">Estadísticas</h1>
      <p className="text-muted">
            Este módulo lista todos los pacientes registrados.
      </p>

      <div className="d-flex flex-wrap">

        <div className="col-md-6 mb-4">
          <h2>Estado de los pacientes</h2>
          <div className="chart-container" style={{ position: 'relative', width: '100%', height: '400px' }}>
            <Pie data={dataPie} options={optionsPie} />
          </div>
        </div>
        <div className="col-md-6 card mb-4">
          <div className="card-body bg-primary text-light">
            <h5 className="card-title text-light">Total de Pacientes Registrados</h5>
            <p className="card-text">{totalPacientes}</p>
          </div>
        </div>

        <div className="col-md-12 mb-4">
          <h2>Visitas por mes</h2>
          <div className="chart-container" style={{ position: 'relative', width: '100%', height: '400px' }}>
            <Line data={dataLine} />
          </div>
        </div>

        <div className="col-md-12 mb-4">
          <h2>Enfermedades más comunes</h2>
          <div className="chart-container" style={{ position: 'relative', width: '100%', height: '400px' }}>
            <Bar data={dataBarEnfermedades} />
          </div>
        </div>

        <div className="col-md-12 mb-4">
          <h2>Síntomas más comunes</h2>
          <div className="chart-container" style={{ position: 'relative', width: '100%', height: '400px' }}>
            <Bar data={dataBarSintomas} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadisticaComponent;
