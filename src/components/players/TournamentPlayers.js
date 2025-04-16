import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { tournamentService } from '../../services/api';

function TournamentPlayers() {
  const { id } = useParams();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    fetchPlayers();
  }, [id]);

  const fetchPlayers = async () => {
    try {
      const response = await tournamentService.getPlayers(id);
      setPlayers(response.data.players || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch players');
      setLoading(false);
    }
  };

  const handleJoinTournament = async () => {
    try {
      await tournamentService.addPlayer(id);
      fetchPlayers(); // Refresh the players list
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to join tournament');
    }
  };

  const handleLeaveTournament = async () => {
    if (window.confirm('Are you sure you want to leave this tournament?')) {
      try {
        await tournamentService.removePlayers(id);
        fetchPlayers(); // Refresh the players list
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to leave tournament');
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-3">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const isPlayerInTournament = players.some(
    player => player.player_id.toString() === currentUserId
  );

  return (
    <div className="tournament-players-section">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Tournament Players</h3>
        {!isPlayerInTournament ? (
          <button 
            className="btn btn-success"
            onClick={handleJoinTournament}
          >
            <i className="fas fa-user-plus"></i> Join Tournament
          </button>
        ) : (
          <button 
            className="btn btn-danger"
            onClick={handleLeaveTournament}
          >
            <i className="fas fa-user-minus"></i> Leave Tournament
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="card-body">
          {players.length === 0 ? (
            <p className="text-muted">No players have joined this tournament yet.</p>
          ) : (
            <div className="list-group">
              {players.map((player, index) => (
                <div 
                  key={player.id} 
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <span className="badge bg-primary me-2">#{index + 1}</span>
                    Player ID: {player.player_id}
                    {player.player_id.toString() === currentUserId && (
                      <span className="badge bg-info ms-2">You</span>
                    )}
                  </div>
                  <small className="text-muted">
                    Joined: {new Date(player.created_at).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TournamentPlayers;