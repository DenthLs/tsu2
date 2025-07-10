import { useState, useEffect } from 'react';
import { fetchProducts, createOrder } from './client/api';
import Header from './client/components/Header';
import ProductList from './client/components/ProductList';
import Cart from './client/components/Cart';
import LoginModal from './client/components/LoginModal';
import AdminPanel from './client/components/AdminPanel';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

function App() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [user, setUser] = useState(null);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await fetchProducts();
                setProducts(response.data);
            } catch (err) {
                console.error('Failed to load products:', err);
            }
        };

        loadProducts();

        // Проверить наличие токена в localStorage
        const token = localStorage.getItem('token');
        if (token) {
            // Здесь можно добавить запрос для проверки токена
            // и загрузки данных пользователя
        }
    }, []);

    const handleCheckout = async () => {
        if (!user) {
            setIsLoginOpen(true);
            return;
        }

        try {
            const orderData = {
                items: cart.map(item => ({
                    product: item.id,
                    quantity: item.quantity
                })),
                shippingAddress: '123 Main St', // В реальном приложении это будет форма
                paymentMethod: 'credit-card'
            };

            await createOrder(orderData, user.token);
            setCart([]);
            alert('Order placed successfully!');
            setIsCartOpen(false);
        } catch (err) {
            console.error('Order failed:', err);
            alert('Failed to place order');
        }
    };

    return (
        <Router>
        <div className="app">
            <Header
                cartCount={cart.reduce((count, item) => count + item.quantity, 0)}
                onCartClick={() => setIsCartOpen(true)}
                user={user}
                onLoginClick={() => setIsLoginOpen(true)}
                onLogout={() => {
                    localStorage.removeItem('token');
                    setUser(null);
                }}
            />

            <Routes>
                {/* Основной маршрут */}
                <Route path="/" element={
                    <main>
                        <ProductList products={products} onAddToCart={addToCart} />
                    </main>
                } />

                {/* Защищённый админский маршрут */}
                <Route
                    path="/admin"
                    element={
                        user?.isAdmin ? (
                            <AdminPanel />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
            </Routes>

            {isCartOpen && (
                <Cart
                    cart={cart}
                    onClose={() => setIsCartOpen(false)}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                    total={cartTotal}
                    onCheckout={handleCheckout}
                />
            )}

            {isLoginOpen && (
                <LoginModal
                    onClose={() => setIsLoginOpen(false)}
                    onLogin={(userData) => {
                        setUser(userData);
                        localStorage.setItem('token', userData.token);
                        localStorage.setItem('user', JSON.stringify(userData));
                        setIsLoginOpen(false);
                    }}
                />
            )}
        </div>
            </Router>
    );
}

export default App;