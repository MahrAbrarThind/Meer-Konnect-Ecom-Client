import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../../Contexts/cartContex';
import { useAuth } from '../../Contexts/auth';
import QuantitySelector from './QuantitySelector';
import { getRelatedProducts } from '../DBFunctions/getProducts';
import { NavLink, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

import Swal from 'sweetalert2';

import { AddToCartAlert } from '../DBFunctions/AddToCartAlert';
import { useStateContext } from '../../Contexts/urlStateContext';


const Cart = () => {
    const { cart, setCart } = useCart();
    const { auth } = useAuth();
    const { routeState, setRouteState } = useStateContext();

    const [productTotal, setProductTotal] = useState(0);
    const [shipping, setShipping] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [relatedProductsLoading, setRelatedProductsLoading] = useState(true);

    const handleAddToCart = AddToCartAlert(cart, setCart);
    const toastActiveRef = useRef(false);

    const location = useLocation();


    // getting related products here
    useEffect(() => {
        if (cart && cart.length > 0) {
            setRelatedProductsLoading(true);
            (async () => {
                try {
                    for (let item of cart) {
                        const response = await getRelatedProducts(item.subCategory_id);
                        if (response.error) {
                            throw response.error;
                        } else {
                            setRelatedProducts(response.data);
                            console.log("related products ", response.data);
                        }
                    }
                } catch (error) {
                    if (!toastActiveRef.current) {
                        toastActiveRef.current = true;
                        toast.error(error.message, {
                            onClose: () => {
                                toastActiveRef.current = false;
                            }
                        });
                    }
                } finally {

                    setRelatedProductsLoading(false);
                }
            })();
        }
    }, [cart]);


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
        Swal.fire({
            title: 'Want To Remove Item',
            // text: "You won't  revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedCart = cart.filter((_, index) => index !== i);
                setCart(updatedCart);
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                if (!toastActiveRef.current) {
                    toastActiveRef.current = true;
                    toast.success("Item removed from cart", {
                        onClose: () => {
                            toastActiveRef.current = false;
                        }
                    });
                }
            }
        });
    };




    const confirmOrder = async () => {
        if (!auth?.token) {

            if (!toastActiveRef.current) {
                toastActiveRef.current = true;
                toast.error("Please log in to place an order.", {
                    onClose: () => {
                        toastActiveRef.current = false;
                    }
                });
            }

            return;
        }

        setIsProcessing(true);

        const orderData = {
            userMail: auth?.user?.email,
            cart: cart
        };

        try {
            const response = await axios.post('https://meer-kennect-ecom-server.vercel.app/api/v1/order/create-order', orderData, {
                headers: {
                    Authorization: auth?.token
                },
            });
            if (response.data.success) {
                Swal.fire({
                    title: 'Thank You For Ordering!',
                    text: 'You will receive an Email or Call from MeerKonnect within 24 hours.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    setCart([]);
                    localStorage.removeItem('cart');
                });


            }
        } catch (error) {
            if (error.response) {
                if (!toastActiveRef.current) {
                    toastActiveRef.current = true;
                    toast.error(error.response.data.msg, {
                        onClose: () => {
                            toastActiveRef.current = false;
                        }
                    });
                }
            } else {
                toast.error("Sorry, the order could not be completed due to some issue.");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <div className="cartHeightContainer">
                <h1 className='cartMainHeading'>
                    Your Cart Has {cart.length} Items{' '}
                    {!auth?.token && cart.length > 0 && (
                        <>
                            <NavLink to='/register' className='cartRegisterText' onClick={() => setRouteState(location.pathname)}>
                                Please Sign Up
                            </NavLink>
                            {' '}To Confirm Order
                        </>
                    )}
                </h1>

                {cart.length > 0 && (
                    <div className="wholeCartContainer">

                        {/* showing cart products */}
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

                            {/* here showing address and calculating totals */}
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
                                                <NavLink id='cartRegisterBtn' to={'/register'} onClick={() => setRouteState(location.pathname)}>Sign Up</NavLink>
                                                <p id='cartRegisterText' >Please Sign Up To Process Order</p>
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </div>


                        {/* shwoing related products */}
                        <div className="featuredProductsContainer">
                            <h1>You May Also Like</h1>
                            <div className="featuredProducts">
                                {relatedProducts.map((product, index) => (
                                    <div key={index} className="singleFeaturedProduct">
                                        <NavLink to={`/product/${product?._id}`} className="featuredImgContainer">
                                            <img src={product.images[0].url} alt={product.title} />
                                        </NavLink>
                                        <p className='productTitle'>{product.title.substring(0, 80)}{product.title.length > 80 ? "..." : ""}</p>
                                        <div className="productPrices">
                                            <p>Rs: {product.price}</p>
                                            <p>Rs: {product.comparedPrice}</p>
                                        </div>

                                        <button type='button' onClick={(e) => {
                                            e.preventDefault();
                                            handleAddToCart(product);
                                        }}>
                                            Add to Cart
                                        </button>

                                    </div>
                                ))}
                            </div>
                        </div>


                    </div>
                )}
            </div>
        </>
    );
};

export default Cart;
