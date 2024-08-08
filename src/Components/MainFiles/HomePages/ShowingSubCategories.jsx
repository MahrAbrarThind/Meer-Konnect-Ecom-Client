import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { getAll_subCategories } from '../../DBFunctions/getCategories';
import { CustomPrevArrow, CustomNextArrow } from './Cat_Mov_Arrows';
import { toast } from 'react-toastify';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { NavLink } from 'react-router-dom';

const ShowingSubCategories = () => {
    const [subCategories, set_subCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const subResponse = await getAll_subCategories();
                console.log("it is response for getting sub categories", subResponse);
                if (subResponse.error) {
                    throw new Error("Failed to fetch categories");
                } else {
                    set_subCategories(subResponse.data);
                }
            } catch (error) {
                toast.error("Internal Server Error: " + error.message);
            }
        };
        fetchCategories();
    }, []);

    const settings = {
        dots: true,
        infinite: subCategories.length > 6, // Enable infinite scroll only if there are more than 6 categories
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        nextArrow: subCategories.length > 6 ? <CustomNextArrow /> : null,
        prevArrow: subCategories.length > 6 ? <CustomPrevArrow /> : null,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: subCategories.length > 4,
                    nextArrow: subCategories.length > 4 ? <CustomNextArrow /> : null,
                    prevArrow: subCategories.length > 4 ? <CustomPrevArrow /> : null,
                },
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: subCategories.length > 3,
                    nextArrow: subCategories.length > 3 ? <CustomNextArrow /> : null,
                    prevArrow: subCategories.length > 3 ? <CustomPrevArrow /> : null,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: subCategories.length > 2,
                    nextArrow: subCategories.length > 2 ? <CustomNextArrow /> : null,
                    prevArrow: subCategories.length > 2 ? <CustomPrevArrow /> : null,
                },
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: subCategories.length > 1,
                    nextArrow: subCategories.length > 1 ? <CustomNextArrow /> : null,
                    prevArrow: subCategories.length > 1 ? <CustomPrevArrow /> : null,
                },
            },
        ],
    };

    return (
        <div className="showingSubCategoriesContainer">
            <h1>Shop By Categories</h1>
            <Slider {...settings} className="subCategroyItems">
                {subCategories.map((cat) => (
                    <NavLink key={cat._id} to={`/sub/${cat.name}`} className="subCategorySingleItem">
                        <img src={cat?.image?.url} alt="Image" />
                        <p>{cat?.name}</p>
                    </NavLink>
                ))}
            </Slider>
        </div>
    );
};

export default ShowingSubCategories;
