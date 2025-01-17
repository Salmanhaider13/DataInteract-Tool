import React, { useState } from 'react';
import { useGlobalContext } from './GlobalAuthProvider';
import axios from 'axios';

const Preprocessing = () => {
    const { setGlobalDataset } = useGlobalContext();
    const [dropna, setDropna] = useState(false);
    const [removeOutliers, setRemoveOutliers] = useState(false);
    const [data, setData] = useState(() => {
        const storedData = localStorage.getItem('data');
        return storedData ? JSON.parse(storedData) : [];
    });
    const [error, setError] = useState('');

    const handleOptionChange = (e) => {
        const { name, checked } = e.target;
        if (name === 'dropna') {
            setDropna(checked);
        } else if (name === 'removeOutliers') {
            setRemoveOutliers(checked);
        }
    };

    const preprocessData = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/preprocess', {
                options: { dropna, removeOutliers },
                data: data,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status !== 200) {
                throw new Error('Failed to preprocess data');
            }

            setGlobalDataset(response.data.data);
            localStorage.setItem('data', JSON.stringify(response.data.data));
            setError('Data Processed');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen mt-16 px-4">
            <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Data Preprocessing Options</h2>
                <div className="space-y-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="dropna"
                            checked={dropna}
                            onChange={handleOptionChange}
                            className="mr-2"
                        />
                        Drop NaN values
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="removeOutliers"
                            checked={removeOutliers}
                            onChange={handleOptionChange}
                            className="mr-2"
                        />
                        Remove Outliers
                    </label>
                    {error && <div className="mt-2 text-green-500">{error}</div>}
                    <button
                        onClick={preprocessData}
                        className="w-full py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-300"
                    >
                        Process Data
                    </button>
                </div>
            </div>

            <div className="w-full max-w-2xl mt-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Dataset</h2>
                {data.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    {Object.keys(data[0]).map((key) => (
                                        <th key={key} className="px-4 py-2 text-left text-gray-700 border-b">{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                        {Object.values(row).map((value, i) => (
                                            <td key={i} className="px-4 py-2 border-b">{value}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center p-4">No data loaded.</p>
                )}
            </div>
        </div>
    );
};

export default Preprocessing;
