'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    gender: '',
    weight: '',
    height: '',
    age: '',
    activity_level: 'moderately active',
    goal: 'lose weight',
  });

  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { gender, weight, height, age, activity_level, goal } = formData;

    const requestBody = {
      gender,
      weight: parseInt(weight),
      height: parseInt(height),
      age: parseInt(age),
      activity_level,
      goal,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CALORIE_INTAKE_API_HOST}/calculate-calories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      setApiResponse(data);
    } catch (error) {
      console.error('Error making API call:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
        <a
          href="#"
          className="text-blue-600 font-medium hover:underline"
          onClick={handleLogout}
        >
          Log Out
        </a>
      </header>

      <form onSubmit={handleSubmit} className="form-container">
        {/* Form Fields */}
        <div className="form-group">
          <label htmlFor="gender" className="form-label">Gender:</label>
          <input
            type="text"
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="weight" className="form-label">Weight (kg):</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="height" className="form-label">Height (cm):</label>
          <input
            type="number"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="age" className="form-label">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="activity_level" className="form-label">Activity Level:</label>
          <select
            id="activity_level"
            name="activity_level"
            value={formData.activity_level}
            onChange={handleChange}
            required
            className="form-input"
          >
            <option value="sedentary">Sedentary</option>
            <option value="lightly active">Lightly active</option>
            <option value="moderately active">Moderately active</option>
            <option value="very active">Very active</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="goal" className="form-label">Goal:</label>
          <select
            id="goal"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            required
            className="form-input"
          >
            <option value="lose weight">Lose weight</option>
            <option value="maintain weight">Maintain weight</option>
            <option value="gain weight">Gain weight</option>
          </select>
        </div>
        <button type="submit" className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>

      {apiResponse && (
        <div className="result-container mt-6">
          <h2 className="text-xl font-bold">Response</h2>
          <div className="form-group">
            <label htmlFor="apiActivityLevel" className="form-label">Activity Level:</label>
            <input
              type="text"
              id="apiActivityLevel"
              value={apiResponse.activityLevel}
              disabled
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="apiBmr" className="form-label">Basal Metabolic Rate (BMR):</label>
            <input
              type="text"
              id="apiBmr"
              value={apiResponse.bmr}
              disabled
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="apiCaloriesNeeded" className="form-label">Daily Calorie Intake:</label>
            <input
              type="text"
              id="apiCaloriesNeeded"
              value={apiResponse.caloriesNeeded}
              disabled
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="apiGoal" className="form-label">Goal:</label>
            <input
              type="text"
              id="apiGoal"
              value={apiResponse.goal}
              disabled
              className="form-input"
            />
          </div>
        </div>
      )}
    </div>
  );
}
