import React, { useState, useEffect } from 'react';
import { useCart } from '../../Contexts/cartContex';
import { useAuth } from '../../Contexts/auth';
import QuantitySelector from './QuantitySelector';
import { NavLink } from 'react-router-dom';

const Cart = () => {
    const { cart, setCart } = useCart();
    const { auth } = useAuth(); // No need for setAuth if not updating auth state here

    const [productTotal, setProductTotal] = useState(0);
    const [shipping, setShipping] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);

    useEffect(() => {
        calculateTotal();
    }, [cart]); // Recalculate total when cart changes

    const calculateTotal = () => {
        let total = 0;
        let ship = 0
        cart.forEach((product) => {
            total += product.price * product.quantity;
            ship += product.shipping;
        });
        setProductTotal(total);
        setShipping(total > 100 ? 0 : ship);
        setTotalPayment(total + shipping);
    };

    const handleQuantityChange = (updatedProduct) => {
        const updatedCart = cart.map(product =>
            product._id === updatedProduct._id ? updatedProduct : product
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const removeItemFromCart = (i) => {
        console.log("it is index ",i);
        const updatedCart = cart?.filter((_, index) => index !== i);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };
    
    

    return (
        <>
            <h1>{`${cart.length === 0 ? "Your Cart Is Empty" : `Your Cart Has ${cart.length} Items ${auth?.token ? "" : "Register To Submit Order"}`}`}</h1>
            {cart?.length > 0 && (
                <div className="cartContainer">
                    <div className="cartProducts">
                        {cart?.map((product,index) => (
                            <div key={product._id} className="cartProduct">
                                <img src={product.images[0].url} alt="Img" />
                                <h2>{product.name}</h2>
                                <h2>{product.description.substring(0, 100)}...</h2>
                                <p>Price: ${product.price}</p>
                                <button onClick={() => removeItemFromCart(index)}>Remove</button>
                                <QuantitySelector
                                    product={product}
                                    onQuantityChange={handleQuantityChange}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="cartPriceTotal">
                        <p>Total: ${productTotal.toFixed(2)}</p>
                        <p>Shipping: ${shipping.toFixed(2)}</p>
                        <p>Grand Total: ${totalPayment.toFixed(2)}</p>
                    </div>
                    {auth?.token &&
                        <div className="cartAddresContainer">
                            <h1>Your Current Address And Phone Is</h1>
                            <p>Address:{auth?.user?.address}</p>
                            <p>Phone:{auth?.user?.phone}</p>
                        <NavLink to={`/account${auth?.user?.isAdmin===1 ? '/admin': ''}`}>Change Address</NavLink>
                        </div>
                    }

                </div>
            )}
        </>
    );
};

export default Cart;
