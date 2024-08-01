import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Contexts/auth';



// Setting React - Toastify here
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




// importing Main Files css
import './CSS/MainFilesCss/header.css';
import './CSS/MainFilesCss/Login.css';



//importing other files css
import "./CSS/OtherFilesCss/Main_Cat_Click.css";



//importing admin files css
import "./CSS/AdminCss/AdminList.css";
import "./CSS/AdminCss/AdminAccount.css";
import "./CSS/AdminCss/MainCategory.css";





const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
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
  </AuthProvider>
);

