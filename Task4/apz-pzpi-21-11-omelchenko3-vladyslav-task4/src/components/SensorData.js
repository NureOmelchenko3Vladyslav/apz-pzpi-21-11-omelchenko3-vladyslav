import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './SensorData.css';

function SensorData() {
  const { t, i18n } = useTranslation();
  const { zoneId } = useParams();
  const [sensorData, setSensorData] = useState(null);
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
      .catch(error => console.error(t('errorFetchingCsrfToken'), error));
  }, [t]);

  useEffect(() => {
    if (csrfToken) {
      fetch(`http://localhost:8000/display_sensor_data/${zoneId}/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'X-CSRFToken': csrfToken,
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setSensorData(data);
          } else {
            setMessage(data.error || t('failedToFetchSensorData'));
          }
        })
        .catch(error => {
          setMessage(t('failedToFetchSensorData'));
          console.error('Error:', error);
        });
    }
  }, [csrfToken, zoneId, t]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="sensor-data">
      <div className="language-switcher">
        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('ua')}>UA</button>
      </div>
      <button className="link-button" onClick={() => navigate('/homepage')}>{t('homepage')}</button>
      <h2>{t('sensorData')}</h2>
      {message && <p className="error-message">{message}</p>}
      {sensorData ? (
        <div className="sensor-details">
          <p><strong>{t('sensorId')}:</strong> {sensorData.sensor}</p>
          <p><strong>{t('temperature')}:</strong> {sensorData.temperature} °C</p>
          <p><strong>{t('humidity')}:</strong> {sensorData.humidity} %</p>
          <p><strong>{t('noise')}:</strong> {sensorData.noise} dB</p>
        </div>
      ) : (
        <p>{t('loadingSensorData')}</p>
      )}
      <button onClick={() => navigate(-1)} className="back-button">{t('back')}</button>
    </div>
  );
}

export default SensorData;
