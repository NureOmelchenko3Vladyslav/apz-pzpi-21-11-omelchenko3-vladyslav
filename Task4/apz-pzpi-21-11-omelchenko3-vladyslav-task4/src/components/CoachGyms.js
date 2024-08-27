import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './CoachGyms.css';

function CoachGyms() {
  const { t, i18n } = useTranslation();
  const [gyms, setGyms] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/get_csrf_token/', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => setCsrfToken(data.csrfToken))
      .catch(error => console.error('Error fetching CSRF token:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/coach_gyms/', {
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
        if (data && data.gyms) {
          if (data.gyms.length === 0) {
            setMessage(t('noGymsMessage'));
          } else {
            setGyms(data.gyms);
          }
        } else {
          setMessage(t('errorLoadingGyms'));
        }
      })
      .catch(error => {
        setMessage(t('errorLoadingGyms') + ': ' + error.message);
        console.error('Error fetching gym data:', error);
        navigate('/login');
      });
  }, [navigate, t]);

  const handleDeleteGym = async (gymId, coachId) => {
    if (window.confirm(t('resignConfirmation'))) {
        try {
            const response = await fetch(`http://localhost:8000/delete_gym_coach/${gymId}/${coachId}/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                setGyms(gyms.filter(gym => gym.id !== gymId));
                if (gyms.length === 1) { 
                    setMessage(t('noGymsLeftMessage'));
                }
            } else {
                setMessage(t('resignError'));
            }
        } catch (error) {
            setMessage(t('resignError'));
            console.error('Error:', error);
        }
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="coach-gyms">
      <div className="language-switcher">
        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('ua')}>UA</button>
      </div>
      <button className="link-button" onClick={() => navigate('/homepage')}>{t('homepage')}</button>
      <h2>{t('coachGymsTitle')}</h2>
      {message && <p>{message}</p>}
      {gyms.length > 0 ? (
        <ul>
          {gyms.map(gym => (
            <li key={gym.id}>
              <h3>{gym.name}</h3>
              <p>{gym.address}</p>
              <p>{gym.description}</p>
              <div>
                <Link to={`/coach_trainings/gym/${gym.id}`}>
                  <button className="link-button">{t('viewGymTrainings')}</button>
                </Link>
              </div>
              <div>
                <Link to={`/gym_zones/${gym.id}/`}>
                  <button className="link-button">{t('viewGymZones')}</button>
                </Link>
              </div>
              <div>
                <button className="delete-button" onClick={() => handleDeleteGym(gym.id, gym.coach_id)}>{t('resign')}</button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
      <button className="back-button" onClick={() => navigate(-1)}>{t('back')}</button>
    </div>
  );
}

export default CoachGyms;
