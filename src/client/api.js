import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});
export const fetchProducts = () => axios.get(`${API_URL}/products`);
export const fetchProductById = (id) => axios.get(`${API_URL}/products/${id}`);
export const createOrder = (orderData, token) => axios.post(`${API_URL}/orders`, orderData, token);

export const register = (userData) => axios.post(`${API_URL}/auth/register`, userData);
export const login = (userData) => axios.post(`${API_URL}/auth/login`, userData);
export const fetchMyOrders = (token) => axios.get(`${API_URL}/orders/my-orders`, {
    headers: { 'x-auth-token': token }
});

export const verifyToken = async (token) => {
    try {
        const response = await axios.get('/api/auth/verify', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data.valid;
    } catch (error) {
        return false;
    }
};


/*export const checkAdminAccess = (token) => axios.get(`${API_URL}/admin/check-access`, {
    headers: { 'x-auth-token': token }
});*/

export const fetchAdminProducts = () => axios.get(`${API_URL}/admin/products`);
export const createProduct = (productData) => axios.post(`${API_URL}/admin/product`, productData);
export const fetchUsers = () => axios.get(`${API_URL}/admin/users`);
export const updateUserPermissions = (userId, isAdmin) =>
    axios.put(`${API_URL}/admin/users/${userId}/permissions`, {isAdmin});
export const fetchOrders = () => axios.get(`${API_URL}/admin/orders`);

export const onCreateProduct = (data) => axios.post(`${API_URL}/admin/product`, data);
