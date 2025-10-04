import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Emissions from './pages/Emissions';
import Optimization from './pages/Optimization';
import CostReduction from './pages/CostReduction';
import Chatbot from './pages/Chatbot';
import Info from './pages/Info';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="emissions" element={<Emissions />} />
              <Route path="optimization" element={<Optimization />} />
              <Route path="cost-reduction" element={<CostReduction />} />
              <Route path="chatbot" element={<Chatbot />} />
              <Route path="info" element={<Info />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
