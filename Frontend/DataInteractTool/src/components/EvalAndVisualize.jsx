import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, LineController, Tooltip, Legend);

const EvalAndVisualize = () => {
  const [data, setData] = useState(null);
  const [metrics, setMetrics] = useState({ mse: null, r2: null });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('combined');

  useEffect(() => {
    const mse = JSON.parse(localStorage.getItem('mse'));
    const r2 = JSON.parse(localStorage.getItem('r2'));
    const X_test = JSON.parse(localStorage.getItem('X_test'));
    const y = JSON.parse(localStorage.getItem('y'));
    const predicted_data = JSON.parse(localStorage.getItem('predicted_data'));
    const X = JSON.parse(localStorage.getItem('X'));

    if (mse !== null && r2 !== null && X_test && y && predicted_data && X) {
      setMetrics({ mse, r2 });
      setData({ X_test, y, predicted_data, X });
    } else {
      console.error('Metrics or prediction data not found in localStorage.');
      setData(null);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (!data) {
    return <div className="text-center text-xl mt-16">Please train the model first.</div>;
  }

  const scatterData = data.X ? data.X.map((feature, index) => ({
    x: feature[0],
    y: data.y[index],
  })) : [];

  const lineData = data.X_test ? data.X_test.map((feature, index) => ({
    x: feature[0],
    y: data.predicted_data[index],
  })) : [];

  lineData.sort((a, b) => a.x - b.x);

  const combinedChartData = {
    datasets: [
      {
        label: 'Training Data (X, y)',
        data: scatterData,
        backgroundColor: 'rgba(136, 134, 216, 0.6)',
        borderColor: 'rgba(136, 134, 216, 1)',
        pointRadius: 5,
        type: 'scatter',
      },
      {
        label: 'Predicted Line (X_test, Predictions)',
        data: lineData,
        borderColor: '#ff7300',
        fill: false,
        tension: 0.1,
        type: 'line',
      },
    ],
  };

  const scatterOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: X: ${context.raw.x}, Y: ${context.raw.y}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'X (Feature)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: X: ${context.label}, Prediction: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'X (Feature)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Predicted Value',
        },
      },
    },
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md mt-16">
      <h2 className="text-2xl font-bold mb-4">Evaluation Metrics</h2>
      <p className="text-lg">Mean Squared Error (MSE): <span className="font-semibold">{metrics.mse}</span></p>
      <p className="text-lg">R² Score: <span className="font-semibold">{metrics.r2}</span></p>

      {/* Dropdown for view mode */}
      <div className="mb-4">
        <label htmlFor="viewMode" className="font-semibold mr-2">View Mode:</label>
        <select
          id="viewMode"
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="combined">Combined</option>
          <option value="separate">Separate</option>
        </select>
      </div>

      {/* Combined Chart or Separate Charts */}
      {viewMode === 'combined' ? (
        <div>
          <h3 className="text-xl font-semibold mb-2">Combined Chart (Training and Predicted Data)</h3>
          <div style={{ width: '100%', height: '400px' }}>
            <Scatter data={combinedChartData} options={scatterOptions} />
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-2">Training Data (X, y)</h3>
          <div style={{ width: '100%', height: '400px' }}>
            <Scatter data={{ datasets: [{ label: 'Training Data (X, y)', data: scatterData }] }} options={scatterOptions} />
          </div>
          <h3 className="text-xl font-semibold mb-2 mt-6">Predicted Data (X_test, Predictions)</h3>
          <div style={{ width: '100%', height: '400px' }}>
            <Line data={{ labels: lineData.map(d => d.x), datasets: [{ label: 'Predicted Line (X_test, Predictions)', data: lineData.map(d => d.y), borderColor: '#ff7300', fill: false }] }} options={lineOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EvalAndVisualize;
