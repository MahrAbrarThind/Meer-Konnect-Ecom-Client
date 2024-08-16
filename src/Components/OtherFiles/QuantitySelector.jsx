import React, { useState,useRef } from 'react';
import { toast } from 'react-toastify';

const QuantitySelector = ({ product, onQuantityChange }) => {
    const [quantity, setQuantity] = useState(product.quantity || 1);

    const toastActiveRef = useRef(false);


    const handleQuantityChange = (newQuantity, e) => {
        e.preventDefault();
        if (newQuantity < 1) return;

        if (newQuantity > product.stock) {

            if (!toastActiveRef.current) {
                toastActiveRef.current = true;
                toast.error("No More Stock Available", {
                    onClose: () => {
                        toastActiveRef.current = false;
                    }
                });
            }
            return;
        }

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
