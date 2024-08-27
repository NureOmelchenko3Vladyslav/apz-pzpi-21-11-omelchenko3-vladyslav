import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './GymList.css';

function GymList() {
  const { t, i18n } = useTranslation();
  const [gyms, setGyms] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/gyms/', {
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
            setMessage(t('noGymsAvailable'));
          } else {
            setGyms(data.gyms);
          }
        } else {
          setMessage(t('errorLoadingGymData'));
        }
      })
      .catch(error => {
        setMessage(`${t('errorLoadingGymData')}: ${error.message}`);
        console.error('Error fetching gym data:', error);
        navigate('/login');
      });
  }, [navigate, t]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="gym-list">
      <div className="language-switcher">
        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('ua')}>UA</button>
      </div>
      <button className="link-button" onClick={() => navigate('/homepage')}>{t('homepage')}</button>
      <h2>{t('allGymsList')}</h2>
      {message && <p>{message}</p>}
      {gyms.length > 0 ? (
        <ul>
          {gyms.map(gym => (
            <li key={gym.id} className="gym-item">
              <h3>{gym.name}</h3>
              <p>{gym.address}</p>
              <p>{gym.description}</p>
              <div>
                <Link to={`/gym_trainings/${gym.id}`}>
                  <button className="view-trainings-button">{t('viewGymTrainings')}</button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>{t('noGymsAvailable')}</p>
      )}
      <button className="back-button" onClick={() => navigate(-1)}>{t('back')}</button>
    </div>
  );
}

export default GymList;
