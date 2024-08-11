import React, { useEffect, useState, useRef } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProductsForSubCat } from '../DBFunctions/getProducts.js';
import { useCart } from '../../Contexts/cartContex.js';
import { AddToCartAlert } from '../DBFunctions/AddToCartAlert';


const Sub_Cat_Click = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { name } = useParams();
  const toastShownRef = useRef(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const { cart, setCart } = useCart();

  const handleAddToCart = AddToCartAlert(cart, setCart);


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
          setFilteredProducts(response.data); // Set filtered products initially
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

  const handleFilter = () => {
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;
    const filtered = products.filter(product => {
      const price = parseFloat(product.price);
      return price >= min && price <= max;
    });
    setFilteredProducts(filtered);
  };

  const clearFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    setFilteredProducts(products);
  };

  console.log("these are the filtered products", filteredProducts);
  return (
    <div className="main-container">
      <div className="filter-container">
        <h4>Filter</h4>
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
          <button type='button' onClick={handleFilter}>Filter</button>
          <button type='button' onClick={clearFilter}>Clear</button>
        </div>
      </div>
      <div className="allproducts-container">
        {loading ? (
          <h4>Loading Products...</h4>
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
            )))
        )}
      </div>
    </div>
  );
};

export default Sub_Cat_Click;
