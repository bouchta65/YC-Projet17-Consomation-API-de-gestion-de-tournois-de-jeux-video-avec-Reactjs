import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { matchService } from '../../services/api';

function MatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMatchDetails();
  }, [id]);

  const fetchMatchDetails = async () => {
    try {
      const response = await matchService.getDetails(id);
      setMatch(response.data.matche);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch match details');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      try {
        await matchService.delete(id);
        navigate('/matches');
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

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!match) return <div className="alert alert-info">Match not found</div>;

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Match Details</h2>
          
          <div className="match-info mb-4">
            <p><strong>Tournament ID:</strong> {match.tournoi_id}</p>
            <p><strong>Date:</strong> {new Date(match.match_date).toLocaleDateString()}</p>
            <div className="score-display">
              <h4>Score</h4>
              <div className="d-flex justify-content-around align-items-center">
                <div className="text-center">
                  <p>Player 1</p>
                  <h2>{match.score_player_1}</h2>
                </div>
                <div className="text-center">
                  <h3>VS</h3>
                </div>
                <div className="text-center">
                  <p>Player 2</p>
                  <h2>{match.score_player_2}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <Link to="/matches" className="btn btn-secondary">
              <i className="fas fa-arrow-left"></i> Back to Matches
            </Link>
            <div className="d-flex gap-2">
              <Link 
                to={`/matches/${id}/edit`}
                className="btn btn-warning"
              >
                <i className="fas fa-edit"></i> Edit Match
              </Link>
              <button 
                className="btn btn-danger"
                onClick={handleDelete}
              >
                <i className="fas fa-trash"></i> Delete Match
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchDetails;