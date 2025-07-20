import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ cartCount, onCartClick, user, onLoginClick, onLogout }) => {
    return (
        <header className="header">
            <div className="container">
                <nav>
                    <ul className="nav-links">
                        <li><Link to="/">Главная</Link></li>
                        <li><Link to="/panel">Панель</Link></li>
                    </ul>
                </nav>

                <div className="header-actions">
                    {user ? (
                        <>
                            {user.isAdmin && (
                                <Link to="/admin" className="admin-button">
                                    Админ-панель
                                </Link>
                            )}
                            <span className="user-greeting">{user.name}</span>
                            <button className="logout-button" onClick={onLogout}>
                                Выйти
                            </button>
                        </>
                    ) : (
                        <button className="login-button" onClick={onLoginClick}>
                            Войти
                        </button>
                    )}

                    <button className="cart-button" onClick={onCartClick}>
                        Корзина ({cartCount})
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;