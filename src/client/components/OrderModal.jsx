import { useState } from 'react';
import './OrderModal.css';

const OrderModal = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        comment: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="order-modal">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Оформление заказа</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fullName">ФИО:</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Телефон:</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            pattern="\+?[0-9\s\-\(\)]+"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="comment">Комментарий к заказу:</label>
                        <textarea
                            id="comment"
                            name="comment"
                            value={formData.comment}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="submit-btn">
                            Отправить заказ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderModal;