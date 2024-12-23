'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      // Redirect to login if not authenticated
      router.push('/');
    }
  }, []);

  const handleLogout = () => {
    // Clear any client-side authentication data
    localStorage.removeItem('authToken');
    // Redirect to login page
    router.push('/');
  };

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}
