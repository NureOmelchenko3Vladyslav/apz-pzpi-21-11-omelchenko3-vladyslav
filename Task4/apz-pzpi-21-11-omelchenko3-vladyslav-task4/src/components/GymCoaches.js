import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './GymCoaches.css';

function GymCoaches() {
  const { t, i18n } = useTranslation();
  const [coaches, setCoaches] = useState([]);
  const [message, setMessage] = useState('');
  const { gymId } = useParams();
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/get_csrf_token/', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => setCsrfToken(data.csrfToken))
      .catch(error => console.error(t('errorFetchingCsrfToken'), error));
  }, [t]);

  useEffect(() => {
    fetch(`http://localhost:8000/gym_coaches/${gymId}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        return response.json();
      })
      .then(data => {
        if (data && data.coaches) {
          setCoaches(data.coaches);
          if (data.coaches.length === 0) {
            setMessage(t('noCoachesMessage'));
          }
        } else {
          setMessage(t('errorLoadingCoaches'));
        }
      })
      .catch(error => {
        setMessage(t('errorLoadingCoaches') + ': ' + error.message);
        console.error(t('errorLoadingCoaches'), error);
        navigate('/login');
      });
  }, [navigate, gymId, t]);

  const handleAddCoach = () => {
    navigate(`/add_gym_coach/${gymId}`);
  };

  const handleDeleteCoach = async (coachId) => {
    if (window.confirm(t('confirmDeleteCoach'))) {
      try {
        const response = await fetch(`http://localhost:8000/delete_gym_coach/${gymId}/${coachId}/`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setCoaches(coaches.filter(coach => coach.user_id !== coachId));
          if (coaches.length === 1) {
            setMessage(t('noCoachesMessage'));
          }
        } else {
          setMessage(t('errorDeletingCoach'));
        }
      } catch (error) {
        setMessage(t('errorDeletingCoach') + ': ' + error.message);
        console.error(t('errorDeletingCoach'), error);
      }
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="gym-coaches">
      <div className="language-switcher">
        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('ua')}>UA</button>
      </div>
      <button className="link-button" onClick={() => navigate('/homepage')}>{t('homepage')}</button>
      <h2>{t('gymCoachesTitle')}</h2>
      <button className="add-button" onClick={handleAddCoach}>{t('addCoach')}</button>
      {message && <p>{message}</p>}
      <ul>
        {coaches.map(coach => (
          <li key={coach.user_id}>
            <h3>{coach.username}</h3>
            <p>{t('userEmail')}: {coach.email}</p>
            <button className="delete-button" onClick={() => handleDeleteCoach(coach.user_id)}>{t('deleteCoach')}</button>
          </li>
        ))}
      </ul>
      <button className="back-button" onClick={() => navigate(-1)}>{t('back')}</button>
    </div>
  );
}

export default GymCoaches;
