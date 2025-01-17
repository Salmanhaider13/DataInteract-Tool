import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [error, setError] = useState('');
    const navigate=useNavigate()

    const handleRegisterRequest = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/register/', {
                username,
                email,
                password,
                confirm_password: confirmPassword
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setResponseMessage(response.data.message || 'Registration successful!');
            setError('');
            navigate('/login')
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'An error occurred');
            } else {
                setError('An error occurred');
            }
            setResponseMessage('');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Register</h2>
            <form onSubmit={handleRegisterRequest} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <div className="mb-4">
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">Username:</label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email:</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password:</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-700">Confirm Password:</label>
                    <input
                        id="confirm_password"
                        type="password"
                        name="confirm_password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-300"
                >
                    Register
                </button>
            </form>

            <div className="mt-4 w-full max-w-md text-center">
                {responseMessage && <p className="text-green-500">{responseMessage}</p>}
                {error && <p className="text-red-500">{error}</p>}
            </div>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">Already have an account? 
                    <Link to="/login" className="text-blue-500 hover:underline ml-1">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
