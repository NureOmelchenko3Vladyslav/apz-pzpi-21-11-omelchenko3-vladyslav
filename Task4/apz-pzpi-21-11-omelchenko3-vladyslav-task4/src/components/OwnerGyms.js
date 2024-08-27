import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './OwnerGyms.css';

function OwnerGyms() {
  const { t, i18n } = useTranslation();
  const [gyms, setGyms] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');
  const [message, setMessage] = useState('');
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
    fetch('http://localhost:8000/owner_gyms/', {
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
          setGyms(data.gyms);
        } else {
          setMessage(t('errorLoadingGymData'));
        }
      })
      .catch(error => {
        setMessage(error.message);
        console.error(t('errorFetchingGymData'), error);
        navigate('/login');
      });
  }, [navigate, t]);

  const handleDeleteGym = (gymId) => {
    if (window.confirm(t('confirmDeleteGym'))) {
      fetch(`http://localhost:8000/delete_gym/${gymId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
      })
        .then(response => {
          if (response.ok) {
            setGyms(gyms.filter(gym => gym.id !== gymId));
          } else {
            alert(t('errorDeletingGym'));
          }
        })
        .catch(error => {
          console.error(t('errorDeletingGym'), error);
        });
    }
  };

  if (gyms === null) return <div>{t('loading')}</div>;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="owner-gyms">
      <div className="language-switcher">
        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('ua')}>UA</button>
      </div>
      {gyms.length === 0 ? (
        <div>
          <h2>{t('noGymsYet')}</h2>
          <button className="add-button" onClick={() => navigate('/create_gym')}>{t('addNewGym')}</button>
          <div style={{ marginTop: '20px' }}>
            <button className="back-button" onClick={() => navigate(-1)}>{t('back')}</button>
          </div>
        </div>
      ) : (
        <>
          <button className="link-button" onClick={() => navigate('/homepage')}>{t('homepage')}</button>
          <h2>{t('yourGymsList')}</h2>
          <ul>
            {gyms.map(gym => (
              <li key={gym.id}>
                <h3>{gym.name}</h3>
                <p>{gym.address}</p>
                <p>{gym.description}</p>
                <button className="edit-button" onClick={() => navigate(`/edit_gym/${gym.id}`)}>{t('editGym')}</button>
                <button className="link-button" onClick={() => navigate(`/gym_zones/${gym.id}`)}>{t('viewZones')}</button>
                <button className="link-button" onClick={() => navigate(`/gym_coaches/${gym.id}`)}>{t('viewCoaches')}</button>
                <button className="delete-button" onClick={() => handleDeleteGym(gym.id)}>{t('deleteGym')}</button>
              </li>
            ))}
          </ul>
          <div>
            <button className="add-button" onClick={() => navigate('/create_gym')}>{t('addNewGym')}</button>
          </div>
          <div style={{ marginTop: '10px' }}>
            <button className="back-button" onClick={() => navigate(-1)}>{t('back')}</button>
          </div>
        </>
      )}
    </div>
  );
}

export default OwnerGyms;
