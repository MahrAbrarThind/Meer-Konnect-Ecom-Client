import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../Contexts/auth';


const UserList = () => {
    const {auth}=useAuth();
    return (
        <>
            <div className='adminListContainer'>
                <h2>Welcome {auth?.user?.name}</h2>
                <NavLink className={({isActive})=> (isActive ? "adminListActive":"" )} to={'/account'} > Profile
                    <svg className='listArrowIcon' xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m10 17l5-5l-5-5"></path></svg>
                </NavLink>

                <NavLink className={({isActive})=> (isActive ? "adminListActive":"" )} to={'/account/orders'} > Your Orders 
                    <svg className='listArrowIcon' xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m10 17l5-5l-5-5"></path></svg>

                </NavLink>

                <NavLink className={({isActive})=> (isActive ? "adminListActive":"" )} to={'/account/help'} > Contact and Help
                    <svg className='listArrowIcon' xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m10 17l5-5l-5-5"></path></svg>

                </NavLink>

            </div>
        </>
    )
}

export default UserList;
