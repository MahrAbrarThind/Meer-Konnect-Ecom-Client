import React, { useEffect, useState } from 'react'
import { getFeaturedProducts } from '../../DBFunctions/getProducts';
import { toast } from 'react-toastify';
import { useCart } from '../../../Contexts/cartContex';
import { NavLink } from 'react-router-dom';

const ShowingFeaturedProducts = () => {
    const [featuredProducts, sertFeaturedProducts] = useState([]);
    const { cart, setCart } = useCart();

    useEffect(() => {
        (async () => {
            try {
                const response = await getFeaturedProducts();
                console.log("it is while getting featured products", response);
                if (response.error) {
                    throw response.error;
                } else {
                    sertFeaturedProducts(response.data);
                }
            } catch (error) {
                toast.error(error.msg);
            }
        })();
    }, []);



    return (
        <>
            <div className="featuredProductsContainer">
                <h1>Featured Products</h1>
                <div className="featuredProducts">
                    {featuredProducts.map((product, index) => (
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
                    ))}
                </div>
            </div>
        </>
    )
}

export default ShowingFeaturedProducts
