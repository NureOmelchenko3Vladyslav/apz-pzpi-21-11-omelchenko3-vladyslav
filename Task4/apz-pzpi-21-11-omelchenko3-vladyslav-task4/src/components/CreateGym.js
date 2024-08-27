import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './CreateGym.css';

function CreateGym() {
  const { t, i18n } = useTranslation();
  const { userId } = useParams();
  const [gym, setGym] = useState({ name: '', address: '', description: '' });
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
      .catch(error => console.error('Error fetching CSRF token:', error));
  }, []);

  const handleChange = (e) => {
    setGym({
      ...gym,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!gym.name || !gym.address) {
      setMessage(t('gymNameAndAddressRequired'));
      return;
    }

    fetch('http://localhost:8000/create_gym/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrfToken,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(gym),
    })
      .then(response => {
        if (response.ok) {
          navigate(`/owner_gyms/${userId}/`);
        } else if (response.status === 401) {
          navigate('/login');
        } else {
          setMessage(t('errorCreatingGym'));
        }
      })
      .catch(error => {
        setMessage(t('errorCreatingGym'));
        console.error('Error creating gym:', error);
      });
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="create-gym">
      <div className="language-switcher">
        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('ua')}>UA</button>
      </div>
      <button className="link-button" onClick={() => navigate('/homepage')}>{t('homepage')}</button>
      <h2>{t('createNewGym')}</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label>{t('gymName')}:</label>
            <input
            type="text"
            name="name"
            value={gym.name}
            onChange={handleChange}
            required
            />
        </div>
        <div className="form-group">
            <label>{t('address')}:</label>
            <input
            type="text"
            name="address"
            value={gym.address}
            onChange={handleChange}
            required
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
        <button type="submit">{t('createGym')}</button>
      </form>
      <button className="back-button" onClick={() => navigate(-1)}>{t('back')}</button>
    </div>
  );
}

export default CreateGym;
