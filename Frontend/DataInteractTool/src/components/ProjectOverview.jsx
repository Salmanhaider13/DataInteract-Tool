// src/components/ProjectOverview.js
import React from 'react';

const ProjectOverview = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">DataInteract Tool</h1>
      <p className="mb-4">The DataInteract Tool is a web application designed for efficient data management and preprocessing, built with Django and React.</p>

      <h2 className="text-3xl font-semibold mt-8 mb-4">Technology Stack</h2>
      <h3 className="text-2xl font-semibold mt-4">Backend:</h3>
      <p>Django, handling server-side logic and database interactions.</p>

      <h3 className="text-2xl font-semibold mt-4">Frontend:</h3>
      <p>React, enabling dynamic user interfaces.</p>

      <h3 className="text-2xl font-semibold mt-4">Database:</h3>
      <p>SQLite for data storage.</p>

      <h3 className="text-2xl font-semibold mt-4">Additional Technologies:</h3>
      <ul className="list-disc list-inside">
        <li>Pandas</li>
        <li>Scikit-learn</li>
        <li>Papaparse</li>
        <li>Chart.js</li>
        <li>Tailwind CSS</li>
        <li>Axios</li>
      </ul>

      <h2 className="text-3xl font-semibold mt-8 mb-4">Features</h2>
      <ul className="list-disc list-inside">
        <li>User Authentication</li>
        <li>Data Upload</li>
        <li>Data Preprocessing</li>
        <li>Model Selection</li>
        <li>Evaluation and Visualization</li>
      </ul>

      <h2 className="text-3xl font-semibold mt-8 mb-4">Installation Guide</h2>
      <p>Follow these steps to get started:</p>
      <pre className="bg-gray-100 p-4 rounded">
        {`1. Clone the Repository:
   git clone DataInteractTool
   cd DataInteractTool

2. Backend Setup:
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver

3. Frontend Setup:
   cd frontend
   npm install
   npm run dev

4. Access the Application:
   Frontend: http://localhost:5173
   Admin: http://localhost:8000/admin`}
      </pre>

      <h2 className="text-3xl font-semibold mt-8 mb-4">API Endpoints</h2>
      <h3 className="text-2xl font-semibold mt-4">User Authentication:</h3>
      <ul className="list-disc list-inside">
        <li>POST /api/register/</li>
        <li>POST /api/login/</li>
      </ul>

      <h3 className="text-2xl font-semibold mt-4">Data Management:</h3>
      <ul className="list-disc list-inside">
        <li>POST /api/upload/</li>
        <li>GET /api/preprocess/</li>
        <li>POST /api/model-select/</li>
        <li>GET /api/evaluate/</li>
      </ul>

      <h2 className="text-3xl font-semibold mt-8 mb-4">User Guide</h2>
      <p>How to use the DataInteract Tool:</p>
      <ol className="list-decimal list-inside">
        <li>Register/Login</li>
        <li>Upload Data</li>
        <li>Preprocess Data</li>
        <li>Select a Model</li>
        <li>Evaluate Results</li>
      </ol>

      <h2 className="text-3xl font-semibold mt-8 mb-4">Support and Contributions</h2>
      <p>If you encounter issues, reach out via:</p>
      <ul className="list-disc list-inside">
        <li>Email: <a href="#">#</a></li>
        <li>GitHub Issues: <a href="#">Report an issue</a></li>
      </ul>

      <h2 className="text-3xl font-semibold mt-8 mb-4">Conclusion</h2>
      <p>Thank you for using the DataInteract Tool! We hope this project assists you in your data analysis journey.</p>
    </div>
  );
};

export default ProjectOverview;
