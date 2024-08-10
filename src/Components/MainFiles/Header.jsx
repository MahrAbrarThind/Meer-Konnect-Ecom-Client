import React, { useEffect, useState } from 'react';
import { getAll_mainCategories, getAll_subCategories } from '../DBFunctions/getCategories';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../Contexts/auth';



const Header = () => {
    const [showDropdown, setShowDropdown] = useState(null);
    const [mainCategories, set_mainCategories] = useState([]);
    const [subCategories, set_subCategories] = useState([]);
    const { auth, setAuth } = useAuth();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const [mainResponse, subResponse] = await Promise.all([getAll_mainCategories(), getAll_subCategories()]);
                if (mainResponse.error || subResponse.error) {
                    throw new Error("Failed to fetch categories");
                } else {
                    set_mainCategories(mainResponse.data);
                    set_subCategories(subResponse.data);
                }
            } catch (error) {
                toast.error("Internal Server Error: " + error.message);
            }
        };
        fetchCategories();
    }, []);


    const handleMouseEnter = (categoryId) => {
        setShowDropdown(categoryId);
    };

    const handleMouseLeave = () => {
        setShowDropdown(null);
    };

    return (
        <header className='headerContainer'>
            <p className="headerTop">Enjoy Free Shipping Over Order Of 10,000</p>
            <div className="upper_header_part">
                <NavLink to={'/'} className="logo">
                    <img src="mk2.png" alt="Your Logo" />
                </NavLink>
                <div className="header_search">
                    <input type="text" placeholder="Search" />
                    <i className="fas fa-search"></i>
                </div>

                {auth?.token ? (
                    <div className="header_actions">
                        <NavLink to={`/account${auth?.user?.isAdmin===1 ? '/admin': ''}`} className="header_icon">
                            <i className="fas fa-user"></i>
                            Account
                        </NavLink>

                        <NavLink to={'/cart'} className="header_icon">
                            <i className="fas fa-shopping-cart"></i>
                            <span>Cart</span>
                        </NavLink>
                    </div>
                ) : (
                    <div className="header_actions">
                        <div className="authLinks">
                            <NavLink to={'/login'} className="header_icon">
                                <i className="fas fa-user"></i>
                                Sign In
                            </NavLink>
                            {/* <span>|</span> */}
                            <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 256 256"><path fill="currentColor" d="M136 24v208a8 8 0 0 1-16 0V24a8 8 0 0 1 16 0"></path></svg>

                            <NavLink to={'/register'} className="header_icon">
                                Sign Up
                            </NavLink>
                        </div>
                        <NavLink to={'/cart'} className="header_icon">
                            <i className="fas fa-shopping-cart"></i>
                            <span>Cart</span>
                        </NavLink>
                    </div>
                )}
            </div>
            <div className="lower_header_part">
                <ul className="mainCategories_container">
                    {mainCategories.map(category => (
                        <li
                            key={category._id}
                            onMouseEnter={() => handleMouseEnter(category._id)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <NavLink to={`/main/${category.name}`} className="mainCat_Navlink">{category.name}</NavLink>
                            {showDropdown === category._id && (
                                <ul className="dropdown">
                                    {subCategories
                                        .filter(sub => sub.mainCategory_id === category._id)
                                        .map(sub1 => (
                                            <li key={sub1._id}>
                                                <NavLink to={`/sub/${sub1.name}`} className="subCat_Navlink">
                                                    {sub1.name}
                                                </NavLink>
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </header >
    );
};

export default Header;
