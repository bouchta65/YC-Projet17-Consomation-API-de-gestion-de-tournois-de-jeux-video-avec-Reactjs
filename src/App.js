import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/auth/login';
import Register from './components/auth/register';

// Tournament Components
import TournamentList from './components/tournaments/TournamentList';
import TournamentDetails from './components/tournaments/TournamentDetails';
import CreateTournament from './components/tournaments/CreateTournament';
import EditTournament from './components/tournaments/EditTournament';

// Match Components
import MatchList from './components/matches/MatchList';
import MatchDetails from './components/matches/MatchDetails';
import CreateMatch from './components/matches/CreateMatch';
import EditMatch from './components/matches/EditMatch';

// Other Components
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';

// Styles
import './App.css';

function App() {
  // Get current user info from localStorage
  const currentUser = localStorage.getItem('userId');
  const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

  return (
    <Router>
      <div className="main-container">
        <Navbar />
        <div className="container py-4">
          {/* User Info Debug (remove in production) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="alert alert-info mb-4">
              <small>
                Current User: {currentUser || 'Not logged in'}<br />
                Current Time: {currentDate}
              </small>
            </div>
          )}

          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Tournament Routes */}
            <Route 
              path="/tournaments" 
              element={
                <PrivateRoute>
                  <TournamentList />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/tournaments/create" 
              element={
                <PrivateRoute>
                  <CreateTournament />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/tournaments/:id" 
              element={
                <PrivateRoute>
                  <TournamentDetails />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/tournaments/:id/edit" 
              element={
                <PrivateRoute>
                  <EditTournament />
                </PrivateRoute>
              } 
            />

            {/* Protected Match Routes */}
            <Route 
              path="/matches" 
              element={
                <PrivateRoute>
                  <MatchList />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/matches/create" 
              element={
                <PrivateRoute>
                  <CreateMatch />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/matches/:id" 
              element={
                <PrivateRoute>
                  <MatchDetails />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/matches/:id/edit" 
              element={
                <PrivateRoute>
                  <EditMatch />
                </PrivateRoute>
              } 
            />

            {/* Protected Profile Route */}
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />

            {/* Default Route */}
            <Route 
              path="/" 
              element={
                localStorage.getItem('token') 
                  ? <Navigate to="/tournaments" replace /> 
                  : <Navigate to="/login" replace />
              } 
            />

            {/* Catch-all Route */}
            <Route 
              path="*" 
              element={
                localStorage.getItem('token') 
                  ? <Navigate to="/tournaments" replace /> 
                  : <Navigate to="/login" replace />
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;