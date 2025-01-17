// src/components/TaskHeader.js
import React from 'react';
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import UploadData from './UploadData';
import Preprocessing from './Preprocessing';
import ModelSelect from './ModelSelect';
import EvalAndVisualize from './EvalAndVisualize';

const TaskHeader = () => {
  const tasks = [
    { path: '/upload', title: 'Upload' },
    { path: '/pre-processing', title: 'Preprocess' },
    { path: '/model-select', title: 'Model Selection' },
    { path: '/eval-visualize', title: 'Evaluate and Visualize' },
  ];

  const location = useLocation();
  const navigate = useNavigate();
  const currentIndex = tasks.findIndex(task => task.path === location.pathname);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      navigate(tasks[currentIndex - 1].path);
    }
  };

  const goToNext = () => {
    if (currentIndex < tasks.length - 1) {
      navigate(tasks[currentIndex + 1].path);
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded shadow mb-6">
      <h2 className="text-3xl font-semibold text-gray-800">Task Overview</h2>
      <nav className="mt-4 flex space-x-6">
        {tasks.map((task) => (
          <Link
            key={task.path}
            to={task.path}
            className="flex items-center flex-grow inline-block px-4 py-2 text-center rounded transition duration-300 bg-blue-500 text-white hover:bg-blue-600"
          >
            {task.title} <span className="ml-2">→</span>
          </Link>
        ))}
      </nav>
      <div className="mt-6 flex justify-between">
        <button 
          onClick={goToPrevious} 
          disabled={currentIndex === 0} 
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Previous
        </button>
        <button 
          onClick={goToNext} 
          disabled={currentIndex === tasks.length - 1} 
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Next
        </button>
      </div>
      <Routes>
        <Route path="/upload" element={<UploadData />} />
        <Route path="/pre-processing" element={<Preprocessing />} />
        <Route path="/model-select" element={<ModelSelect />} />
        <Route path="/eval-visualize" element={<EvalAndVisualize />} />
      </Routes>
    </div>
  );
};

export default TaskHeader;
