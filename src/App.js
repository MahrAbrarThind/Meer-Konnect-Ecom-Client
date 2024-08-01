import React from 'react'
import { Route, Routes } from 'react-router-dom';
import { useAuth } from './Contexts/auth.js';

//importing Main Files

import Header from './Components/MainFiles/Header.jsx';
import Login from './Components/MainFiles/Login.jsx';
import SignUp from './Components/MainFiles/SignUp.jsx';




// importing other files
import Main_Cat_Click from './Components/OtherFiles/Main_Cat_Click.jsx';
import Sub_Cat_Click from './Components/OtherFiles/Sub_Cat_Click.jsx';




// importing user pages

import UserAccount from './Components/User/UserAccount.jsx';





// importing admin pages 

import AdminAccount from './Components/Admin/AdminAccount.jsx';
import MainCategory from './Components/Admin/MainCategory.jsx';
import SubCategory from './Components/Admin/SubCategory.jsx'


import ChekUser from './Components/OtherFiles/ChekUser.jsx';


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

          {auth?.user?.isAdmin === 1 ?
            <>
              <Route index element={<AdminAccount />} />
              <Route path='/account/main-category' element={<MainCategory />} />
              <Route path='/account/sub-category' element={<SubCategory />} />
            </>
            :
            <>
              <Route index element={<UserAccount />} />
            </>
          }
        </Route>





        <Route path='/main/:name' element={<Main_Cat_Click />} />
        <Route path='/sub/:name' element={<Sub_Cat_Click />} />

      </Routes>


    </>
  )
}

export default App








{/* {auth?.user?.isAdmin === 1 ?
          <Route path='/account' element={<AdminAccount />} />
          :
          <Route path='/account' element={<UserAccount />} />
        } */}