import React, {useState} from 'react';
import CartItem from './CartItem';
import './Cart.css';
import OrderModal from './OrderModal';

const Cart = ({ cart, onClose, onRemove, onUpdateQuantity, total, onCheckout }) => {

    const [showOrderModal, setShowOrderModal] = useState(false);

    const handleCheckout = () => {
        setShowOrderModal(true);
    };

    const handleSubmitOrder = (orderData) => {
        onCheckout({
            ...orderData,
            items: cart,
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        });
        setShowOrderModal(false);
    };

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
                            {/*<button className="checkout-button" onClick={onCheckout}> Оформить заказ  </button>*/}
                            <button className="checkout-button" onClick={handleCheckout}>
                                Оформить заказ
                            </button>

                        {showOrderModal && (
                            <OrderModal
                                onClose={() => setShowOrderModal(false)}
                                onSubmit={handleSubmitOrder}
                            />
                        )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;