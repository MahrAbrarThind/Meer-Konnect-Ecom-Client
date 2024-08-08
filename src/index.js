import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Contexts/auth';
import { CartProvider } from './Contexts/cartContex';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';



// Setting React - Toastify here
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




// importing Main Files css
import './CSS/MainFilesCss/header.css';
import './CSS/MainFilesCss/Login.css';

//importing home files css
import './CSS/MainFilesCss/HomePagesCss/ShowingSubCategories.css';



//importing home page css
import './CSS/MainFilesCss/HomePagesCss/SliderImg.css';


//importing other files css
import "./CSS/OtherFilesCss/Main_Cat_Click.css";



//importing admin files css
import "./CSS/AdminCss/AdminList.css";
import "./CSS/AdminCss/AdminAccount.css";
import "./CSS/AdminCss/MainCategory.css";
import "./CSS/AdminCss/AddProduct.css";
import "./CSS/AdminCss/EditProducts.css";
import "./CSS/AdminCss/UpdateProduct.css";



// importing user files css
import "./CSS/UserCss/UserOrders.css";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <CartProvider>
      <BrowserRouter>
        <React.StrictMode>
          <ToastContainer
            position="top-center"
            autoClose={1700}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            style={{ fontSize: '14px' }}
          />
          <App />
        </React.StrictMode>
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>
);

