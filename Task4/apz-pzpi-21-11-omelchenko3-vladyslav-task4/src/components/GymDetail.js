import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './GymDetail.css';

function GymDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [gym, setGym] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/gym/${id}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.gym) {
          setGym(data.gym);
        } else {
          setMessage(t('errorLoadingGymData'));
        }
      })
      .catch(error => {
        setMessage(t('errorLoadingGymData') + ': ' + error.message);
        console.error(t('errorLoadingGymData'), error);
      });
  }, [id, t]);

  if (!gym) {
    return <div>{message || t('loadingData')}</div>;
  }

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="gym-detail">
      <div className="language-switcher">
        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('ua')}>UA</button>
      </div>
      <button className="link-button" onClick={() => navigate('/gyms')}>{t('backToAllGyms')}</button>
      <h2>{gym.name}</h2>
      <p>{t('address')}: {gym.address}</p>
      <p>{t('description')}: {gym.description}</p>
      <button className="back-button" onClick={() => navigate(-1)}>{t('back')}</button>
    </div>
  );
}

export default GymDetail;
