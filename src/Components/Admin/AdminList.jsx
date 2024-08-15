import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from "../../Contexts/auth.js";
import Swal from 'sweetalert2';


const AdminList = () => {
    const { auth, setAuth } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);


    const handleLogout = () => {
        localStorage.removeItem('Token');
        localStorage.removeItem('cart');
        setAuth({
            user: {},
            token: null
        });
    };

    const confirmLogout = () => {
        Swal.fire({
            title: 'Are you sure to Logout?',
            // text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, log out!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                handleLogout();
                Swal.fire(
                    'You have been logged out.',
                    // 'You have been logged out.',
                    // 'success'
                );
            }
        });
    };



    return (
        <>
            <div className='adminListContainer'>
                <h2>Welcome {auth?.user?.name}</h2>

                <NavLink
                    to={'/account/admin'}
                    end
                    className={({ isActive }) => `amdinListNavLink ${isActive ? "adminListActive" : ""}`}
                >
                    Profile
                    <svg className='listArrowIcon' xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m10 17l5-5l-5-5"></path>
                    </svg>
                </NavLink>

                <NavLink
                    to={'/account/admin/sub-category'}
                    className={({ isActive }) => `amdinListNavLink ${isActive ? "adminListActive" : ""}`}
                >
                    Sub Category
                    <svg className='listArrowIcon' xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m10 17l5-5l-5-5"></path>
                    </svg>
                </NavLink>

                <NavLink
                    to={'/account/admin/add-product'}
                    className={({ isActive }) => `amdinListNavLink ${isActive ? "adminListActive" : ""}`}
                >
                    Add Products
                    <svg className='listArrowIcon' xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m10 17l5-5l-5-5"></path>
                    </svg>
                </NavLink>

                <NavLink
                    to={'/account/admin/edit-products'}
                    className={({ isActive }) => `amdinListNavLink ${isActive ? "adminListActive" : ""}`}
                >
                    Edit Products
                    <svg className='listArrowIcon' xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m10 17l5-5l-5-5"></path>
                    </svg>
                </NavLink>

                <NavLink
                    to={'/account/admin/admin-orders'}
                    className={({ isActive }) => `amdinListNavLink ${isActive ? "adminListActive" : ""}`}
                >
                    Orders
                    <svg className='listArrowIcon' xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m10 17l5-5l-5-5"></path>
                    </svg>
                </NavLink>

                <button
                    className='amdinListNavLink'
                    onClick={confirmLogout}>
                    Log Out
                </button>

            </div>
        </>
    )
}

export default AdminList
