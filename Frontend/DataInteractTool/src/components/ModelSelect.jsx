import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModelSelect = () => {
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [selectedFeature, setSelectedFeature] = useState('');
  const [splitRatio, setSplitRatio] = useState(0.8);
  const [correlationData, setCorrelationData] = useState([]);
  const [numericFeatures, setNumericFeatures] = useState([]);
  const [numericTargets, setNumericTargets] = useState([]);
  const [message, setMessage] = useState('');

  const models = [
    { value: '', label: 'Select a model' },
    { value: 'linear_regression', label: 'Linear Regression' },
  ];

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleTargetChange = (e) => {
    const target = e.target.value;
    setSelectedTarget(target);
    const updatedFeatures = numericFeatures.filter((feature) => feature !== target);
    setNumericFeatures(updatedFeatures);
  };

  const handleFeatureChange = (e) => {
    const feature = e.target.value;
    setSelectedFeature(feature);
    const updatedTargets = numericTargets.filter((target) => target !== feature);
    setNumericTargets(updatedTargets);
  };

  const handleSplitRatioChange = (e) => {
    setSplitRatio(e.target.value);
  };

  // Fetch correlation data from the backend
  useEffect(() => {
    const fetchCorrelationData = async () => {
      const uploadedData = JSON.parse(localStorage.getItem('data'));
      if (uploadedData) {
        try {
          const response = await axios.post('http://127.0.0.1:8000/api/correlation', {
            data: uploadedData,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          setCorrelationData(response.data.corr);
          setNumericFeatures(response.data.features);
          setNumericTargets(response.data.features);
        } catch (error) {
          console.error('Error fetching correlation data:', error.response?.data || error.message);
        }
      }
    };

    fetchCorrelationData();
  }, []);

  const handleTrainModel = async () => {
    const uploadedData = JSON.parse(localStorage.getItem('data'));
    if (!uploadedData) {
      console.error('No data found in localStorage');
      return;
    }
    if (!(selectedModel && selectedTarget && selectedFeature)) {
      alert('First select model info');
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/train', {
        model: selectedModel,
        target: selectedTarget,
        feature: selectedFeature,
        split_ratio: splitRatio,
        data: uploadedData,
      });
      console.log('Model trained successfully:', response.data);
      localStorage.setItem('mse', JSON.stringify(response.data.mse));
      localStorage.setItem('r2', JSON.stringify(response.data.r2));
      localStorage.setItem('predicted_data', JSON.stringify(response.data.predicted_data));
      localStorage.setItem('X_test', JSON.stringify(response.data.X_test));
      localStorage.setItem('X', JSON.stringify(response.data.X));
      localStorage.setItem('y', JSON.stringify(response.data.y));
      setMessage(response.data.message)
    } catch (error) {
      console.error('Error training model:', error.response?.data || error.message);
      alert('Error training model: ' + (error.response?.data.message || error.message));
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen mt-16 px-4">
      <div className="flex w-full max-w-5xl">
        {/* Left Section for Model Selection */}
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg mr-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Select Machine Learning Model</h2>
          
          <select
            value={selectedModel}
            onChange={handleModelChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          >
            {models.map((model) => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>

          <select
            value={selectedTarget}
            onChange={handleTargetChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          >
            <option value="" disabled>Select a target</option>
            {numericTargets.map((target) => (
              <option key={target} value={target}>
                {target}
              </option>
            ))}
          </select>

          <select
            value={selectedFeature}
            onChange={handleFeatureChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          >
            <option value="" disabled>Select a feature</option>
            {numericFeatures.map((feature) => (
              <option key={feature} value={feature}>
                {feature}
              </option>
            ))}
          </select>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Train-Test Split Ratio:</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={splitRatio}
              onChange={handleSplitRatioChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {selectedModel && selectedTarget && selectedFeature && (
            <div className="mt-4 text-center">
              <p className="text-gray-700">Selected Model: {selectedModel}</p>
              <p className="text-gray-700">Selected Target: {selectedTarget}</p>
              <p className="text-gray-700">Selected Feature: {selectedFeature}</p>
              <p className="text-gray-700">Split Ratio: {splitRatio}</p>
              {message&&(
                <p className="text-green-500">{message}</p>
              )}
            </div>
          )}

          <button
            onClick={handleTrainModel}
            className="mt-4 w-full p-2 bg-blue-500 text-white rounded"
          >
            Train Model
          </button>
        </div>

        {/* Right Section for Correlation Data */}
        <div className="flex-1 p-6 bg-white rounded-lg shadow-lg overflow-hidden">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Correlation Data</h3>
          {correlationData.length > 0 ? (
            <div className="relative h-80 overflow-y-auto"> {/* Set fixed height with scrolling */}
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr>
                    {Object.keys(correlationData[0]).map((key, index) => (
                      <th key={index} className={`border px-4 py-2 ${index === 0 ? 'sticky left-0 bg-white' : 'sticky top-0 bg-white'}`}>
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {correlationData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((value, colIndex) => (
                        <td key={colIndex} className={`border px-4 py-2 ${colIndex === 0 ? 'sticky left-0 bg-white' : ''}`}>
                          {value !== null ? value : 'N/A'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-4">No correlation data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelSelect;
