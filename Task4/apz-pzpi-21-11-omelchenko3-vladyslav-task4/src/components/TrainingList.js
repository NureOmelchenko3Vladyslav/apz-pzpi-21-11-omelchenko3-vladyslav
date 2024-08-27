import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useTranslation } from 'react-i18next';
import './TrainingList.css';

function TrainingList() {
  const { t, i18n } = useTranslation();
  const [trainings, setTrainings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/trainings/')
      .then(response => {
        setTrainings(response.data);
      })
      .catch(error => {
        console.error(t('errorFetchingTrainings'), error);
      });
  }, [t]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <div className="language-switcher">
        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('ua')}>UA</button>
      </div>
      <div className="training-list">
        <button onClick={() => navigate('/homepage')}>{t('homepage')}</button>
        <h2>{t('trainings')}</h2>
        <ul>
          {trainings.map(training => (
            <li key={training.id}>
              <Link to={`/training/${training.id}`}>{training.name}</Link>
            </li>
          ))}
        </ul>
        <button className="back-button" onClick={() => navigate(-1)}>{t('back')}</button>
      </div>
    </div>
  );
}

export default TrainingList;
