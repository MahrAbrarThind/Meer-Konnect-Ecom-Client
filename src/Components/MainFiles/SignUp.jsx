import { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/auth";

function SignUp() {
    const navigate = useNavigate();
    const {auth,setAuth}=useAuth();

    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
    });

    const handleOnChange = (e) => {
        setError('');
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        const { name, email, password, confirmPassword, phone, address } = formData;

        if (!name || !email || !password || !confirmPassword || !phone || !address) {
            return setError("Fields Cannot be Empty");
        }
        if (password.length < 6) {
            return setError("Password Length Should Be 6 Or More Characters");
        }
        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            const response = await axios.post("http://localhost:4000/api/v1/register", formData);

            if (response.status === 201) {
                toast.success("User Registered Successfully");
                setAuth({
                    user: response.data.data,
                    token: response.data.token
                });
                localStorage.setItem('Token', response.data.token);
            }

        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;

                if (status === 409) {
                    toast.error("User already exists");
                } else if (status === 400) {
                    setError(data.message);
                } else if (status === 500) {
                    toast.error("Internal Server Error");
                } else {
                    toast.error("An Error Occurred ");
                }
            } else {
                toast.error("An Error Occurred");
            }
        }

        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            address: '',
        });
    };

    return (
        <div className="signIn_container">
            <div className="signIn_div">
                <h2>Sign Up</h2>
                <div className="signIn_inputs">
                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleOnChange} />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleOnChange} />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleOnChange} />
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleOnChange} />
                    <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleOnChange} />
                    <input type="text" name="address" placeholder="Complete Address" value={formData.address} onChange={handleOnChange} />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button className="signIn_btn" onClick={handleOnSubmit}>Sign Up</button>

                <div className="signUp_way">
                    <p className="signUpText">Already Registered?</p>
                    <NavLink to={"/login"} className="signUp_btn">Sign In</NavLink>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
