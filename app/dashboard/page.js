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

  const [dietType, setDietType] = useState('high-protein');
  const [preference, setPreference] = useState('vegetarian');
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [recipeResponse, setRecipeResponse] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

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

  const handleGenerateRecipe = async () => {
    const { gender, weight, height, age, activity_level, goal } = formData;

    const calorieRequestBody = {
      gender,
      weight: parseInt(weight),
      height: parseInt(height),
      age: parseInt(age),
      activity_level,
      goal,
    };

    try {
      setRecipeLoading(true);

      // Step 1: Call Calorie Intake API
      const calorieResponse = await fetch(`${process.env.NEXT_PUBLIC_CALORIE_INTAKE_API_HOST}/calculate-calories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(calorieRequestBody),
      });

      const calorieData = await calorieResponse.json();
      if (!calorieData || !calorieData.caloriesNeeded) {
        throw new Error('Calorie API did not return valid data.');
      }

      // Step 2: Use calories from the response to call Generate Meal Plan API
      const mealPlanRequestBody = {
        calories: calorieData.caloriesNeeded,
        dietType,
        preference,
      };

      const mealPlanResponse = await fetch(`${process.env.NEXT_PUBLIC_MEAL_PLAN_API_HOST}/generate-meal-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mealPlanRequestBody),
      });

      const mealPlanData = await mealPlanResponse.json();
      setRecipeResponse(mealPlanData);
      setShowRecipeModal(true);
    } catch (error) {
      console.error('Error generating recipe:', error);
    } finally {
      setRecipeLoading(false);
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

      {/* Form Fields */}
      <div className="form-container">
        <div className="form-group">
          <label htmlFor="gender" className="form-label">Gender:</label>
          <input
            type="text"
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={(e) =>
              setFormData((prevState) => ({ ...prevState, gender: e.target.value }))
            }
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
            onChange={(e) =>
              setFormData((prevState) => ({ ...prevState, weight: e.target.value }))
            }
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
            onChange={(e) =>
              setFormData((prevState) => ({ ...prevState, height: e.target.value }))
            }
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
            onChange={(e) =>
              setFormData((prevState) => ({ ...prevState, age: e.target.value }))
            }
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
            onChange={(e) =>
              setFormData((prevState) => ({ ...prevState, activity_level: e.target.value }))
            }
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
            onChange={(e) =>
              setFormData((prevState) => ({ ...prevState, goal: e.target.value }))
            }
            required
            className="form-input"
          >
            <option value="lose weight">Lose weight</option>
            <option value="maintain weight">Maintain weight</option>
            <option value="gain weight">Gain weight</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dietType" className="form-label">Diet Type:</label>
          <select
            id="dietType"
            name="dietType"
            value={dietType}
            onChange={(e) => setDietType(e.target.value)}
            required
            className="form-input"
          >
            <option value="high-protein">High Protein</option>
            <option value="low-carb">Low Carb</option>
            <option value="keto">Keto</option>
            <option value="low-fat">Low Fat</option>
            <option value="paleo">Paleo</option>
            <option value="atkins">Atkins</option>
            <option value="gluten-free">Gluten Free</option>
            <option value="hcg">HCG</option>
            <option value="zone">Zone</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="preference" className="form-label">Preference:</label>
          <select
            id="preference"
            name="preference"
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            required
            className="form-input"
          >
            <option value="vegetarian">Vegetarian</option>
            <option value="non-vegetarian">Non-Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>
        </div>
      </div>

      {/* Generate Recipe Button */}
      <button
        onClick={handleGenerateRecipe}
        className={`mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition ${
          recipeLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={recipeLoading}
      >
        {recipeLoading ? 'Generating Recipe...' : 'Generate Recipe'}
      </button>

      {/* Recipe Modal */}
      {showRecipeModal && recipeResponse && recipeResponse.recipes && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Generated Meal Plan</h2>

            {/* Scrollable Content Section */}
            <div className="max-h-[400px] overflow-y-auto mb-4">
              {/* Loop through the recipeResponse.recipes and display in a readable format */}
              {recipeResponse.recipes && recipeResponse.recipes.length > 0 ? (
                recipeResponse.recipes.map((meal, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">{meal.mealType}</h3>
                    <h4 className="text-lg font-medium mb-2">{meal.mealName}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Calories:</strong> {meal.caloriesPerServing} per serving
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Servings:</strong> {meal.servings}
                    </p>

                    <div className="mb-2">
                      <strong>Ingredients:</strong>
                      <ul className="list-disc pl-5 text-sm text-gray-600">
                        {meal.ingredients.map((ingredient, idx) => (
                          <li key={idx}>
                            {ingredient.amount} {ingredient.unit} of {ingredient.item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <strong>Preparation Steps:</strong>
                      <ol className="list-decimal pl-5 text-sm text-gray-600">
                        {meal.preparationSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No recipes found within the given calorie limit.</p>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowRecipeModal(false)}
              className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
