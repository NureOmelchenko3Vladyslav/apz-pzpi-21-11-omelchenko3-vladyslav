import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './CreateZone.css';

function CreateZone() {
  const { t, i18n } = useTranslation();
  const [zone, setZone] = useState({ name: '', description: '', sensor: '' });
  const [csrfToken, setCsrfToken] = useState('');
  const [message, setMessage] = useState('');
  const { gymId } = useParams();
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

  const handleChange = (e) => {
    setZone({
      ...zone,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!zone.name) {
      setMessage(t('zoneNameRequired'));
      return;
    }

    fetch(`http://localhost:8000/create_zone/${gymId}/`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrfToken,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(zone),
    })
      .then(response => {
        if (response.ok) {
          navigate(`/gym_zones/${gymId}`);
        } else if (response.status === 401) {
          navigate('/login');
        } else {
          setMessage(t('errorCreatingZone'));
        }
      })
      .catch(error => {
        setMessage(t('errorCreatingZone'));
        console.error('Error creating zone:', error);
      });
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="create-zone">
      <div className="language-switcher">
        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('ua')}>UA</button>
      </div>
      <button className="link-button" onClick={() => navigate('/homepage')}>{t('homepage')}</button>
      <h2>{t('createZone')}</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t('zoneName')}:</label>
          <input
            type="text"
            name="name"
            value={zone.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>{t('description')}:</label>
          <textarea
            name="description"
            value={zone.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>{t('sensor')}:</label>
          <input
            type="text"
            name="sensor"
            value={zone.sensor}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-button">{t('createZone')}</button>
      </form>
      <button className="back-button" onClick={() => navigate(-1)}>{t('back')}</button>
    </div>
  );
}

export default CreateZone;
