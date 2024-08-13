import { createContext,useContext, useEffect, useState } from "react";
import axios from "axios";


const authContext=createContext();

const AuthProvider=({children})=>{
    const [auth,setAuth]=useState({
        user:{},
        token:null
    })


    useEffect(() => {
        const getData = async () => {
            try {
                const data =  localStorage.getItem('Token');
                if (data) {
                    setAuth({
                        token: data
                    });
                }
            } catch (error) {
                console.log("error gettin data",error)
            }
        }
        getData();
    }, []);

    useEffect(() => {
        const sendRequest = async () => {
            try {
                const response = await axios.post("https://meer-kennect-ecom-server.vercel.app/api/v1/chekuser", {},
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
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // localStorage.removeItem('lmsUserData');
                }
            }
        }

        if (auth?.token) {
            sendRequest();
        }
    }, [auth?.token]);

    return (
        <authContext.Provider value={{ auth, setAuth}}>
            {children}
        </authContext.Provider>
    );
}



const useAuth=()=>{
    return useContext(authContext);
}

export {useAuth,AuthProvider};