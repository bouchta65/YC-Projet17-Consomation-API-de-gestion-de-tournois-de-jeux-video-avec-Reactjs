import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { matchService } from '../../services/api';

function MatchList() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await matchService.getAll();
      setMatches(response.data.matches || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch matches');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      try {
        await matchService.delete(id);
        fetchMatches();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete match');
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="fas fa-gamepad"></i> Matches</h2>
        <Link to="/matches/create" className="btn btn-primary">
          <i className="fas fa-plus"></i> Create Match
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {matches.map(match => (
          <div key={match.id} className="col-md-6 mb-4">
            <div className="card match-card">
              <div className="card-body">
                <h5 className="card-title">Match #{match.id}</h5>
                <div className="match-details">
                  <p className="score">
                    <strong>Score:</strong> {match.score_player_1} - {match.score_player_2}
                  </p>
                  <p className="date">
                    <strong>Date:</strong> {new Date(match.match_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <Link 
                    to={`/matches/${match.id}`} 
                    className="btn btn-info"
                  >
                    <i className="fas fa-eye"></i> View
                  </Link>
                  <Link 
                    to={`/matches/${match.id}/edit`} 
                    className="btn btn-warning"
                  >
                    <i className="fas fa-edit"></i> Edit
                  </Link>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(match.id)}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MatchList;