import React, { useState, useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';

const Spinner = () => {

    const [time, setTime] = useState(2);

    // handling routing
    const navigate = useNavigate();
    const location=useLocation();

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prevTime) => prevTime - 1);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (time === 0) {
                navigate('/login');
        }
    }, [time, navigate]);

    return (
        <div style={{ marginTop: '250px' }}>
            <div className="">
                <h1 className="">Redirecting in {time} Seconds</h1>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    );
};

export default Spinner;
