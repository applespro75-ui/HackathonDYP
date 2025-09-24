import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => (
  <div className="home-container">
    <h1>AI Fitness Coach</h1>
    <p>Welcome to your personalized, adaptive workout and wellness planner!</p>
    <nav>
      <ul>
        <li><Link to="/planner">Personalized Planner</Link></li>
        <li><Link to="/gamification">Gamification</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/multiuser">Multi-User Support</Link></li>
      </ul>
    </nav>
  </div>
);

export default Home;
