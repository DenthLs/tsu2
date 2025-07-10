import React from 'react';
import CartItem from './CartItem';
import './Cart.css';

const Cart = ({ cart, onClose, onRemove, onUpdateQuantity, total }) => {
    return (
        <div className="cart-overlay">
            <div className="cart">
                <div className="cart-header">
                    <h2>Корзина</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                {cart.length === 0 ? (
                    <p className="empty-cart">Ваша корзина пуста</p>
                ) : (
                    <>
                        <div className="cart-items">
                            {cart.map(item => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onRemove={onRemove}
                                    onUpdateQuantity={onUpdateQuantity}
                                />
                            ))}
                        </div>
                        <div className="cart-total">
                            <p>Итого: <span>{total.toLocaleString()} ₽</span></p>
                            <button className="checkout-button">Оформить заказ</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;