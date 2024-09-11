import React from 'react'
import { NavLink } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="border-top pt-5 pb-4">
            <div className="container text-center text-md-left">
                <div className="row text-center text-md-left">
                    <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3 text-black d-flex flex-column justify-content-end align-items-start">
                        <h5 className="text-uppercase mb-4 font-weight-bold">Quick Links</h5>
                        <p><NavLink to={"/"} className="text-black" style={{ textDecoration: 'none' }}>Home</NavLink></p>
                        <p><NavLink to={"/Cart"} className="text-black" style={{ textDecoration: 'none' }}>Cart</NavLink></p>
                        <p><NavLink to={"/register"} className="text-black" style={{ textDecoration: 'none' }}>Sign Up</NavLink></p>
                        <p><NavLink to={"/login"} className="text-black" style={{ textDecoration: 'none' }}>Sign In</NavLink></p>
                    </div>

                    <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3 ">
                        <div className='d-flex flex-column justify-content-end align-items-start'>
                            <h5 className="text-uppercase mb-4 font-weight-bold ">Follow Us At</h5>
                            <NavLink to="https://www.youtube.com/@abrarhussain3150" className="text-black" style={{ textDecoration: 'none' }}>
                                <i className="fab fa-youtube" style={{ marginRight: '8px' }}></i>YouTube
                            </NavLink>
                            <NavLink to="https://www.linkedin.com/in/abrar-hussain-aa3099293/" className="text-black" style={{ textDecoration: 'none' }}>
                                <i className="fab fa-linkedin" style={{ marginRight: '8px' }}></i>LinkedIn
                            </NavLink>
                            <NavLink to="https://github.com/MahrAbrarThind" className="text-black" style={{ textDecoration: 'none' }}>
                                <i className="fab fa-github" style={{ marginRight: '8px' }}></i>GitHub
                            </NavLink>
                        </div>
                    </div>



                    <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3 d-flex flex-column align-items-start">
                        <h5 className="text-uppercase mb-4 font-weight-bold">Contact</h5>
                        <p><i className="fas fa-home mr-3" /> SultanPura, Lahore, Punjab</p>
                        <p><i className="fas fa-envelope mr-3" /> abrarDeveloper@gmail.com</p>
                        <p><i className="fas fa-phone mr-3" /> +92-3416496320</p>
                    </div>
                </div >
                <hr className="mb-4" />
                <div className="row align-items-center justify-content-center">
                    <div className="col-md-7 col-lg-8">
                        <p className="text-center text-md-left">© 2024 Copyright:
                            <strong>MeerKonnect.com</strong>
                        </p>
                    </div>
                </div>
            </div >
        </footer >

    )
}

export default Footer
