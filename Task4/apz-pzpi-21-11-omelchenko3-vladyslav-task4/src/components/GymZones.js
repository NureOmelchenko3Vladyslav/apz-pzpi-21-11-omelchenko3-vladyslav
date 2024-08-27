import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './GymZones.css';

function GymZones() {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState(null);
  const { gymId } = useParams();
  const [zones, setZones] = useState([]);
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

  const fetchZones = useCallback(() => {
    fetch(`http://localhost:8000/gym_zones/${gymId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-CSRFToken': csrfToken,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setZones(data.zones);
          if (data.zones.length === 0) {
            setMessage(t('noZonesInGym'));
          }
        }
      })
      .catch(error => {
        setMessage(t('failedToFetchData'));
        console.error(t('errorFetchingData'), error);
      });
  }, [csrfToken, gymId, t]);

  useEffect(() => {
    fetch('http://localhost:8000/homepage/', {
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
        if (data && data.profile) {
          setProfile(data.profile);
          fetchZones();
        } else {
          setMessage(t('errorLoadingUserData'));
        }
      })
      .catch(error => {
        setMessage(error.message);
        console.error(t('errorFetchingUserData'), error);
        navigate('/login');
      });
  }, [navigate, fetchZones, t]);

  const handleDeleteZone = async (zoneId) => {
    if (window.confirm(t('confirmDeleteZone'))) {
      try {
        const response = await fetch(`http://localhost:8000/delete_zone/${zoneId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include',
        });

        if (response.ok) {
          setZones(zones.filter(zone => zone.id !== zoneId));
          if (zones.length === 1) {
            setMessage(t('noZonesInGym'));
          }
        } else {
          setMessage(t('errorDeletingZone'));
        }
      } catch (error) {
        setMessage(t('errorDeletingZone'));
        console.error(t('errorDeletingZone'), error);
      }
    }
  };

  if (!profile) return <div>{t('loadingData')}</div>;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="zones-container">
      <div className="language-switcher">
        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('ua')}>UA</button>
      </div>
      <button className="link-button" onClick={() => navigate('/homepage')}>{t('homepage')}</button>
      <h2>{t('zonesInGym')}</h2>
      {message && <p>{message}</p>}
      {profile.is_owner && (
        <div className="button-group add-zone-group">
          <Link to={`/create_zone/${gymId}`}>
            <button className="add-zone-button">{t('addZone')}</button>
          </Link>
        </div>
      )}
      {zones.length > 0 ? (
        <ul className="zones-list">
          {zones.map(zone => (
            <li key={zone.id} className="zone-item">
              <h3>{zone.name}</h3>
              <p>{zone.description}</p>
              <div>
                <Link to={`/coach_trainings/zone/${zone.id}`}>
                  <button className="view-trainings-button">{t('viewTrainingsInZone')}</button>
                </Link>
              </div>
              {(profile.is_owner || profile.is_coach) && zone.sensor && (
                <div className="sensor-data-button">
                  <Link to={`/zone/${zone.id}/sensor-data`}>
                    <button className="view-sensor-data-button">{t('viewSensorData')}</button>
                  </Link>
                </div>
              )}
              {profile.is_owner && (
                <div className="button-group">
                  <Link to={`/edit_zone/${zone.id}`}>
                    <button className="edit-zone-button">{t('editZone')}</button>
                  </Link>
                  <button className="delete-zone-button" onClick={() => handleDeleteZone(zone.id)}>{t('deleteZone')}</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        !message && <p>{t('noZonesInGym')}</p>
      )}
      <button className="back-button" onClick={() => navigate(-1)}>{t('back')}</button>
    </div>
  );
}

export default GymZones;
