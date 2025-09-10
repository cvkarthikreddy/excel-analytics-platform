import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AnalysisPage from './pages/AnalysisPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analysis/:fileId" element={<AnalysisPage />} />
          </Route>

          {/* Admin Route */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;

