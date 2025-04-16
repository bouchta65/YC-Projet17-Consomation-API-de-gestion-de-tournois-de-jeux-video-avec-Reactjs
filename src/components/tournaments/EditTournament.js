import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tournamentService } from '../../services/api';

function EditTournament() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    rules: '',
    nb_players: '',
    image: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTournamentDetails();
  }, [id]);

  const fetchTournamentDetails = async () => {
    try {
      const response = await tournamentService.getById(id);
      const tournament = response.data.tournoi;
      setFormData({
        name: tournament.name,
        rules: tournament.rules,
        nb_players: tournament.nb_players,
        image: null
      });
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tournament details');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      await tournamentService.update(id, formDataToSend);
      navigate(`/tournaments/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update tournament');
      setSaving(false);
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
      <h2>Edit Tournament</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Tournament Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="rules" className="form-label">Rules</label>
          <textarea
            className="form-control"
            id="rules"
            name="rules"
            value={formData.rules}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="nb_players" className="form-label">Number of Players</label>
          <input
            type="number"
            className="form-control"
            id="nb_players"
            name="nb_players"
            value={formData.nb_players}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label">Tournament Image</label>
          <input
            type="file"
            className="form-control"
            id="image"
            name="image"
            onChange={handleChange}
            accept="image/*"
          />
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(`/tournaments/${id}`)}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTournament;