import React from 'react';
import './Product.css';

const Product = ({ product, onAddToCart }) => {
    return (
        <div className="product">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">{product.price.toLocaleString()} ₽</p>
            <button onClick={() => onAddToCart(product)}>Добавить в корзину</button>
        </div>
    );
};

export default Product;