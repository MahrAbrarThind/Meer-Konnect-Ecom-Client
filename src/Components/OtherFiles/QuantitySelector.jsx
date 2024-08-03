import React, { useState } from 'react';

const QuantitySelector = ({ product, onQuantityChange }) => {
    const [quantity, setQuantity] = useState(product.quantity || 1);

    const handleQuantityChange = (newQuantity, e) => {
        e.preventDefault();
        if (newQuantity < 1) return;
        setQuantity(newQuantity);
        const updatedProduct = { ...product, quantity: newQuantity };
        onQuantityChange(updatedProduct);
    };

    return (
        <div className="quantity-selector">
            <button type="button" onClick={(e) => handleQuantityChange(quantity - 1, e)}>-</button>
            <span>{quantity}</span>
            <button type="button" onClick={(e) => handleQuantityChange(quantity + 1, e)}>+</button>
        </div>
    );
};

export default QuantitySelector;
