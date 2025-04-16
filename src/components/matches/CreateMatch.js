import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchService, tournamentService } from '../../services/api';

function CreateMatch() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tournoi_id: '',
    player_1_id: '',
    player_2_id: '',
    score_player_1: '',
    score_player_2: '',
    match_date: ''
  });
  const [tournaments, setTournaments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await tournamentService.getAll();
      setTournaments(response.data.Tournois || []);
    } catch (err) {
      setError('Failed to fetch tournaments');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await matchService.create(formData);
      navigate('/matches');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create match');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2>Create New Match</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label htmlFor="tournoi_id" className="form-label">Tournament</label>
          <select
            className="form-select"
            id="tournoi_id"
            name="tournoi_id"
            value={formData.tournoi_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Tournament</option>
            {tournaments.map(tournament => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="player_1_id" className="form-label">Player 1</label>
          <input
            type="number"
            className="form-control"
            id="player_1_id"
            name="player_1_id"
            value={formData.player_1_id}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="player_2_id" className="form-label">Player 2</label>
          <input
            type="number"
            className="form-control"
            id="player_2_id"
            name="player_2_id"
            value={formData.player_2_id}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="score_player_1" className="form-label">Score Player 1</label>
          <input
            type="number"
            className="form-control"
            id="score_player_1"
            name="score_player_1"
            value={formData.score_player_1}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="score_player_2" className="form-label">Score Player 2</label>
          <input
            type="number"
            className="form-control"
            id="score_player_2"
            name="score_player_2"
            value={formData.score_player_2}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="match_date" className="form-label">Match Date</label>
          <input
            type="date"
            className="form-control"
            id="match_date"
            name="match_date"
            value={formData.match_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/matches')}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating...
              </>
            ) : 'Create Match'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateMatch;