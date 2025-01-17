import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import TaskHeader from './components/TaskHeader';
import Footer from './components/Footer';
import { Line } from 'react-chartjs-2';
import ProjectOverview from './components/ProjectOverview';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="flex flex-col h-screen mt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/guide" element={<ProjectOverview />} />
          <Route path="/*" element={<TaskHeader />} />
        </Routes>
      </div>
    </Router>
  );
};

const Home = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'UV Data',
        data: [4000, 3000, 2000, 2780, 1890, 2390, 3490],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
      {
        label: 'PV Data',
        data: [2400, 1398, 9800, 3908, 4800, 3800, 4300],
        fill: false,
        backgroundColor: 'rgba(153,102,255,0.4)',
        borderColor: 'rgba(153,102,255,1)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to DataInteract Tool</h2>
      <p className="mt-4 text-lg text-gray-600">
        Your go-to solution for seamless data management and preprocessing.
        Explore our features and streamline your workflow today!
      </p>

      <div className="mt-6">
        <Link
          className="inline-block px-6 py-3 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-300"
          to="/upload"
        >
          Go to Upload Page
        </Link>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-700">Features</h3>
        <ul className="mt-4 list-none space-y-2">
          <li className="bg-gray-200 p-4 rounded shadow">📁 Upload Data: Effortlessly upload your CSV files.</li>
          <li className="bg-gray-200 p-4 rounded shadow">🔍 Preprocess Data: Clean and prepare your data with various options.</li>
          <li className="bg-gray-200 p-4 rounded shadow">📊 Visualize Results: Gain insights from your processed data.</li>
          <li className="bg-gray-200 p-4 rounded shadow">🔐 Secure Login: Your data is safe with our authentication system.</li>
        </ul>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-700">Monthly Data Overview</h3>
        <Line data={data} options={options} />
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-700">Get Started Now!</h3>
        <p className="mt-2 text-gray-600">Create an account or log in to begin your data journey.</p>
        <div className="mt-4 flex justify-center space-x-4">
          <Link
            className="inline-block px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition duration-300"
            to="/register"
          >
            Register
          </Link>
          <Link
            className="inline-block px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-300"
            to="/login"
          >
            Login
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};


export default App;
