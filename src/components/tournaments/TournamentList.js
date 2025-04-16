import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tournamentService } from '../../services/api';

function TournamentList() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await tournamentService.getAll();
      setTournaments(response.data.Tournois || []); // Note: API returns data.Tournois
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tournaments');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      try {
        await tournamentService.delete(id);
        // Refresh the list after deletion
        fetchTournaments();
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

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="fas fa-trophy"></i> Tournaments</h2>
        <Link to="/tournaments/create" className="btn btn-primary">
          <i className="fas fa-plus"></i> Create Tournament
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {tournaments.map(tournament => (
          <div key={tournament.id} className="col-md-4 mb-4">
            <div className="card h-100">
              {tournament.image && (
                <img 
                  src={tournament.image} 
                  className="card-img-top" 
                  alt={tournament.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{tournament.name}</h5>
                <p className="card-text">
                  <strong>Rules:</strong> {tournament.rules}<br />
                  <strong>Players:</strong> {tournament.nb_players}
                </p>
                <div className="d-flex justify-content-between mt-3">
                  <Link 
                    to={`/tournaments/${tournament.id}`} 
                    className="btn btn-info"
                  >
                    <i className="fas fa-eye"></i> View
                  </Link>
                  {tournament.creator_id === parseInt(localStorage.getItem('userId')) && (
                    <>
                      <Link 
                        to={`/tournaments/${tournament.id}/edit`} 
                        className="btn btn-warning"
                      >
                        <i className="fas fa-edit"></i> Edit
                      </Link>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(tournament.id)}
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TournamentList;