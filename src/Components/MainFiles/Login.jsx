import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";


import { toast } from 'react-toastify';
import { useAuth } from "../../Contexts/auth";
import { useStateContext } from "../../Contexts/urlStateContext";



function Login() {

    const { auth, setAuth } = useAuth();
    const {routeState,setRouteState}=useStateContext();
    const [error, setError] = useState();

    const toastActiveRef = useRef(false);


    //handling proper routing
    const navigate = useNavigate();
    const location = useLocation();





    const [formData, setFormData] = useState(
        {
            email: "",
            password: ""
        }
    );

    const handleOnChange = (e) => {
        setError("")
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        })
    }
    const handleOnSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            return setError("Fields Cannot Be Empty")
        }

        try {
            const response = await axios.post("https://meer-kennect-ecom-server.vercel.app/api/v1/login", formData);

            if (response.data.success) {


                if (!toastActiveRef.current) {
                    toastActiveRef.current = true;
                    toast.success("Signed in successfully", {
                        onClose: () => {
                            toastActiveRef.current = false;
                        }
                    });
                }
                setAuth({
                    user: response.data.data,
                    token: response.data.token
                });
                localStorage.setItem('Token', response.data.token);

                const route = routeState || "/";
                setRouteState(null);
                navigate(route);

            } else {
                setError("Invalid email or password");
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401 || error.response.status === 404) {
                    setError("Invalid email or password");
                } else {
                    setError("An error occurred");
                }
            } else {
                setError("An error occurred");
            }
        }


        setFormData({
            email: "",
            password: ""
        });

    }

    return (
        <main className="signIn_container">
            <div className="signIn_div">
                <h2>Welcome Back!</h2>
                <div className="signIn_inputs">
                    <input type="text" placeholder=" email     ای میل" name="email" value={formData.email} onChange={handleOnChange} required />
                    <input type="password" placeholder=" Password" name="password" value={formData.password} onChange={handleOnChange} required />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button className="signIn_btn" onClick={handleOnSubmit}>Sign In</button>
                <div className="signUp_way">
                    <p className="signUpText">Don't Have An Account?</p>
                    <NavLink to={"/register"} className="signUp_btn">Sign Up</NavLink>
                </div>
            </div>
        </main>
    );
}

export default Login;
