import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './CreateTraining.css';

function CreateTraining() {
    const { t, i18n } = useTranslation();
    const [training, setTraining] = useState({
        name: '',
        description: '',
        date: '',
        time_start: '',
        time_end: '',
        total_places: '',
        zone: '',
        gym: '',
        gym_name: '',
        zone_name: '',
    });
    const [zones, setZones] = useState([]);
    const [gyms, setGyms] = useState([]);
    const [csrfToken, setCsrfToken] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { gymId, zoneId } = useParams();

    useEffect(() => {
        fetch('http://localhost:8000/get_csrf_token/', {
            method: 'GET',
            credentials: 'include',
        })
        .then((response) => response.json())
        .then((data) => setCsrfToken(data.csrfToken))
        .catch((error) => console.error('Error fetching CSRF token:', error));

        if (zoneId && gymId) {
            fetch(`http://localhost:8000/gym_zones/${gymId}`, {
                method: 'GET',
                credentials: 'include',
            })
            .then((response) => response.json())
            .then((data) => {
                const selectedZone = data.zones.find((zone) => zone.id === parseInt(zoneId));
                if (selectedZone) {
                    setTraining((prev) => ({
                        ...prev,
                        gym: gymId,
                        zone: zoneId,
                        gym_name: data.gym_name,
                        zone_name: selectedZone.name,
                    }));
                }
            })
            .catch((error) => console.error('Error fetching zones:', error));
        } else if (gymId) {
            fetch(`http://localhost:8000/gym_zones/${gymId}`, {
                method: 'GET',
                credentials: 'include',
            })
            .then((response) => response.json())
            .then((data) => {
                setZones(data.zones);
                setTraining((prev) => ({
                    ...prev,
                    gym: gymId,
                    gym_name: data.gym_name,
                }));
            })
            .catch((error) => console.error('Error fetching zones:', error));
        } else {
            fetch('http://localhost:8000/coach_gyms/', {
                method: 'GET',
                credentials: 'include',
            })
            .then((response) => response.json())
            .then((data) => {
                setGyms(data.gyms);
            })
            .catch((error) => console.error('Error fetching gyms:', error));
        }
    }, [gymId, zoneId]);

    const handleChange = (e) => {
        setTraining({
            ...training,
            [e.target.name]: e.target.value,
        });

        if (e.target.name === 'gym') {
            fetch(`http://localhost:8000/gym_zones/${e.target.value}`, {
                method: 'GET',
                credentials: 'include',
            })
            .then((response) => response.json())
            .then((data) => setZones(data.zones))
            .catch((error) => console.error('Error fetching zones:', error));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const selectedDateTimeStart = new Date(`${training.date}T${training.time_start}`);
        const selectedDateTimeEnd = new Date(`${training.date}T${training.time_end}`);
        const currentDateTime = new Date();

        if (selectedDateTimeStart < currentDateTime) {
            setMessage(t('startDateInPast'));
            return;
        }

        if (selectedDateTimeEnd <= selectedDateTimeStart) {
            setMessage(t('endTimeBeforeStart'));
            return;
        }

        fetch('http://localhost:8000/create_training/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(training),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                navigate(-1);
            } else if (data.error) {
                setMessage(data.error);
            } else {
                setMessage(t('errorCreatingTraining'));
            }
        })
        .catch((error) => {
            setMessage(t('errorCreatingTraining'));
            console.error('Error creating training:', error);
        });
    };

    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng);
    };
  
    return (
      <div className="create-training">
        <div className="language-switcher">
          <button onClick={() => changeLanguage('en')}>EN</button>
          <button onClick={() => changeLanguage('ua')}>UA</button>
        </div>
        <button className="link-button" onClick={() => navigate('/homepage')}>{t('homepage')}</button>
        <h2>{t('addTraining')}</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>{t('trainingName')}:</label>
                <input
                    type="text"
                    name="name"
                    value={training.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>{t('description')}:</label>
                <textarea
                    name="description"
                    value={training.description}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>{t('date')}:</label>
                <input
                    type="date"
                    name="date"
                    value={training.date}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>{t('startTime')}:</label>
                <input
                    type="time"
                    name="time_start"
                    value={training.time_start}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>{t('endTime')}:</label>
                <input
                    type="time"
                    name="time_end"
                    value={training.time_end}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>{t('totalPlaces')}:</label>
                <input
                    type="number"
                    name="total_places"
                    value={training.total_places}
                    onChange={handleChange}
                    required
                />
            </div>
            {zoneId && (
                <>
                    <div className="form-group">
                        <label>{t('gym')}:</label>
                        <span>{training.gym_name}</span>
                    </div>
                    <div className="form-group">
                        <label>{t('zone')}:</label>
                        <span>{training.zone_name}</span>
                    </div>
                </>
            )}
            {!zoneId && gymId && (
                <div className="form-group">
                    <label>{t('gym')}:</label> {training.gym_name}
                    <label>{t('zone')}:</label>
                    <select name="zone" value={training.zone} onChange={handleChange} required>
                        <option value="">{t('selectZone')}</option>
                        {zones.map((zone) => (
                            <option key={zone.id} value={zone.id}>
                                {zone.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {!gymId && !zoneId && (
                <>
                    <div className="form-group">
                        <label>{t('gym')}:</label>
                        <select name="gym" value={training.gym} onChange={handleChange} required>
                            <option value="">{t('selectGym')}</option>
                            {gyms.map((gym) => (
                                <option key={gym.id} value={gym.id}>
                                    {gym.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{t('zone')}:</label>
                        <select name="zone" value={training.zone} onChange={handleChange} required>
                            <option value="">{t('selectZone')}</option>
                            {zones.map((zone) => (
                                <option key={zone.id} value={zone.id}>
                                    {zone.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            )}
            <button type="submit">{t('addTraining')}</button>
        </form>
        <button className="back-button" onClick={() => navigate(-1)}>
            {t('back')}
        </button>
      </div>
    );
}

export default CreateTraining;
