import React, { useEffect, useState, useRef } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProductsForSubCat } from '../DBFunctions/getProducts.js';
import { useCart } from '../../Contexts/cartContex.js';
import { AddToCartAlert } from '../DBFunctions/AddToCartAlert';
import LoadingSpinner from '../MainFiles/LoadingSpinner.jsx';
import { FaFilter } from 'react-icons/fa'; // Importing a filter icon


const Sub_Cat_Click = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false); // State to control filter visibility
  const toastShownRef = useRef(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [clothesStatus, setClothesStatus] = useState('');

  const { cart, setCart } = useCart();
  const handleAddToCart = AddToCartAlert(cart, setCart);

  const filterRef = useRef(null);

  const { name } = useParams();

  // getting products for category selected
  useEffect(() => {
    toastShownRef.current = false;
    setProducts([]);
    setFilteredProducts([]);
    setLoading(true);
    (async () => {
      try {
        const response = await getProductsForSubCat(name);
        if (response.error) {
          throw response.error;
        } else {
          setProducts(response.data);
          setFilteredProducts(response.data);
        }
      } catch (error) {
        if (!toastShownRef.current) {
          toast.error(error.msg);
          toastShownRef.current = true;
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [name]);

  // handling disappear filter when clicked on screen
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

        {/* handling sort here for price and date from hign low */}
        <div className="sort-filter">
          {/* <label htmlFor="sort">Sort By:</label> */}
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




      {/* price  Filter here */}

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

        <div className="allproducts-container">
          {loading ? (
            <LoadingSpinner />
          ) : (
            filteredProducts.length === 0 ? (
              <h3>Oops! No Products Have Been Added Yet</h3>
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

export default Sub_Cat_Click;
