import React, { useEffect, useState, useRef } from 'react';
import UserList from './UserList';
import { toast } from 'react-toastify';
import { getAllOrders } from '../DBFunctions/getOrders';
import { useAuth } from '../../Contexts/auth';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';


const UserOrders = () => {
    const { auth } = useAuth();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [cancelling, setCancelling] = useState(false);

    const toastActiveRef = useRef(false);


    useEffect(() => {
        if (auth?.token) {
            (async () => {
                try {
                    const response = await getAllOrders(auth);
                    if (response.error) {
                        throw response.error;
                    } else {
                        setOrders(response.data);
                        setFilteredOrders(response.data);
                    }
                } catch (error) {

                    if (!toastActiveRef.current) {
                        toastActiveRef.current = true;
                        toast.error(error.msg || "Failed to load orders", {
                            onClose: () => {
                                toastActiveRef.current = false;
                            }
                        });
                    }
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
        setActiveFilter('InProgress');
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
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to cancel this order?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, keep it',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setCancelling(true);
                    const response = await axios.delete(`https://meer-kennect-ecom-server.vercel.app/api/v1/order/cancel-order/${id}`, {
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
                setCancelling(false);
            }
        });
    };
    const handleTrackOrder = (order) => {
        // Implement track order functionality
    };

    return (
        <>
            <div className="userOrdersContainer">
                <div className="adminListCommon">
                    <UserList />
                </div>
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
                            className={activeFilter === 'InProgress' ? 'active' : ''}
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
                        {filteredOrders?.map((order) => (
                            <div key={order.orderId} className="orderCard">
                                <div className="ordersImgContainer">
                                    <img src={order?.images[0]?.url} alt={order?.title || "Product Image"} />
                                </div>
                                <div className="ordersCardBody">
                                    <p className='ordersCardTitle'>{order?.title}</p>
                                    <p>Price: {order?.price}</p>
                                    <p>{order?.description}</p>
                                    <div className="orderButtons">
                                        <NavLink to={`/product/${order.productID}`} >Order Again</NavLink>
                                        {order.status === 'InProgress' && (
                                            <>
                                                <button disabled={cancelling} onClick={() => handleCancelOrder(order.orderId)}>Cancel Order</button>
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

export default UserOrders;
