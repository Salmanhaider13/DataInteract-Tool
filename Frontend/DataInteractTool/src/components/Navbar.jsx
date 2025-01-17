import React, { useState } from 'react';
import { useGlobalContext } from './GlobalAuthProvider';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const { userAuthenticated, setUserAuthenticated, globalUsername, setGlobalUsername } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogoutRequest = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/logout/',
        { session_id: localStorage.getItem('session_id') },
        { withCredentials: true }
      );
      console.log(response.data);
      localStorage.clear();
      setUserAuthenticated(false);
      setGlobalUsername('');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-blue-600 fixed top-0 left-0 w-full z-10 shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-white text-2xl font-bold">DataInteract Tool</h1>
        <ul className="flex items-center space-x-6">
          {userAuthenticated ? (
            <>
              <span className="text-white font-semibold">Welcome, {globalUsername}</span>
              <li>
                <Link className="text-white hover:text-gray-200 transition duration-300" to="/">Home</Link>
              </li>
              <li>
                <Link className="text-white hover:text-gray-200 transition duration-300" to="/upload">Upload Page</Link>
              </li>
              <li>
                <Link className="text-white hover:text-gray-200 transition duration-300" to="/guide">Documentation</Link>
              </li>
              <li>
                <button
                  className="text-white hover:text-gray-200 transition duration-300"
                  onClick={handleLogoutRequest}
                  disabled={loading}
                >
                  {loading ? 'Logging Out...' : 'Log Out'}
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link className="text-white hover:text-gray-200 transition duration-300" to="/">Home</Link>
              </li>
              <li>
                <Link className="text-white hover:text-gray-200 transition duration-300" to="/guide">Documentation</Link>
              </li>
              <li>
                <Link className="text-white hover:text-gray-200 transition duration-300" to="/register">Register</Link>
              </li>
              <li>
                <Link className="text-white hover:text-gray-200 transition duration-300" to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </div>
      {error && <div className="text-red-500 text-center">{error}</div>}
    </nav>
  );
};

export default Navbar;
