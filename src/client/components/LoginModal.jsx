import { useState } from 'react';
import { login, register } from '../api';
import './LoginModal.css';

const LoginModal = ({ onClose, onLogin }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            let response;
            if (isLoginMode) {
                response = await login({
                    email: formData.email,
                    password: formData.password
                });
            } else {
                response = await register({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name
                });
            }

            onLogin({
                token: response.data.token,
                isAdmin: response.data.user.isAdmin,
                ...response.data.user
            });

        } catch (err) {
            setError(err.response?.data?.message || 'Произошла ошибка');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-button" onClick={onClose}>×</button>

                <h2>{isLoginMode ? 'Вход' : 'Регистрация'}</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Пароль:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                        />
                    </div>

                    {!isLoginMode && (
                        <div className="form-group">
                            <label>Имя:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    <button type="submit" className="submit-button">
                        {isLoginMode ? 'Войти' : 'Зарегистрироваться'}
                    </button>
                </form>

                <div className="mode-switch">
                    {isLoginMode ? (
                        <p>
                            Нет аккаунта?{' '}
                            <button onClick={() => setIsLoginMode(false)}>Зарегистрироваться</button>
                        </p>
                    ) : (
                        <p>
                            Уже есть аккаунт?{' '}
                            <button onClick={() => setIsLoginMode(true)}>Войти</button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginModal;