import React, { useEffect, useState } from 'react';
import UserList from './UserList';
import { toast } from 'react-toastify';
import { getAllOrders } from '../DBFunctions/getOrders';
import { useAuth } from '../../Contexts/auth';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

const UserOrders = () => {
    const { auth } = useAuth();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        if (auth?.token) {
            (async () => {
                try {
                    const response = await getAllOrders(auth);
                    console.log("it is response", response);
                    if (response.error) {
                        throw response.error;
                    } else {
                        setOrders(response.data);
                        setFilteredOrders(response.data);
                    }
                } catch (error) {
                    toast.error(error.msg);
                }
            })();
        }
    }, [auth]);

    useEffect(() => {
        console.log("these are filtered order", filteredOrders);
    }, [filteredOrders])

    const filterAllOrders = () => {
        setFilteredOrders(orders);
    };

    const filterInProgressOrders = () => {
        const inProgressOrders = orders.filter(order => order.status === 'InProgress');
        setFilteredOrders(inProgressOrders);
    };

    const filterCancelledOrders = () => {
        const cancelledOrders = orders.filter(order => order.status === 'cancelled');
        setFilteredOrders(cancelledOrders);
    };

    const filterDeliveredOrders = () => {
        const deliveredOrders = orders.filter(order => order.status === 'delivered');
        setFilteredOrders(deliveredOrders);
    };

    const handleOrderAgain = (order) => {
        // Implement order again functionality
    };

    const handleCancelOrder = async (id, index) => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/v1/order/cancel-order/${id}`, {
                headers: {
                    Authorization: auth?.token
                },
            });
            if (response.data.success) {
                toast.success("Order Cancelled Successfully");
    
                // Update the orders array
                const newOrders = orders.map((order) => {
                    if (order.orderId === id) {
                        return { ...order, status: 'cancelled' };
                    }
                    return order;
                });
    
                setOrders(newOrders);
    
                // Update the filteredOrders based on the current filter
                const newFilteredOrders = newOrders.filter((order) => {
                    // if (filteredOrders.length === orders.length) {
                    //     return true; 
                    // }
                    return order.status === 'InProgress'; 
                });
    
                setFilteredOrders(newFilteredOrders);
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.msg);
            } else {
                toast.error("Server Error");
            }
        }
    };
    


    const handleTrackOrder = (order) => {
        // Implement track order functionality
    };

    return (
        <>
            <div className="userOrdersContainer">
                <UserList />
                <div className="userOrdersSide">
                    <h1>My Orders</h1>
                    <div className='ordersNavlinks'>
                        <button onClick={filterAllOrders}>All</button>
                        <button onClick={filterDeliveredOrders}>Delivered</button>
                        <button onClick={filterInProgressOrders}>In Progress</button>
                        <button onClick={filterCancelledOrders}>Cancelled</button>
                    </div>
                    <div className="allUserOrders">
                        {filteredOrders?.map((order, index) => (
                            <div key={order.orderId} className="orderCard">
                                <img src={order?.images[0]?.url} alt="Image" />
                                <p>{order?.title}</p>
                                <p>{order?.description}</p>
                                <div className="orderButtons">
                                    <NavLink to={`/product/${order.productID}`} >Order Again</NavLink>
                                    {order.status === 'InProgress' && (
                                        <>
                                            <button onClick={() => handleCancelOrder(order.orderId, index)}>Cancel Order</button>
                                            <button onClick={() => handleTrackOrder(order)}>Track Order</button>
                                        </>
                                    )}
                                    {/* {order.status === 'delivered' && (
                                        <>
                                            <button onClick={() => handleOrderAgain(order)}>Order Again</button>
                                        </>
                                    )}
                                    {order.status === 'cancelled' && (
                                        <>
                                            <button onClick={() => handleOrderAgain(order)}>Order Again</button>
                                        </>
                                    )} */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserOrders;
