import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Planner from './pages/Planner';
import Gamification from './pages/Gamification';
import Dashboard from './pages/Dashboard';
import MultiUser from './pages/MultiUser';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/gamification" element={<Gamification />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/multiuser" element={<MultiUser />} />
      </Routes>
    </Router>
  );
}

export default App;
