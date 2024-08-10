import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllOrders } from '../DBFunctions/getOrders';
import { useAuth } from '../../Contexts/auth';
import AdminList from './AdminList';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const AdminOrders = () => {
    const { auth } = useAuth();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all'); // Track the active filter

    useEffect(() => {
        if (auth?.token) {
            (async () => {
                try {
                    const response = await getAllOrders(auth);
                    console.log("it is response for getting orders", response);
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

    const filterAllOrders = () => {
        setFilteredOrders(orders);
        setActiveFilter('all');
    };

    const filterInProgressOrders = () => {
        const inProgressOrders = orders.filter(order => order.status === 'InProgress');
        setFilteredOrders(inProgressOrders);
        setActiveFilter('inProgress');
    };

    const filterCancelledOrders = () => {
        const cancelledOrders = orders.filter(order => order.status === 'cancelled');
        setFilteredOrders(cancelledOrders);
        setActiveFilter('cancelled');
    };

    const filterDeliveredOrders = () => {
        const deliveredOrders = orders.filter(order => order.status === 'delivered');
        setFilteredOrders(deliveredOrders);
        setActiveFilter('delivered');
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

                const newOrders = orders.map((order) => {
                    if (order.orderId === id) {
                        return { ...order, status: 'cancelled' };
                    }
                    return order;
                });

                setOrders(newOrders);

                const newFilteredOrders = newOrders.filter((order) => {
                    return activeFilter === 'all' || order.status === activeFilter;
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
                <AdminList />
                <div className="userOrdersSide">
                    <h1>My Orders</h1>
                    <div className='ordersNavlinks'>
                        <button
                            onClick={filterAllOrders}
                            className={activeFilter === 'all' ? 'active' : ''}
                        >
                            All
                        </button>
                        <button
                            onClick={filterDeliveredOrders}
                            className={activeFilter === 'delivered' ? 'active' : ''}
                        >
                            Delivered
                        </button>
                        <button
                            onClick={filterInProgressOrders}
                            className={activeFilter === 'inProgress' ? 'active' : ''}
                        >
                            In Progress
                        </button>
                        <button
                            onClick={filterCancelledOrders}
                            className={activeFilter === 'cancelled' ? 'active' : ''}
                        >
                            Cancelled
                        </button>
                    </div>
                    <div className="allUserOrders">
                        {filteredOrders?.map((order, index) => (
                            <div key={order.orderId} className="orderCard">
                                <div className="ordersImgContainer">
                                    <img src={order?.images[0]?.url} alt="Image" />
                                </div>
                                <div className="ordersCardBody">
                                    <p className='ordersCardTitle'>{order?.title}</p>
                                    <p>Price: {order?.price}</p>
                                    <p>{order?.description}</p>
                                    <div className="orderButtons">
                                        <NavLink to={`/product/${order.productID}`} >Order Again</NavLink>
                                        {order.status === 'InProgress' && (
                                            <>
                                                <button onClick={() => handleCancelOrder(order.orderId, index)}>Cancel Order</button>
                                                <button onClick={() => handleTrackOrder(order)}>Track Order</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminOrders;
