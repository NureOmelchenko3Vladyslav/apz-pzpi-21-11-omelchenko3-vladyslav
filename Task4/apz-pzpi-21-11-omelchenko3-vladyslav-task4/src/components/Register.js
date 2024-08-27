import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Register.css';

function Register() {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/get_csrf_token/', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        setCsrfToken(data.csrfToken);
      })
      .catch(error => console.error(t('errorFetchingCsrfToken'), error));
  }, [t]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      setMessage(t('pleaseSelectRole'));
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ username, password, email, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(t('registrationSuccessful'));
        navigate('/login');
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage(t('unexpectedError'));
      console.error(t('errorOccurred'), error);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <div className="language-switcher">
        <button onClick={() => changeLanguage('en')}>EN</button>
        <button onClick={() => changeLanguage('ua')}>UA</button>
      </div>
      <div className="register">
        <h2>{t('register')}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>{t('username')}</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="new-username"
            />
          </div>
          <div>
            <label>{t('password')}</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <div>
            <label>{t('email')}</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="new-email"
            />
          </div>
          <div>
            <label>{t('selectRole')}</label>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">{t('selectRole')}</option>
              <option value="owner">{t('owner')}</option>
              <option value="coach">{t('coach')}</option>
              <option value="client">{t('client')}</option>
            </select>
          </div>
          {message && <p className="message">{message}</p>}
          <button type="submit" className="submit-button">{t('register')}</button>
        </form>
        <button onClick={() => navigate('/login')} className="back-button">{t('goToLogin')}</button>
      </div>
    </div>
  );
}

export default Register;
