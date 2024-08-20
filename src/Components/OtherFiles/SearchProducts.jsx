import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AddToCartAlert } from '../DBFunctions/AddToCartAlert';
import { useCart } from '../../Contexts/cartContex';
import LoadingSpinner from '../MainFiles/LoadingSpinner';
import { FaFilter } from 'react-icons/fa'; // Importing a filter icon
import NoResultSearch from './NoResultSearch';

const SearchProducts = () => {
    const location = useLocation();
    const products = location.state?.products || [];
    const categories = location.state?.categories || [];
    const [filteredProducts, setFilteredProducts] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const toastShownRef = useRef(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [clothesStatus, setClothesStatus] = useState('');
    const filterRef = useRef(null);

    // function for adding item to cart
    const { cart, setCart } = useCart();
    const handleAddToCart = AddToCartAlert(cart, setCart);


    // getting categories for showing filter for clothes
    let name = "none";
    if (categories.includes("clothes")) {
        name = "clothes";
    }

    // setting filtered products to products
    useEffect(()=>{
        setFilteredProducts(products);
    },[products]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilter(false);
            }
        };

        if (showFilter) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showFilter]);

    const handleFilter = () => {
        const min = parseFloat(minPrice) || 0;
        const max = parseFloat(maxPrice) || Infinity;
        const filtered = products.filter(product => {
            const price = parseFloat(product.price);
            const matchesPrice = price >= min && price <= max;
            const matchesClothesStatus = clothesStatus ? product.clothesStatus === clothesStatus : true;
            return matchesPrice && matchesClothesStatus;
        });
        setFilteredProducts(filtered);
    };

    const clearFilter = () => {
        setMinPrice('');
        setMaxPrice('');
        setClothesStatus('');
        setFilteredProducts(products);
    };

    const handleSort = (sortType) => {
        let sortedProducts = [...filteredProducts];

        switch (sortType) {
            case 'priceLowHigh':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'priceHighLow':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'dateNewOld':
                sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'dateOldNew':
                sortedProducts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            default:
                sortedProducts = [...products];
                break;
        }

        setFilteredProducts(sortedProducts);
    };


    return (

        <div className="main-container">
            <div className="allFiltersContainer">

                {/* it is sort for price or date from high to low */}
                <div className="sort-filter">
                    <select
                        id="sort"
                        onChange={(e) => {
                            handleSort(e.target.value);
                        }}
                    >
                        <option value="default">Sort By Defualt</option>
                        <option value="priceLowHigh">Price: Low to High</option>
                        <option value="priceHighLow">Price: High to Low</option>
                        <option value="dateNewOld">Date: New to Old</option>
                        <option value="dateOldNew">Date: Old to New</option>
                    </select>
                </div>

                {/*will be shown for small devices these are icons for sort and filter  */}
                <div className="filter_icon_Container" onClick={() => setShowFilter(!showFilter)}>
                    <FaFilter className="filter-icon" />
                    <p>Filter</p>
                </div>
            </div>




            {/* Conditional Rendering of Filter */}

            {/* this is the filter for price  */}
            <div className="filterAndProductsContainer">
                <div ref={filterRef} className={showFilter ? "showFilterContainer" : "filter-container"}>
                    <h4>Filter Items</h4>
                    <div className="price-filter">
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={minPrice}
                            min={0}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || (Number(value) >= 0 && !value.includes('-'))) {
                                    setMinPrice(value);
                                }
                            }}
                        />
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={maxPrice}
                            min={0}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || (Number(value) >= 0 && !value.includes('-'))) {
                                    setMaxPrice(value);
                                }
                            }}
                        />
                        {name === 'clothes' && (
                            <div className="clothes-filter">
                                <p>Choose Stitched or Non-Stitched</p>
                                <select value={clothesStatus} onChange={(e) => setClothesStatus(e.target.value)}>
                                    <option value="">All</option>
                                    <option value="stitched">Stitched</option>
                                    <option value="nonStitched">NonStitched</option>
                                </select>
                            </div>
                        )}
                        <button type='button' onClick={() => { handleFilter(); setShowFilter(false) }}>Filter</button>
                        <button type='button' onClick={() => { clearFilter(); setShowFilter(false) }}>Clear</button>
                    </div>
                </div>

                {/* //showing products */}
                <div className="allproducts-container">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        filteredProducts.length === 0 ? (
                            <NoResultSearch/>
                        ) : (
                            filteredProducts?.map((product, index) => (
                                <div key={index} className="singleFeaturedProduct">
                                    <NavLink to={`/product/${product?._id}`} className="featuredImgContainer">
                                        <img src={product.images[0].url} alt={product.title} />
                                    </NavLink>
                                    <p className='productTitle'>{product.title.substring(0, 80)}{product.title.length > 80 ? "..." : ""}</p>
                                    <div className="productPrices">
                                        <p>Rs: {product.price}</p>
                                        <p>Rs: {product.comparedPrice}</p>
                                    </div>
                                    <button type='button' onClick={(e) => {
                                        e.preventDefault();
                                        handleAddToCart(product);
                                    }}>
                                        Add to Cart
                                    </button>
                                </div>
                            ))
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchProducts;
