// App.jsx - Complete Single Page React Application
import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'male', height: '', weight: '',
    goal: 'weight-loss', fitnessLevel: 'beginner', location: 'gym',
    diet: 'veg', medicalHistory: '', stressLevel: 'low'
  });

  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [readSection, setReadSection] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [motivationQuote, setMotivationQuote] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePlan = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://ai-fitness-backend-raqo.onrender.com/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setGeneratedPlan(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      alert('Failed to generate plan');
    }
  };

  const regeneratePlan = () => {
    setGeneratedPlan(null);
    generatePlan();
  };

  const generateImage = async (itemName, type) => {
    setImageLoading(true);
    try {
      const response = await fetch('https://ai-fitness-backend-raqo.onrender.com/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName, type })
      });
      const data = await response.json();
      setSelectedImage({ name: itemName, url: data.image });
      setImageLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setImageLoading(false);
      alert('Failed to generate image');
    }
  };

  const readPlan = async (section) => {
    setIsReading(true);
    setReadSection(section);
    try {
      let textToRead = section === 'workout' ? JSON.stringify(generatedPlan.workoutPlan) :
                       section === 'diet' ? JSON.stringify(generatedPlan.dietPlan) :
                       JSON.stringify(generatedPlan);

      const response = await fetch('https://ai-fitness-backend-raqo.onrender.com/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToRead })
      });
      
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.onended = () => { setIsReading(false); setReadSection(''); };
      audio.play();
    } catch (error) {
      console.error('Error:', error);
      setIsReading(false);
      setReadSection('');
      alert('Failed to read plan');
    }
  };

  const exportAsPDF = async () => {
    try {
      const response = await fetch('https://ai-fitness-backend-raqo.onrender.com/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatedPlan)
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fitness-plan.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to export PDF');
    }
  };

  const getDailyMotivation = async () => {
    try {
      const response = await fetch('https://ai-fitness-backend-raqo.onrender.com/api/motivation');
      const data = await response.json();
      setMotivationQuote(data.quote);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  React.useEffect(() => { getDailyMotivation(); }, []);

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <header className="header">
        <div className="header-content">
          <h1 className="logo">💪 AI Fitness Coach</h1>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="main-content">
        {motivationQuote && (
          <div className="motivation-section">
            <p className="motivation-quote">"{motivationQuote}"</p>
          </div>
        )}

        {!generatedPlan && (
          <div className="form-container">
            <h2 className="section-title">Let's Build Your Perfect Fitness Plan</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your name" required />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleInputChange} placeholder="Enter your age" required />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Height (cm)</label>
                <input type="number" name="height" value={formData.height} onChange={handleInputChange} placeholder="Enter height in cm" required />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="Enter weight in kg" required />
              </div>
              <div className="form-group">
                <label>Fitness Goal</label>
                <select name="goal" value={formData.goal} onChange={handleInputChange}>
                  <option value="weight-loss">Weight Loss</option>
                  <option value="muscle-gain">Muscle Gain</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="endurance">Endurance</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fitness Level</label>
                <select name="fitnessLevel" value={formData.fitnessLevel} onChange={handleInputChange}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="form-group">
                <label>Workout Location</label>
                <select name="location" value={formData.location} onChange={handleInputChange}>
                  <option value="gym">Gym</option>
                  <option value="home">Home</option>
                  <option value="outdoor">Outdoor</option>
                </select>
              </div>
              <div className="form-group">
                <label>Dietary Preference</label>
                <select name="diet" value={formData.diet} onChange={handleInputChange}>
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="keto">Keto</option>
                </select>
              </div>
              <div className="form-group">
                <label>Stress Level</label>
                <select name="stressLevel" value={formData.stressLevel} onChange={handleInputChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Medical History (Optional)</label>
                <textarea name="medicalHistory" value={formData.medicalHistory} onChange={handleInputChange} placeholder="Any medical conditions, injuries, or medications..." rows="3" />
              </div>
            </div>
            <button className="submit-btn" onClick={generatePlan} disabled={loading}>
              {loading ? 'Generating Your Plan...' : 'Generate My Fitness Plan 🚀'}
            </button>
          </div>
        )}

        {generatedPlan && (
          <div className="plan-container">
            <div className="plan-header">
              <h2>Your Personalized Fitness Plan</h2>
              <div className="plan-actions">
                <button onClick={() => readPlan('all')} disabled={isReading}>🔊 Read Full Plan</button>
                <button onClick={exportAsPDF}>📄 Export as PDF</button>
                <button onClick={regeneratePlan}>🔄 Regenerate Plan</button>
                <button onClick={() => setGeneratedPlan(null)}>← Back to Form</button>
              </div>
            </div>

            <div className="plan-section">
              <div className="section-header">
                <h3>🏋️ Workout Plan</h3>
                <button onClick={() => readPlan('workout')} disabled={isReading} className="read-btn">
                  {isReading && readSection === 'workout' ? 'Reading...' : 'Read Workout Plan'}
                </button>
              </div>
              {generatedPlan.workoutPlan && (
                <div className="workout-days">
                  {generatedPlan.workoutPlan.map((day, index) => (
                    <div key={index} className="day-card">
                      <h4>{day.day}</h4>
                      {day.exercises.map((exercise, exIndex) => (
                        <div key={exIndex} className="exercise-item" onClick={() => generateImage(exercise.name, 'exercise')}>
                          <p className="exercise-name">{exercise.name}</p>
                          <p className="exercise-details">{exercise.sets} sets × {exercise.reps} reps | Rest: {exercise.rest}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="plan-section">
              <div className="section-header">
                <h3>🥗 Diet Plan</h3>
                <button onClick={() => readPlan('diet')} disabled={isReading} className="read-btn">
                  {isReading && readSection === 'diet' ? 'Reading...' : 'Read Diet Plan'}
                </button>
              </div>
              {generatedPlan.dietPlan && (
                <div className="meals-container">
                  {Object.entries(generatedPlan.dietPlan).map(([meal, items]) => (
                    <div key={meal} className="meal-card">
                      <h4>{meal.charAt(0).toUpperCase() + meal.slice(1)}</h4>
                      {items.map((item, index) => (
                        <div key={index} className="meal-item" onClick={() => generateImage(item.name, 'food')}>
                          <p className="meal-name">{item.name}</p>
                          <p className="meal-details">{item.calories} cal | {item.protein}g protein</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {generatedPlan.tips && (
              <div className="plan-section">
                <h3>💡 AI Tips & Recommendations</h3>
                <div className="tips-container">
                  {generatedPlan.tips.map((tip, index) => (
                    <div key={index} className="tip-card"><p>{tip}</p></div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedImage && (
          <div className="image-modal" onClick={() => setSelectedImage(null)}>
            <div className="modal-content">
              <h3>{selectedImage.name}</h3>
              {imageLoading ? <p>Generating image...</p> : <img src={selectedImage.url} alt={selectedImage.name} />}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
