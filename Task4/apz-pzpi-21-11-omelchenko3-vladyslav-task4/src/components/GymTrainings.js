import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './GymTrainings.css';

function GymTrainings() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [trainings, setTrainings] = useState([]);
  const [gymName, setGymName] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const csrfResponse = await fetch('http://localhost:8000/get_csrf_token/', {
          method: 'GET',
          credentials: 'include',
        });

        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.csrfToken;

        const response = await fetch(`http://localhost:8000/gym_trainings/${id}/`, {
          method: 'GET',
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.status === 401) {
          navigate('/login');
        } else if (response.ok) {
          const data = await response.json();
          setGymName(data.gym_name);
          if (data.trainings && data.trainings.length > 0) {
            setTrainings(data.trainings);
          } else {
            setMessage(t('noTrainingsInGym'));
          }
        } else {
          setMessage(t('errorLoadingTrainingData'));
        }
      } catch (error) {
        setMessage(t('errorLoadingTrainingData'));
        console.error(t('errorLoadingTrainingData'), error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, [id, navigate, t]);

  const handleReservation = async (trainingId) => {
    try {
      const csrfResponse = await fetch('http://localhost:8000/get_csrf_token/', {
        method: 'GET',
        credentials: 'include',
      });

      const csrfData = await csrfResponse.json();
      const csrfToken = csrfData.csrfToken;

      const response = await fetch(`http://localhost:8000/create_reservation/${trainingId}/`, {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        setMessage(t('reservationSuccess'));
        setTrainings(trainings.map(t => 
          t.id === trainingId ? { ...t, remaining_places: t.remaining_places - 1, is_reserved: true } : t
        ));
      } else {
        const data = await response.json();
        setMessage(data.error || t('reservationError'));
      }
    } catch (error) {
      setMessage(t('reservationError'));
      console.error(t('reservationError'), error);
    }
  };

  const handleCancelReservation = async (trainingId) => {
    if (window.confirm(t('confirmCancelReservation'))) {
      try {
        const csrfResponse = await fetch('http://localhost:8000/get_csrf_token/', {
          method: 'GET',
          credentials: 'include',
        });

        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.csrfToken;

        const response = await fetch(`http://localhost:8000/delete_reservation/${trainingId}`, {
          method: 'DELETE',
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          setMessage(t('cancelReservationSuccess'));
          setTrainings(trainings.map(t => 
            t.id === trainingId ? { ...t, remaining_places: t.remaining_places + 1, is_reserved: false } : t
          ));
        } else {
          const data = await response.json();
          setMessage(data.error || t('cancelReservationError'));
        }
      } catch (error) {
        setMessage(t('cancelReservationError'));
        console.error(t('cancelReservationError'), error);
      }
    }
  };

  if (loading) return <div>{t('loading')}</div>;

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
        <button className="link-button" onClick={() => navigate('/homepage')}>{t('homepage')}</button>
        <h2>{t('trainingsInGym', { gymName })}</h2>
        {message && <p>{message}</p>}
        {trainings.length > 0 ? (
          <ul>
            {trainings.map(training => (
              <li key={training.id}>
                <h3>{training.name}</h3>
                <p><strong>{t('zone')}:</strong> {training.zone_name}</p>
                <p><strong>{t('description')}:</strong> {training.description}</p>
                <p><strong>{t('coach')}:</strong> {training.coach_name}</p>
                <p><strong>{t('date')}:</strong> {training.date}</p>
                <p><strong>{t('startTime')}:</strong> {training.time_start}</p>
                <p><strong>{t('endTime')}:</strong> {training.time_end}</p>
                <p><strong>{t('totalPlaces')}:</strong> {training.total_places}</p>
                <p><strong>{t('remainingPlaces')}:</strong> {training.remaining_places}</p>
                {training.is_reserved ? (
                  <>
                    <p>{t('youAreReserved')}</p>
                    <button className="cancel-button" onClick={() => handleCancelReservation(training.id)}>{t('cancelReservation')}</button>
                  </>
                ) : (
                  training.remaining_places > 0 ? (
                    <button onClick={() => handleReservation(training.id)}>{t('reserve')}</button>
                  ) : (
                    <p>{t('noPlaces')}</p>
                  )
                )}
              </li>
            ))}
          </ul>
        ) : null}
        <button className="back-button" onClick={() => navigate(-1)}>{t('back')}</button>
      </div>
    </div>
  );
}

export default GymTrainings;
