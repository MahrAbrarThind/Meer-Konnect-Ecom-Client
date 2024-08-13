import React, { useEffect, useState,useRef } from 'react'
import { getBagsProducts, getFeaturedProducts } from '../../DBFunctions/getProducts';
import { toast } from 'react-toastify';
import { useCart } from '../../../Contexts/cartContex';
import { NavLink } from 'react-router-dom';
import { AddToCartAlert } from '../../DBFunctions/AddToCartAlert';


const ShowingBagsProducts = () => {
    const [bagsProducts, setBagsProducts] = useState([]);
    const { cart, setCart } = useCart();

    const toastActiveRef = useRef(false);


    const handleAddToCart = AddToCartAlert(cart, setCart);


    useEffect(() => {
        (async () => {
            try {
                const response = await getBagsProducts();
                if (response.error) {
                    throw response.error;
                } else {
                    setBagsProducts(response.data);
                }
            } catch (error) {
                if (!toastActiveRef.current) {
                    toastActiveRef.current = true;
                    toast.error(error.message, {
                        onClose: () => {
                            toastActiveRef.current = false; 
                        }
                    });
                }            }
        })();
    }, []);



    return (
        <>
            <div className="featuredProductsContainer">
                <h1>Lady Bags</h1>
                <div className="featuredProducts">
                    {bagsProducts.map((product, index) => (
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
                    ))}
                </div>
                <NavLink className="ViewAllBtn" to={'sub/bags'}>View All</NavLink>
            </div>
        </>
    )
}

export default ShowingBagsProducts;
