import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Spinner = () => {

    const [time, setTime] = useState(3);

    // handling routing
    const navigate = useNavigate();
    const location = useLocation();

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
        <div class="loader">
            <span id="one"></span>
            <span id="two"></span>
            <span id="three"></span>
        </div>
    );
};

export default Spinner;
