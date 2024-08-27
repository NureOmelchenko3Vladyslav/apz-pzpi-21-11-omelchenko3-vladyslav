import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './CoachTrainings.css';

function CoachTrainings() {
  const { t, i18n } = useTranslation();
  const { gymId, zoneId } = useParams();
  const [trainings, setTrainings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/get_csrf_token/', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => setCsrfToken(data.csrfToken))
      .catch(error => console.error(t('connectionError'), error));
  }, [t]);

  useEffect(() => {
    fetch('http://localhost:8000/homepage/', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => {
        if (response.status === 401) {
          navigate('/login');
        } else {
          return response.json();
        }
      })
      .then(data => {
        if (data && data.profile) {
          setProfile(data.profile);
          fetchTrainings();
        } else {
          setMessage(t('errorLoadingUserData'));
        }
      })
      .catch(error => {
        setMessage(error.message);
        console.error(t('errorLoadingUserData'), error);
        navigate('/login');
      });
  }, [navigate, t]);

  const fetchTrainings = () => {
    let url = 'http://localhost:8000/coach_trainings/';

    if (zoneId) {
      url = `http://localhost:8000/zone_trainings/${zoneId}/`;
    } else if (gymId) {
      url = `http://localhost:8000/gym_trainings/${gymId}/`;
    }

    fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-CSRFToken': csrfToken,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setTrainings(data.trainings);
        }
      })
      .catch(error => {
        setMessage(t('fetchDataError'));
        console.error(t('fetchDataError'), error);
      });
  };

  const handleDeleteTraining = async (trainingId) => {
    if (window.confirm(t('deleteTrainingConfirmation'))) {
      try {
        const response = await fetch(`http://localhost:8000/delete_training/${trainingId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include',
        });

        if (response.ok) {
          setTrainings(trainings.filter(training => training.id !== trainingId));
        } else {
          setMessage(t('deleteTrainingError'));
        }
      } catch (error) {
        setMessage(t('deleteTrainingError'));
        console.error(t('deleteTrainingError'), error);
      }
    }
  };

  if (!profile) return <div>{t('loading')}</div>;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <div className="language-switcher">
        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('ua')}>UA</button>
      </div>
      <div className="trainings-container">
        <button className="link-button" onClick={() => navigate('/homepage')}>{t('homepage')}</button>
        <h2>
          {profile.is_owner ? `${t('coachTrainingsTitle')} ${zoneId ? t('inZone') : gymId ? t('inGym') : t('allTrainings')}` : `${t('yourTrainings')} ${zoneId ? t('inZone') : gymId ? t('inGym') : t('inAllGyms')}`}
        </h2>
        {profile.is_owner ? null : (
          <div className="button-group add-training-group">
            <Link to={`/create_training${gymId ? `/gym/${gymId}` : ''}${zoneId ? `/zone/${zoneId}` : ''}`}>
              <button className="add-training-button">{t('addTrainingButton')}</button>
            </Link>
          </div>
        )}
        {message && <p>{message}</p>}
        <ul className="trainings-list">
          {trainings.map(training => (
            <li key={training.id} className="training-item">
              <h3>{training.name}</h3>
              <p>{training.description}</p>
              <p><strong>{t('date')}:</strong> {training.date}</p>
              <p><strong>{t('startTime')}:</strong> {training.time_start}</p>
              <p><strong>{t('endTime')}:</strong> {training.time_end}</p>
              {(zoneId || gymId) && (
                <p><strong>{t('remainingPlaces')}:</strong> {training.remaining_places !== undefined ? training.remaining_places : '—'}</p>
              )}
              <div className="button-group">
                {!profile.is_owner && (
                  <Link to={`/edit_training/${training.id}`}>
                    <button className="edit-training-button">{t('editTrainingButton')}</button>
                  </Link>
                )}
                <button className="delete-training-button" onClick={() => handleDeleteTraining(training.id)}>{t('deleteTraining')}</button>
              </div>
            </li>
          ))}
        </ul>
        <button className="back-button" onClick={() => navigate(-1)}>{t('back')}</button>
      </div>
    </div>
  );
}

export default CoachTrainings;
