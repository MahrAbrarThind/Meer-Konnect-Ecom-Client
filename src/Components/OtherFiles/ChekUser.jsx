import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Spinner from '../MainFiles/Spinner';
import { useAuth } from '../../Contexts/auth';

const ChekUser = () => {
    const Navigate = useNavigate();
    const { auth, setAuth } = useAuth();
    const [ok, setOk] = useState(false);

    useEffect(() => {

        const sendRequest = async () => {

            try {
                const response = await axios.post("http://localhost:4000/api/v1/chekuser", {},
                    {
                        headers: {
                            Authorization: auth?.token,
                        },
                    });
                if (response.data.success) {
                    setAuth(
                        {
                            ...auth,
                            user: response.data.data,
                        }
                    )
                    setOk(true);
                } else {
                    setOk(false);
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                }
                setOk(false);
            }
        }
        if (auth?.token) {
            sendRequest();
        }
    }, [auth?.token])

    return ok ? <Outlet /> : <Spinner />

}
export default ChekUser
