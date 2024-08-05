import React from 'react'
import { Route, Routes } from 'react-router-dom';
import { useAuth } from './Contexts/auth.js';
import { Navigate } from 'react-router-dom';


//importing Main Files

import Header from './Components/MainFiles/Header.jsx';
import Login from './Components/MainFiles/Login.jsx';
import SignUp from './Components/MainFiles/SignUp.jsx';
import Home from './Components/MainFiles/Home.jsx';




// importing other files
import Main_Cat_Click from './Components/OtherFiles/Main_Cat_Click.jsx';
import Sub_Cat_Click from './Components/OtherFiles/Sub_Cat_Click.jsx';
import Cart from './Components/OtherFiles/Cart.jsx';
import ProductDetails from './Components/OtherFiles/ProductDetails.jsx';



// importing user pages

import UserAccount from './Components/User/UserAccount.jsx';
import ChekUser from './Components/OtherFiles/ChekUser.js';
import UserOrders from './Components/User/UserOrders.jsx';



// importing admin pages 

import AdminAccount from './Components/Admin/AdminAccount.jsx';
import MainCategory from './Components/Admin/MainCategory.jsx';
import SubCategory from './Components/Admin/SubCategory.jsx'
import AddProduct from './Components/Admin/AddProduct.jsx';
import EditProducts from './Components/Admin/EditProducts.jsx';
import UpdateProduct from './Components/Admin/UpdateProduct.jsx';
import ChekAdmin from './Components/OtherFiles/ChekAdmin.js';
import AdminOrders from './Components/Admin/AdminOrders.jsx';

const App = () => {

  const { auth, setAuth } = useAuth();
  return (
    <>

      <Header />
      <Routes>

        {/* authentication routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<SignUp />} />




        {/* Account routes */}

        <Route path='/account' element={<ChekUser />} >

          <Route path='admin' element={<ChekAdmin />} >
            <Route index element={<AdminAccount />} />
            <Route path='main-category' element={<MainCategory />} />
            <Route path='sub-category' element={<SubCategory />} />
            <Route path='add-product' element={<AddProduct />} />
            <Route path='edit-products' element={<EditProducts />} />
            <Route path='edit-products/update/:id' element={<UpdateProduct />} />
            <Route path='admin-orders' element={<AdminOrders/>}/>

          </Route>

          <Route index element={<UserAccount />} />
          <Route path='/account/orders' element={<UserOrders />} />


        </Route>



        <Route path='/' element={<Home />} />
        <Route path='/main/:name' element={<Main_Cat_Click />} />
        <Route path='/sub/:name' element={<Sub_Cat_Click />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/product/:id' element={<ProductDetails />} />


        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes >
    </>
  )
}

export default App








{/* {auth?.user?.isAdmin === 1 ?
          <Route path='/account' element={<AdminAccount />} />
          :
          <Route path='/account' element={<UserAccount />} />
        } */}