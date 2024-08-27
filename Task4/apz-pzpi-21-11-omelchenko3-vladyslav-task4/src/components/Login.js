import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Login.css';

function Login() {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/get_csrf_token/', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(t('networkResponseNotOk'));
        }
        return response.json();
      })
      .then(data => {
        setCsrfToken(data.csrfToken);
        localStorage.setItem('csrfToken', data.csrfToken);
      })
      .catch(error => console.error(t('errorFetchingCsrfToken'), error));
  }, [t]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(t('loginSuccessful'));
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/homepage');
      } else {
        setMessage(data.error || t('loginFailed'));
      }
    } catch (error) {
      setMessage(t('fetchFailed'));
      console.error(t('error'), error);
    }
  };

  const handleRegister = () => {
    navigate('/register');
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
      <div className="login">
        <h2>{t('login')}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>{t('username')}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">{t('login')}</button>
        </form>
        {message && <p className="message">{message}</p>}
        <button onClick={handleRegister} className="register-button">{t('register')}</button>
      </div>
    </div>
  );
}

export default Login;
