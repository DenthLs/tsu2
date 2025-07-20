import React, { useState, useEffect } from 'react';
import {
    fetchAdminProducts,
    createProduct,
    fetchUsers,
    updateUserPermissions,
    fetchOrders,
    onCreateProduct
} from '../api';
import './AdminPanel.css';
import Product from "./Product";
import axios from "axios";
/*import {useNavigate} from "react-router-dom";*/
const AdminPanel = () => {

    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        description: '',
        category: '',
        stock: 0,
        image: null
    });
    const [preview, setPreview] = useState('');
    /*const [newProduct, setNewProduct] = useState({
        name: '',
        price: 0,
        description: '',
        image: '',
        category: '',
        stock: 0
    });*/

    useEffect(() => {
        const loadData = async () => {
            if (activeTab === 'products') {
                const response = await fetchAdminProducts();
                setProducts(response.data);
            } else if (activeTab === 'users') {
                const response = await fetchUsers();
                setUsers(response.data);
            } else if (activeTab === 'orders') {
                const response = await fetchOrders();
                setOrders(response.data);
            }
        };
        loadData();

    }, [activeTab]);

    /*const handleCreateProduct = async () => {
        const product = await createProduct(newProduct);
        setProducts([...products, product]);
        setNewProduct({
            name: '',
            price: 0,
            description: '',
            image: '',
            category: '',
            stock: 0
        });
    };*/



    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('stock', formData.stock);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            // const token = localStorage.getItem('token');
            const response = await onCreateProduct(data)
            setFormData(response.data);
            // setFormData({ name: '', price: 0, description: '', category: '', stock: 0, image: null });
            setPreview('');
        } catch (error) {
            console.error('Ошибка создания товара:', error);
        }
    };

    const handleUpdateUser = async (userId, isAdmin) => {
        await updateUserPermissions(userId, isAdmin);
        setUsers(users.map(user =>
            user._id === userId ? { ...user, isAdmin } : user
        ));
    };

    /*const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreview(URL.createObjectURL(file));
        }
    };*/

    return (
        <div className="admin-panel">
            <div className="admin-tabs">
                <button
                    className={activeTab === 'products' ? 'active' : ''}
                    onClick={() => setActiveTab('products')}
                >
                    Товары
                </button>
                <button
                    className={activeTab === 'users' ? 'active' : ''}
                    onClick={() => setActiveTab('users')}
                >
                    Пользователи
                </button>
                <button
                    className={activeTab === 'orders' ? 'active' : ''}
                    onClick={() => setActiveTab('orders')}
                >
                    Заказы
                </button>
            </div>

            {activeTab === 'products' && (
                <div className="products-section">
                    <h3>Добавить новый товар</h3>

                    <form onSubmit={handleSubmit} className="product-form">
                        <div className="form-group">
                            <label>Название:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Цена:</label>
                            <input
                                type="text"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Изображение:</label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {preview && (
                                <div className="image-preview">
                                    <img src={preview} alt="Предпросмотр" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                                </div>
                            )}
                        </div>

                        <button type="submit">Создать товар</button>
                    </form>

                    {/*<div className="product-form">
                        <input
                            type="text"
                            placeholder="Название"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        />
                        <input
                            type="number"
                            placeholder="Цена"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        />
                        <input
                            type="file"
                            placeholder="Фото"
                            value={newProduct.image}
                            onChange={(e) =>
                                setNewProduct({...newProduct, image: e.target.value})

                        }
                        />
                        <button onClick={handleCreateProduct}>Добавить</button>
                    </div>*/}

                    <h3>Список товаров</h3>
                    <div className="products-list">
                        {Array.isArray(products) && products.length > 0 ? (
                            products.map(product => (
                                <div key={product._id} className="product-item">
                                    <h4>{product.name}</h4>
                                    <p>{product.price} ₽</p>
                                </div>
                            ))
                        ) : (
                            <p>Товары не найдены</p>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="users-section">
                    <h3>Пользователи</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Email</th>
                            <th>Имя</th>
                            <th>Права</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.email}</td>
                                <td>{user.name}</td>
                                <td>{user.isAdmin ? 'Админ' : 'Пользователь'}</td>
                                <td>
                                    <button
                                        onClick={() => handleUpdateUser(user._id, !user.isAdmin)}
                                    >
                                        {user.isAdmin ? 'Убрать админа' : 'Сделать админом'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="orders-section">
                    <h3>Заказы</h3>
                    {orders.map(order => (
                        <div key={order._id} className="order-item">
                            <h4>Заказ #{order._id}</h4>
                            <p>Пользователь: {order.user.name} ({order.user.email})</p>
                            <p>Сумма: {order.total} ₽</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminPanel;