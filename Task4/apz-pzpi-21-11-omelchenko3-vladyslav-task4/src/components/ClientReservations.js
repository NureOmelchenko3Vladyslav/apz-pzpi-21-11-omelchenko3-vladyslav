import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ClientReservations.css';

function ClientReservations() {
  const { t, i18n } = useTranslation();
  const [trainings, setTrainings] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
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
    fetch('http://localhost:8000/client_reservations/', {
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
        if (data && data.trainings) {
          if (data.trainings.length === 0) {
            setMessage(t('noReservations'));
          }
          setTrainings(data.trainings);
        } else {
          setMessage(t('errorLoadingReservations'));
        }
      })
      .catch(error => {
        setMessage(t('errorLoadingReservations') + ': ' + error.message);
        console.error('Error fetching reservations data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate, t]);

  const handleCancelReservation = async (reservationId) => {
    if (window.confirm(t('cancelReservation'))) {
      try {
        const response = await fetch(`http://localhost:8000/delete_reservation/${reservationId}/`, {
          method: 'DELETE',
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
  
        if (response.ok) {
          setTrainings(trainings.filter(t => t.reservation_id !== reservationId));
          setMessage(t('reservationCancelled'));
        } else {
          setMessage(t('errorCancellingReservation'));
        }
      } catch (error) {
        setMessage(t('errorCancellingReservation'));
        console.error("Error cancelling reservation:", error);
      }
    }
  };

  if (loading) return <div>{t('loading')}</div>;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="client-reservations">
      <div className="language-switcher">
        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('ua')}>UA</button>
      </div>
      <button onClick={() => navigate('/homepage')}>{t('homepage')}</button>
      <h2>{t('clientReservationsTitle')}</h2>
      {message && <p>{message}</p>}
      {trainings.length > 0 ? (
        <ul>
          {trainings.map(training => (
            <li key={training.id}>
              <h3>{training.name}</h3>
              <p>{training.description}</p>
              <p>{t('date')}: {training.date}</p>
              <p>{t('startTime')}: {training.time_start}</p>
              <p>{t('endTime')}: {training.time_end}</p>
              <p>{t('remainingPlaces')}: {training.remaining_places}</p>
              <button onClick={() => handleCancelReservation(training.reservation_id)}>{t('cancelReservation')}</button>
            </li>
          ))}
        </ul>
      ) : null}
      <button className="back-button" onClick={() => navigate(-1)}>{t('back')}</button>
    </div>
  );
}

export default ClientReservations;
