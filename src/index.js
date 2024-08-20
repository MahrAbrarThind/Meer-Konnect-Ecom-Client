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
import './CSS/MainFilesCss/Spinner.css';



//importing home files css
import './CSS/MainFilesCss/HomePagesCss/ShowingSubCategories.css';
import './CSS/MainFilesCss/HomePagesCss/FeaturedProducts.css';
import './CSS/MainFilesCss/HomePagesCss/BagsProducts.css';
import './CSS/MainFilesCss/HomePagesCss/ClothesProducts.css';
import './CSS/MainFilesCss/HomePagesCss/SliderImg.css';






//importing other files css
import "./CSS/OtherFilesCss/Main_Cat_Click.css";
import "./CSS/OtherFilesCss/ProductDetails.css";
import "./CSS/OtherFilesCss/Cart.css";



//importing admin files css
import "./CSS/AdminCss/AdminList.css";
import "./CSS/AdminCss/AdminAccount.css";
import "./CSS/AdminCss/MainCategory.css";
import "./CSS/AdminCss/AddProduct.css";
import "./CSS/AdminCss/EditProducts.css";
import "./CSS/AdminCss/AdminOrders.css";
import { UrlStateContextProvider } from './Contexts/urlStateContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <CartProvider>
      <UrlStateContextProvider>
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
      </UrlStateContextProvider>
    </CartProvider>
  </AuthProvider>
);

