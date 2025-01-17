import React, { useState } from 'react';
import { useGlobalContext } from './GlobalAuthProvider';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const { userAuthenticated, setUserAuthenticated, setGlobalUsername } = useGlobalContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLoginRequest = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/login/', {
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            localStorage.setItem('session_id', response.data['session_id']);
            setResponseMessage(response.data.message || 'Login successful!');
            setUserAuthenticated(true);
            setGlobalUsername(username);
            setError('');
            navigate('/');
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
            setResponseMessage('');
        }
    };

    const handleLogoutRequest = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/logout/', { 'session_id': localStorage.getItem('session_id') }, {
                withCredentials: true,
            });
            localStorage.clear();
            setUserAuthenticated(false);
            setGlobalUsername('');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return userAuthenticated ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <p className="text-lg">Already logged in</p>
            <h1 className="mt-4">
                <Link className="text-blue-500 hover:underline" onClick={handleLogoutRequest}>Logout</Link>
            </h1>
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Login</h2>
            <form onSubmit={handleLoginRequest} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <div className="mb-4">
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">Username:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-300"
                >
                    Login
                </button>
            </form>
            <div className="mt-4 w-full max-w-md text-center">
                {responseMessage && <p className="text-green-500">{responseMessage}</p>}
                {error && <p className="text-red-500">{error}</p>}
            </div>
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">Don't have an account? 
                    <Link to="/register" className="text-blue-500 hover:underline ml-1">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
