import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllOrders } from '../DBFunctions/getOrders';
import { useAuth } from '../../Contexts/auth';
import AdminList from './AdminList';

const AdminOrders = () => {
    const { auth } = useAuth();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        if (auth?.token) {
            (async () => {
                try {
                    const response = await getAllOrders(auth);
                    console.log("it is response",response);
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

    useEffect(()=>{
        console.log("these are filtered order",filteredOrders);
    },[filteredOrders])

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

    const handleCancelOrder = (order) => {
        // Implement cancel order functionality
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
                        <button onClick={filterAllOrders}>All</button>
                        <button onClick={filterDeliveredOrders}>Delivered</button>
                        <button onClick={filterInProgressOrders}>In Progress</button>
                        <button onClick={filterCancelledOrders}>Cancelled</button>
                    </div>
                    <div className="allUserOrders">
                        {filteredOrders?.map((order) => (
                            <div key={order.orderId} className="orderCard">
                                <img src={order?.images[0]?.url} alt="Image" />
                                <p>{order?.title}</p>
                                <p>{order?.description}</p>
                                <div className="orderButtons">
                                    <button onClick={() => handleOrderAgain(order)}>View Details</button>
                                    {order.status === 'InProgress' && (
                                        <>
                                            {/* <button onClick={() => handleCancelOrder(order)}>Cancel Order</button> */}
                                            <button onClick={() => handleTrackOrder(order)}>Provide Tracking</button>
                                        </>
                                    )}
                                    {/* {order.status === 'delivered' && (
                                        <>
                                            <button onClick={() => handleOrderAgain(order)}>Order Again</button>
                                        </>
                                    )} */}
                                    {/* {order.status === 'cancelled' && (
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

export default AdminOrders;
