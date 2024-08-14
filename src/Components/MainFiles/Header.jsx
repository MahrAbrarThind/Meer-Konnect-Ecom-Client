import React, { useEffect, useState, useRef } from 'react';
import { getAll_subCategories } from '../DBFunctions/getCategories';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../Contexts/auth';
import { FaBars, FaTimes } from "react-icons/fa"; // Import the close icon

const Header = () => {
    const [showDropdown, setShowDropdown] = useState(null);
    const [subCategories, set_subCategories] = useState([]);
    const { auth } = useAuth();
    const toastActiveRef = useRef(false);
    const [toggleMenuBar, setToggleMenuBar] = useState(false);
    const menuRef = useRef(null); // 1. Create a ref for the menu container


    // code for hiding hamburger when someone clicks on screen   
    useEffect(() => {
        // 2. Function to handle clicks outside of the menu
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setToggleMenuBar(false); // Close the menu
            }
        };

        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]); // 3. Effect depends on menuRef




    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const subResponse = await getAll_subCategories();
                if (subResponse.error) {
                    throw new Error("Failed to fetch categories");
                } else {
                    set_subCategories(subResponse.data);
                }
            } catch (error) {
                if (!toastActiveRef.current) {
                    toastActiveRef.current = true;
                    toast.error(error.message, {
                        onClose: () => {
                            toastActiveRef.current = false;
                        }
                    });
                }
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
                        <NavLink to={`/account${auth?.user?.isAdmin === 1 ? '/admin' : ''}`} className="header_icon">
                            <i className="fas fa-user"></i>
                            Account
                        </NavLink>
                    </div>
                ) : (
                    <div className="header_actions">
                        <div className="authLinks">
                            <NavLink to={'/login'} className="header_icon">
                                <i className="fas fa-user"></i>
                                Sign In
                            </NavLink>
                            <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 256 256"><path fill="currentColor" d="M136 24v208a8 8 0 0 1-16 0V24a8 8 0 0 1 16 0"></path></svg>
                            <NavLink to={'/register'} className="header_icon">
                                Sign Up
                            </NavLink>
                        </div>
                    </div>
                )}
                <NavLink to={'/cart'} className="cart_icon">
                    <i className="fas fa-shopping-cart"></i>
                    <span>Cart</span>
                </NavLink>
                <FaBars
                    className='toggleMenuBar'
                    onClick={() => setToggleMenuBar(true)}
                />
            </div>

            <div className="lower_header_part">
                <ul
                    ref={menuRef}
                    className={`${toggleMenuBar ? "toggleMenuActive" : "mainCategories_container"
                        }`}
                >
                    <div className="menuHeader">
                        <FaTimes className="closeMenuIcon" onClick={() => setToggleMenuBar(false)} />
                    </div>
                    {subCategories.map(sub => (
                        <li className='subCatName' key={sub._id}>
                            <NavLink to={`/sub/${sub.name}`}
                                className="subCat_Navlink"
                                onClick={() => setToggleMenuBar(false)} // Close the menu on click  
                            >
                                {sub.name}
                            </NavLink>
                        </li>
                    ))}
                    {auth?.token ? (
                        <div className="header_actions_togglesMenu">
                            <NavLink to={`/account${auth?.user?.isAdmin === 1 ? '/admin' : ''}`}
                                className="header_icon"
                                onClick={() => setToggleMenuBar(false)}
                            >
                                <i className="fas fa-user"></i>
                                Account
                            </NavLink>
                        </div>
                    ) : (
                        <div className="header_actions_togglesMenu">
                            <div className="authLinksToggleMenu">
                                <NavLink to={'/login'} className="header_icon"
                                    onClick={() => setToggleMenuBar(false)}
                                >
                                    Sign In
                                </NavLink>
                                <NavLink to={'/register'} className="header_icon"
                                    onClick={() => setToggleMenuBar(false)}
                                >
                                    Sign Up
                                </NavLink>
                            </div>
                        </div>
                    )}
                </ul>
            </div>
        </header>
    );
};

export default Header;
