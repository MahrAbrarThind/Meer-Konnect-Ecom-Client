import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from "../../Contexts/auth.js";

const AdminList = () => {
    const { auth, setAuth } = useAuth();
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
                    to={'/account/admin/main-category'}
                    className={({ isActive }) => `amdinListNavLink ${isActive ? "adminListActive" : ""}`}
                >
                    Main Category
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


            </div>
        </>
    )
}

export default AdminList
