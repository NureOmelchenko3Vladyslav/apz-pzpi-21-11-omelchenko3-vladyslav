import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import { useTranslation } from 'react-i18next';
import './TrainingDetail.css';

function TrainingDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [training, setTraining] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/trainings/${id}/`)
      .then(response => {
        setTraining(response.data);
      })
      .catch(error => {
        console.error(t('errorFetchingTrainingDetails'), error);
      });
  }, [id, t]);

  if (!training) return <div>{t('loading')}</div>;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <div className="language-switcher">
          <button onClick={() => changeLanguage('en')}>EN</button>
          <button onClick={() => changeLanguage('ua')}>UA</button>
      </div>
      <div className="training-detail">
        <button onClick={() => navigate('/homepage')}>{t('homepage')}</button>
        <h2>{training.name}</h2>
        <p>{training.description}</p>
        <p>{t('startTime')}: {training.time_start}</p>
        <p>{t('endTime')}: {training.time_end}</p>
        <p>{t('totalPlaces')}: {training.total_places}</p>
        <button className="back-button" onClick={() => navigate(-1)}>{t('back')}</button>
      </div>
    </div>
  );
}

export default TrainingDetail;
