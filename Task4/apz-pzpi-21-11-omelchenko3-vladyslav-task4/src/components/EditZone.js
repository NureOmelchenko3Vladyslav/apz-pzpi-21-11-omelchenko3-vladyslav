import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './EditZone.css';

function EditZone() {
  const { t, i18n } = useTranslation();
  const [zone, setZone] = useState({ name: '', description: '', sensor: '' });
  const [csrfToken, setCsrfToken] = useState('');
  const [message, setMessage] = useState('');
  const { zoneId } = useParams();
  const navigate = useNavigate();

  const fetchCsrfToken = async () => {
    try {
      const response = await fetch('http://localhost:8000/get_csrf_token/', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      setCsrfToken(data.csrfToken);
    } catch (error) {
      console.error(t('errorFetchingCsrfToken'), error);
    }
  };

  const fetchZoneData = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/edit_zone/${zoneId}/`, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.status === 401) {
        navigate('/login');
      } else {
        const data = await response.json();
        if (data) {
          setZone(data);
        } else {
          setMessage(t('errorLoadingZoneData'));
        }
      }
    } catch (error) {
      setMessage(t('errorLoadingZoneData'));
      console.error(t('errorLoadingZoneData'), error);
      navigate('/login');
    }
  }, [zoneId, navigate, t]);

  useEffect(() => {
    fetchCsrfToken();
    fetchZoneData();
  }, [fetchZoneData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'sensor') {
      if (value === '' || /^\d*$/.test(value)) {
        setZone((prevZone) => ({ ...prevZone, [name]: value }));
      }
    } else {
      setZone((prevZone) => ({ ...prevZone, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const zoneData = {
      ...zone,
      sensor: zone.sensor !== '' ? zone.sensor : null,
    };

    try {
      const response = await fetch(`http://localhost:8000/edit_zone/${zoneId}/`, {
        method: 'PUT',
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(zoneData),
      });
      if (response.ok) {
        if (zone && zone.gym) {
          navigate(`/gym_zones/${zone.gym}`);
        } else {
          setMessage(t('errorUndefinedGym'));
        }
      } else if (response.status === 401) {
        navigate('/login');
      } else {
        setMessage(t('errorEditingZone'));
      }
    } catch (error) {
      setMessage(t('errorEditingZone'));
      console.error(t('errorEditingZone'), error);
    }
  };

  if (!zone.name) return <div>{t('loading')}</div>;
  if (message) return <div>{message}</div>;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="edit-zone">
      <div className="language-switcher">
        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('ua')}>UA</button>
      </div>
      <button className="link-button" onClick={() => navigate('/homepage')}>{t('homepage')}</button>
      <h2>{t('editZone')}</h2>
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
          <label>{t('sensorIdOptional')}:</label>
          <input
            type="text"
            name="sensor"
            value={zone.sensor !== null ? zone.sensor : ''}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="save-button">{t('saveChanges')}</button>
      </form>
      <button className="back-button" onClick={() => navigate(-1)}>{t('back')}</button>
    </div>
  );
}

export default EditZone;
