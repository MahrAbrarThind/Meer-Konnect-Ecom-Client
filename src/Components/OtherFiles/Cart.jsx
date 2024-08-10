import React, { useState, useEffect } from 'react';
import { useCart } from '../../Contexts/cartContex';
import { useAuth } from '../../Contexts/auth';
import QuantitySelector from './QuantitySelector';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Cart = () => {
    const { cart, setCart } = useCart();
    const { auth } = useAuth();

    const [productTotal, setProductTotal] = useState(0);
    const [shipping, setShipping] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        calculateTotal();
    }, [cart]);

    const calculateTotal = () => {
        let total = 0;
        let ship = 0;
        cart.forEach((product) => {
            total += product.price * product.quantity;
            ship = product.shippingPrice;
        });
        setProductTotal(total);
        const shippingCost = total > 10000 ? 0 : ship;
        setShipping(shippingCost);
        setTotalPayment(total + shippingCost);
    };

    const handleQuantityChange = (updatedProduct) => {
        const updatedCart = cart.map(product =>
            product._id === updatedProduct._id ? updatedProduct : product
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const removeItemFromCart = (i) => {
        if (window.confirm("Are you sure you want to remove this item?")) {
            const updatedCart = cart.filter((_, index) => index !== i);
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            toast.success("Item removed from cart");
        }
    };

    const confirmOrder = async () => {
        if (!auth?.token) {
            toast.error("Please log in to place an order.");
            return;
        }

        setIsProcessing(true);

        const orderData = {
            userMail: auth?.user?.email,
            cart: cart
        };

        try {
            const response = await axios.post('http://localhost:4000/api/v1/order/create-order', orderData, {
                headers: {
                    Authorization: auth?.token
                },
            });
            if (response.data.success) {
                toast.success("Order Created Successfully. You will receive an email or call from MeerKonnect within 24 hours.");
                setCart([]);
                localStorage.removeItem('cart');
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.msg);
            } else {
                toast.error("Sorry, the order could not be completed due to some issue.");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <h1 className='cartMainHeading'>
                Your Cart Has {cart.length} Items{' '}
                {!auth?.token && (
                    <>
                        <NavLink to='/register' className='cartRegisterText'>
                            Please Sign Up
                        </NavLink>
                        {' '}To Confirm Order
                    </>
                )}
            </h1>



            {cart.length > 0 && (
                <div className="cartContainer">
                    <div className="cartProducts">
                        {cart.map((product, index) => (
                            <div key={index} className="cartProduct">
                                <img src={product.images[0].url} alt="Img" />
                                <div className="cartProductDetails">
                                    <h2>{product.title}</h2>
                                    <p> <span>Price</span>:  Rs:{product.price}</p>
                                    <QuantitySelector
                                        product={product}
                                        onQuantityChange={handleQuantityChange}
                                    />
                                    <button className='removeCartItemBtn' onClick={() => removeItemFromCart(index)}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="addressAndTotals">
                        {auth?.token && (
                            <div className="cartAddressContainer">
                                <h1>Your Current Address And Phone Is</h1>
                                <p> <span> Address </span>: {auth?.user?.address}</p>
                                <p> <span> Phone </span>: {auth?.user?.phone}</p>
                                <NavLink to={`/account${auth?.user?.isAdmin === 1 ? '/admin' : ''}`}>Change Address</NavLink>
                            </div>
                        )}
                        <div className="cartPriceTotal">
                            <p> <span> Total </span> :  {productTotal.toFixed(2)} Rs</p>
                            <p> <span> Shipping </span> : {shipping.toFixed(2)} Rs</p>
                            <p> <span> Grand Total </span> : {totalPayment.toFixed(2)} Rs</p>
                            <p> <span>

                                <input
                                    type="radio"
                                    defaultChecked
                                />
                            </span> <span>Cash On Delivery</span></p>

                            {
                                auth?.token ? (
                                    <button onClick={confirmOrder} disabled={!auth?.token || isProcessing}>
                                        {isProcessing ? "Processing..." : "Confirm Order"}
                                    </button>
                                ) : (
                                    <>
                                        <NavLink id='cartRegisterBtn' to={'/register'}>Sign Up</NavLink>
                                        <p id='cartRegisterText' >Please Sign Up To Process Order</p>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Cart;
