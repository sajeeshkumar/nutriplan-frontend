'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // State to track loading

  const handleLogin = async () => {
    setLoading(true); // Show progress bar
    setError(null); // Clear any existing errors
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_HOST}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error('Login failed');
      }

      const data = await res.json();
      localStorage.setItem('authToken', data.token);
      router.push('/dashboard');
    } catch (error) {
      console.log(error);
      setError('Invalid username or password');
    } finally {
      setLoading(false); // Hide progress bar
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Log in to Your Account</h1>
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error}
          </p>
        )}
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-600 font-medium mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-600 font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        <button
          onClick={handleLogin}
          className={`w-full font-medium py-2 rounded-lg transition duration-300 ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
        {loading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{ width: '50%' }}></div>
            </div>
          </div>
        )}
      </div>
      <p className="text-gray-500 text-xs mt-6">
        &copy; {new Date().getFullYear()} KodingKrafters Inc. All rights reserved.
      </p>
    </div>
  );
}
