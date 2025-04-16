import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tournamentService } from '../../services/api';
import TournamentPlayers from '../players/TournamentPlayers';

function TournamentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTournamentDetails();
  }, [id]);

  const fetchTournamentDetails = async () => {
    try {
      const response = await tournamentService.getById(id);
      setTournament(response.data.tournoi);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tournament details');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      try {
        await tournamentService.delete(id);
        navigate('/tournaments');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete tournament');
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

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{error}</div>
        <Link to="/tournaments" className="btn btn-secondary">
          <i className="fas fa-arrow-left"></i> Back to Tournaments
        </Link>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="container py-4">
        <div className="alert alert-info">Tournament not found</div>
        <Link to="/tournaments" className="btn btn-secondary">
          <i className="fas fa-arrow-left"></i> Back to Tournaments
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title">{tournament.name}</h2>
          
          {tournament.image && (
            <img 
              src={tournament.image} 
              alt={tournament.name}
              className="img-fluid mb-3 rounded"
              style={{ maxHeight: '300px', objectFit: 'cover' }}
            />
          )}

          <div className="mb-4">
            <h5>Tournament Details</h5>
            <div className="tournament-info">
              <p><strong>Rules:</strong> {tournament.rules}</p>
              <p><strong>Number of Players:</strong> {tournament.nb_players}</p>
              <p>
                <strong>Created by:</strong> {tournament.creator_id === parseInt(localStorage.getItem('userId')) ? 
                  'You' : `User ${tournament.creator_id}`}
              </p>
              <p>
                <strong>Created at:</strong> {new Date(tournament.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          {parseInt(localStorage.getItem('userId')) === tournament.creator_id && (
            <div className="d-flex gap-2">
              <Link 
                to={`/tournaments/${id}/edit`}
                className="btn btn-warning"
              >
                <i className="fas fa-edit"></i> Edit Tournament
              </Link>
              <button 
                className="btn btn-danger"
                onClick={handleDelete}
              >
                <i className="fas fa-trash"></i> Delete Tournament
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add the Players Section */}
      <TournamentPlayers />

      <div className="mt-3">
        <Link to="/tournaments" className="btn btn-secondary">
          <i className="fas fa-arrow-left"></i> Back to Tournaments
        </Link>
      </div>

      {/* Debug Information (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4">
          <hr />
          <small className="text-muted">
            <strong>Debug Info:</strong><br />
            Tournament ID: {id}<br />
            Current User ID: {localStorage.getItem('userId')}<br />
            Creator ID: {tournament.creator_id}<br />
            Created At: {tournament.created_at}<br />
            Last Updated: {tournament.updated_at}
          </small>
        </div>
      )}
    </div>
  );
}

export default TournamentDetails;