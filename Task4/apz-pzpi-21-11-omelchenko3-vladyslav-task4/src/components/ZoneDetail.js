import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import { useTranslation } from 'react-i18next';
import './ZoneDetail.css';

function ZoneDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [zone, setZone] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/zones/${id}/`)
      .then(response => {
        setZone(response.data);
      })
      .catch(error => {
        console.error(t('errorFetchingZoneDetails'), error);
        setMessage(t('errorFetchingZoneDetails'));
      });
  }, [id, t]);

  if (!zone) return <div>{message || t('loading')}...</div>;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <div className="language-switcher">
        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('ua')}>UA</button>
      </div>
      <div className="zone-detail">
        <button onClick={() => navigate('/homepage')}>{t('homepage')}</button>
        <h2>{zone.name}</h2>
        <p>{zone.description}</p>
        <button className="back-button" onClick={() => navigate(-1)}>{t('back')}</button>
      </div>
    </div>
  );
}

export default ZoneDetail;
