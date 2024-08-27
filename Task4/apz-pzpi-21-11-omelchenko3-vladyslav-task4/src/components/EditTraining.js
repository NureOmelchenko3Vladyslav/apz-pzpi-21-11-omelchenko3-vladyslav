import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './EditTraining.css'; // Подключение CSS

function EditTraining() {
  const { t, i18n } = useTranslation();
  const [training, setTraining] = useState(null);
  const [zones, setZones] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');
  const [message, setMessage] = useState('');
  const { trainingId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/get_csrf_token/', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => setCsrfToken(data.csrfToken))
      .catch(error => setMessage(t('errorFetchingCsrfToken')));
  }, [t]);

  useEffect(() => {
    fetch(`http://localhost:8000/edit_training/${trainingId}/`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => {
        if (response.status === 401) {
          navigate('/login');
        } else if (response.ok) {
          return response.json();
        } else {
          throw new Error(t('errorLoadingTrainingData'));
        }
      })
      .then(data => {
        if (data) {
          setTraining(data);
          return fetchZones(data.gym_id);
        }
      })
      .catch(error => setMessage(error.message));
  }, [navigate, trainingId, t]);

  const fetchZones = (gymId) => {
    return fetch(`http://localhost:8000/gym_zones/${gymId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-CSRFToken': csrfToken,
      },
    })
      .then(response => response.json())
      .then(data => setZones(data.zones || []))
      .catch(error => setMessage(t('errorLoadingZones')));
  };

  const handleChange = (e) => {
    setTraining({
      ...training,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const totalPlaces = parseInt(training.total_places, 10);
    const selectedDateTimeStart = new Date(`${training.date}T${training.time_start}`);
    const selectedDateTimeEnd = new Date(`${training.date}T${training.time_end}`);
    const currentDateTime = new Date();

    if (totalPlaces < 1) {
      setMessage(t('placesCannotBeLessThanOne'));
      return;
    }

    if (selectedDateTimeStart < currentDateTime) {
      setMessage(t('startDateInPast'));
      return;
    }

    if (selectedDateTimeEnd <= selectedDateTimeStart) {
      setMessage(t('endTimeBeforeStart'));
      return;
    }

    if (totalPlaces < training.current_reservations) {
      if (!window.confirm(t('confirmPlaceReduction', { totalPlaces, currentReservations: training.current_reservations }))) {
        return;
      }
    }

    fetch(`http://localhost:8000/edit_training/${trainingId}/`, {
      method: 'PUT',
      headers: {
        'X-CSRFToken': csrfToken,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(training),
    })
      .then((response) => {
        if (response.ok) {
          navigate(-1);
        } else {
          return response.json().then(data => {
            setMessage(data.error || t('errorEditingTraining'));
          });
        }
      })
      .catch((error) => setMessage(t('errorEditingTraining')));
  };

  if (!training) return <div>{t('loadingTrainingData')}</div>;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="edit-training">
      <div className="language-switcher">
        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('ua')}>UA</button>
      </div>
      <button className="link-button" onClick={() => navigate('/homepage')}>{t('homepage')}</button>
      <h2>{t('editTraining')}</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t('trainingName')}:</label>
          <input
            type="text"
            name="name"
            value={training.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>{t('description')}:</label>
          <textarea
            name="description"
            value={training.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>{t('date')}:</label>
          <input
            type="date"
            name="date"
            value={training.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>{t('startTime')}:</label>
          <input
            type="time"
            name="time_start"
            value={training.time_start}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>{t('endTime')}:</label>
          <input
            type="time"
            name="time_end"
            value={training.time_end}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>{t('totalPlaces')}:</label>
          <input
            type="number"
            name="total_places"
            value={training.total_places}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>{t('gym')}: </label>{training.gym_name}
        </div>
        <div className="form-group">
          <label>{t('zone')}:</label>
          <select name="zone" value={training.zone} onChange={handleChange} required>
            {zones.map(zone => (
              <option key={zone.id} value={zone.id}>{zone.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="save-button">{t('saveTrainingChanges')}</button>
      </form>
      <button className="back-button" onClick={() => navigate(-1)}>{t('back')}</button>
    </div>
  );
}

export default EditTraining;
