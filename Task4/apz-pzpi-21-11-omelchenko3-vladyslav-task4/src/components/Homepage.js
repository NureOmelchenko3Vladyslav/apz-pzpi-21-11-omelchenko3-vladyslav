import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Homepage.css';

function HomePage() {
  const { t, i18n } = useTranslation();
  const [csrfToken, setCsrfToken] = useState('');
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('');
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
          setData(data);
        } else {
          setMessage(t('errorLoadingUserData'));
        }
      })
      .catch(error => {
        setMessage(error.message);
        console.error('Error fetching user data:', error);
        navigate('/login');
      });
  }, [navigate, t]);

  const handleLogout = () => {
    fetch('http://localhost:8000/exit/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
    })
      .then(response => {
        if (response.ok) {
          navigate('/login');
        } else {
          setMessage(t('failedToLogout'));
        }
      })
      .catch(error => {
        setMessage(error.message);
        console.error('Error logging out:', error);
      });
  };

  if (!data) {
    return <div>{t('loadingData')}</div>;
  }

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="homepage">
      <div className="language-switcher">
        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('ua')}>UA</button>
      </div>
      <h1>{t('welcomeToGymManager')}</h1>
      <p>{message}</p>
      <div>
        <p>{t('role')}: {data.profile.is_owner ? t('owner') : data.profile.is_coach ? t('coach') : t('client')}</p>
        <p>{t('username')}: {data.profile.username}</p>
        <p>{t('email')}: {data.profile.email}</p>

        {data.profile.is_owner && (
          <button onClick={() => navigate(`/owner_gyms/${data.profile.id}`)}>
            {t('viewYourGyms')}
          </button>
        )}

        {data.profile.is_coach && (
          <>
            <button onClick={() => navigate(`/coach_gyms/${data.profile.id}`)}>
              {t('viewYourGymsAsCoach')}
            </button>
            <button onClick={() => navigate(`/coach_trainings/${data.profile.id}`)}>
              {t('viewYourTrainingsAsCoach')}
            </button>
          </>
        )}

        {data.profile.is_client && (
          <>
            <button onClick={() => navigate(`/gyms/`)}>
              {t('viewAllGyms')}
            </button>
            <button onClick={() => navigate(`/client_reservations/${data.profile.id}`)}>
              {t('viewYourReservations')}
            </button>
          </>
        )}
      </div>

      <button onClick={handleLogout} className="logout-button">{t('logout')}</button>
    </div>
  );
}

export default HomePage;
