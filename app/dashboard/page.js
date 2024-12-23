'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  // State to hold the form data
  const [formData, setFormData] = useState({
    gender: '',
    weight: '',
    height: '',
    age: '',
    activity_level: 'moderately active',
    goal: 'lose weight',
  });

  // State to hold the API response data
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    // Check if the user is authenticated
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      // Redirect to login if not authenticated
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    // Clear any client-side authentication data
    localStorage.removeItem('authToken');
    // Redirect to login page
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

    // Prepare the JSON to send to the API
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
      setApiResponse(data); // Update API response
    } catch (error) {
      console.error('Error making API call:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard</h1>

      {/* Logout Link */}
      <a
        href="#"
        className="logout-link"
        onClick={handleLogout}
      >
        Log Out
      </a>

      {/* Form to input details */}
      <form onSubmit={handleSubmit} className="form-container">
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

        <button type="submit">Submit</button>
      </form>

      {/* Displaying the response from the API in form fields */}
      {apiResponse && (
        <div className="result-container">
          <h2>Response</h2>
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
