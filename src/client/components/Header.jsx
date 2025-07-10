import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import adminPanel from "./AdminPanel";

const Header = ({ cartCount, onCartClick, user, onLoginClick, onLogout }) => {
    return (
        <header className="header">
            <div className="container">
                <h1 className="logo">TechShop</h1>
                <nav>
                    <ul className="nav-links">
                        <li><Link to="/">Главная</Link></li>
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

/*
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ cartCount, onCartClick, user, onLoginClick, onLogout }) => {
    return (
        <header className="header">
            <div className="container">
                <h1 className="logo">TechShop</h1>
                <nav>
                    <ul className="nav-links">
                        <li><Link to="/">Главная</Link></li>
                        <li><Link to="/catalog">Каталог</Link></li>
                        {user?.isAdmin && (
                            <Link to="/admin" className="admin-link">
                                <button className="admin-button">Админ-панель</button>
                            </Link>
                        )}
                    </ul>
                </nav>

                <div className="header-actions">
                    {user ? (
                        <div className="user-section">
                            <span className="user-greeting">Привет, {user.name}</span>
                            {user.isAdmin && (
                                <Link to="/admin" className="admin-link">
                                    <button className="admin-button">Админ-панель</button>
                                </Link>
                            )}
                            <button className="logout-button" onClick={onLogout}>Выйти</button>
                        </div>
                    ) : (
                        <button className="login-button" onClick={onLoginClick}>Войти</button>
                    )}

                    <button className="cart-button" onClick={onCartClick}>
                        Корзина ({cartCount})
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;*/
