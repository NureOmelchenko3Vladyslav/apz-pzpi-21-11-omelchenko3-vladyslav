import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './EditGym.css';

function EditGym() {
  const { t, i18n } = useTranslation();
  const [gym, setGym] = useState(null);
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

  useEffect(() => {
    fetch(`http://localhost:8000/edit_gym/${gymId}/`, {
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
        if (data) {
          setGym(data);
        } else {
          setMessage(t('errorLoadingGymData'));
        }
      })
      .catch(error => {
        setMessage(t('errorLoadingGymData'));
        console.error('Error fetching gym data:', error);
        navigate('/login');
      });
  }, [navigate, gymId, t]);

  const handleChange = (e) => {
    setGym({
      ...gym,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8000/edit_gym/${gymId}/`, {
      method: 'PUT',
      headers: {
        'X-CSRFToken': csrfToken,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(gym),
    })
      .then(response => {
        if (response.ok) {
          navigate(`/owner_gyms/${gymId}/`);
        } else if (response.status === 401) {
          navigate('/login');
        } else {
          setMessage(t('errorEditingGym'));
        }
      })
      .catch(error => {
        setMessage(t('errorEditingGym'));
        console.error('Error updating gym:', error);
      });
  };

  if (!gym) return <div>{t('loading')}</div>;
  if (message) return <div>{message}</div>;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="edit-gym">
      <div className="language-switcher">
        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('ua')}>UA</button>
      </div>
      <button className="link-button" onClick={() => navigate('/homepage')}>{t('homepage')}</button>
      <h2>{t('editGym')}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t('gymName')}:</label>
          <input
            type="text"
            name="name"
            value={gym.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>{t('address')}:</label>
          <input
            type="text"
            name="address"
            value={gym.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>{t('description')}:</label>
          <textarea
            name="description"
            value={gym.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="save-button">{t('saveChanges')}</button>
      </form>
      <button className="back-button" onClick={() => navigate(-1)}>{t('back')}</button>
    </div>
  );
}

export default EditGym;
