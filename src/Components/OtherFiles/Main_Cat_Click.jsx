import React, { useEffect, useState, useRef } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProductsForMainCat } from '../DBFunctions/getProducts';

const Main_Cat_Click = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { name } = useParams();
  const toastShownRef = useRef(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    toastShownRef.current = false;
    setProducts([]);
    setFilteredProducts([]);
    setLoading(true);
    (async () => {
      try {
        const response = await getProductsForMainCat(name);
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

  return (
    <div className="main-container">
      <div className="filter-container">
        <h4>Filter by Price</h4>
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
          <button onClick={handleFilter}>OK</button>
          <button onClick={clearFilter}>Clear</button>
        </div>
      </div>
      <div className="allproducts-container">
        {loading ? (
          <h4>Loading Products...</h4>
        ) : (
          filteredProducts.length === 0 ? (
            <h3>Oops! No Products Have Been Added Yet</h3>
          ) : (
            filteredProducts.map((product, index) => (
              <NavLink to={`/product/${product._id}`} key={index} className="allproducts-card-link">
                <div className="allproducts-card custom-card">
                  <img
                    src={product.image?.url}
                    className="allproducts-card-img-top"
                    alt={product.name}
                  />
                  <div className="allproducts-card-body">
                    <h5 className="allproducts-card-title">{product.name}</h5>
                    <p className="allproducts-card-text">{product.description.substring(0, 100)}...</p>
                    <div className="allproducts-btns">
                      <button className="allproducts-btn buy-now-btn">Buy Now</button>
                      <button className="allproducts-btn add-to-cart-btn">Add to Cart</button>
                    </div>
                  </div>
                </div>
              </NavLink>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default Main_Cat_Click;
