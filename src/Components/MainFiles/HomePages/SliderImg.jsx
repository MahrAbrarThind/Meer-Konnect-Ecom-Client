import React from 'react';
import { NavLink } from 'react-router-dom';

const SliderImg = () => {
    return (
        // showing carousel image using bootstrap

        <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="3000">
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img src="sliderClothImg.png" className="d-block w-100" alt="Slide 1" />
                    <div className="carousel-caption d-block">
                        <h5>Lady Suits</h5>
                        <p>Buy The Best At Low Price.</p>
                        <NavLink to={'/sub/clothes'} className="btn btn-primary">Shop Now</NavLink>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src="sliderBagImg.png" className="d-block w-100" alt="Slide 2" />
                    <div className="carousel-caption d-block">
                        <h5>Lady Bags</h5>
                        <p>Shop Every Design And Color.</p>
                        <NavLink to={'/sub/bags'}>Shop Now</NavLink>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src="sliderPouchImg.png" className="d-block w-100" alt="Slide 3" />
                    <div className="carousel-caption d-block">
                        <h5>Lady Pouches</h5>
                        <p>Shop What You Like.</p>
                        <NavLink to={'/sub/pouches'}>Shop Now</NavLink>
                    </div>
                </div>
            </div>
            <button className="custom1-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                <i className="fas fa-chevron-left"></i>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="custom1-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                <i className="fas fa-chevron-right"></i>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}

export default SliderImg;
