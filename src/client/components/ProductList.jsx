import React from 'react';
import Product from './Product';
import './ProductList.css';

const ProductList = ({ products, onAddToCart }) => {
    return (
        <div className="product-list">
            <h2>Наши товары</h2>
            <div className="products">
                {products.map(product => (
                    <Product key={product.id} product={product} onAddToCart={onAddToCart} />
                ))}
            </div>
        </div>
    );
};

export default ProductList;