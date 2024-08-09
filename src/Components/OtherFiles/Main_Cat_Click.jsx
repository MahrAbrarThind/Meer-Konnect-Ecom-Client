import React, { useEffect, useState, useRef } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProductsForMainCat } from '../DBFunctions/getProducts';
import { useCart } from '../../Contexts/cartContex';
import QuantitySelector from './QuantitySelector';

const Main_Cat_Click = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { name } = useParams();
  const toastShownRef = useRef(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const { cart, setCart } = useCart();

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
                  setCart([...cart, { ...product, quantity: product.quantity = 1 }]);
                  localStorage.setItem('cart', JSON.stringify([...cart, { ...product, quantity: product.quantity = 1 }]));
                  toast.success(`${cart?.length + 1}  Item Added To Cart`);
                }}>Add to Cart</button>

              </div>
            )))
        )}
      </div>
    </div>
  );
};
export default Main_Cat_Click;
