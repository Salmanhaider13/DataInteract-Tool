import React, { useState } from 'react';
import { useGlobalContext } from './GlobalAuthProvider';
import Papa from 'papaparse';
import axios from 'axios';

const UploadData = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 mt-16 px-4">
        <Upload />
    </div>
);

const Upload = () => {
    const { setGlobalDataset, userAuthenticated } = useGlobalContext();
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [previewData, setPreviewData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.name.split('.').pop() === 'csv') {
            setFile(selectedFile);
            previewFile(selectedFile);
        } else {
            alert('Please upload a CSV file.');
            setFile(null);
            setPreviewData([]);
        }
    };

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const csvData = event.target.result;
            Papa.parse(csvData, {
                header: true,
                complete: (results) => setPreviewData(results.data),
                error: (error) => console.error('Error parsing CSV:', error),
            });
        };
        reader.readAsText(file);
    };

    const handleSubmitData = async (e) => {
        e.preventDefault();
        if (file) {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('session_id', localStorage.getItem('session_id'));

            try {
                const response = await axios.post('http://localhost:8000/upload/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                });

                if (response.status === 200) {
                    const data = response.data;
                    setMessage(`File uploaded successfully!`);
                    // setMessage(`File uploaded successfully! File ID: ${data.file_id}`);
                    localStorage.setItem('data', JSON.stringify(data.data));
                    setGlobalDataset(data.data);
                    setFile(null);
                    setPreviewData([]);
                } else {
                    setMessage(`Upload failed: ${response.data.error}`);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                setMessage(error.response?.data?.error || 'Error uploading file. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    if (!userAuthenticated) {
        return <div>Please log in to upload data. <a href="/login">Click for login page</a></div>;
    }

    return (
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-800">Upload Data</h2>
            <form onSubmit={handleSubmitData} encType="multipart/form-data" className="mt-4">
                <div className="mb-4">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".csv"
                        className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:mr-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!file || loading}
                    className={`w-full py-2 text-white rounded transition duration-300 ${file && !loading ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                    {loading ? 'Uploading...' : 'Upload'}
                </button>
            </form>
            {message && <p className={`mt-4 text-center ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
            {previewData.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Preview Data</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full mt-2 bg-white border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    {Object.keys(previewData[0]).map((key) => (
                                        <th key={key} className="px-4 py-2 text-left text-gray-700">{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.map((row, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                        {Object.values(row).map((value, idx) => (
                                            <td key={idx} className="px-4 py-2 border border-gray-300">{value}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadData;
