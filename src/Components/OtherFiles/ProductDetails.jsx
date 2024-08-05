import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { getRelatedProducts, getSingleProduct } from '../DBFunctions/getProducts';
import { toast } from 'react-toastify';
import { useCart } from '../../Contexts/cartContex';

const ProductDetails = () => {
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [relatedProductsLoading, setRelatedProductsLoading] = useState(true);
    const { id } = useParams();
    const toastShownRef = useRef(false);
    const [mainImage, setMainImage] = useState(null);
    const { cart, setCart } = useCart();

    useEffect(() => {
        toastShownRef.current = false;
        setProduct(null);
        setLoading(true);
        (async () => {
            try {
                const response = await getSingleProduct(id);
                if (response.error) {
                    throw response.error;
                } else {
                    setProduct(response.data);
                    setMainImage(response.data.images[0]);
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
    }, [id]);

    useEffect(() => {
        if (product && product.subCategory_id) {
            setRelatedProductsLoading(true);
            (async () => {
                try {
                    const response = await getRelatedProducts(product.subCategory_id);
                    if (response.error) {
                        throw response.error;
                    } else {
                        setRelatedProducts(response.data);
                        console.log("related products ", response.data);
                    }
                } catch (error) {
                    toast.error(error.msg);
                } finally {
                    setRelatedProductsLoading(false);
                }
            })();
        }
    }, [product]);

    const changeImage = (img) => {
        setMainImage(img);
    }

    return (
        <div className="product-details-container">
            <div className="productDetails">
                {loading ? (
                    <h4>Loading Product...</h4>
                ) : !product ? (
                    <h3>Oops! No Product Found</h3>
                ) : (
                    <>
                        <h1>{product?.title}</h1>
                        <div className="mainProductContainer">
                            <div className="productImages">
                                <img className='mainImage' src={mainImage.url} alt="Product Image" />
                                {product?.images.map((img, index) =>
                                    <img key={index} className='otherImages' onClick={() => changeImage(img)} src={img.url} alt="Product Image" />)}
                            </div>
                            <div className="productDetails">
                                <p>{product?.description}</p>
                                <p>Price: ${product?.price}</p>
                                {/* Add other product details here */}
                            </div>
                        </div>
                    </>
                )}
            </div>
            {/* Add related products section here */}
            <div className="relatedProductsContainer">
                <h1>You May Also Like</h1>
                <div className="relatedProducts">
                    {relatedProductsLoading ? (
                        <h4>Loading Products...</h4>
                    ) : relatedProducts.length === 0 ? (
                        <h3>Oops! No Products Found</h3>
                    ) : (
                        relatedProducts?.map((product, index) => (
                            <NavLink to={`/product/${product._id}`} key={index} className="allproducts-card-link">
                                <div className="allproducts-card custom-card">
                                    <img
                                        src={product?.images[0]?.url}
                                        className="allproducts-card-img-top"
                                        alt={product.title}
                                    />
                                    <div className="allproducts-card-body">
                                        <h5 className="allproducts-card-title">{product.title}</h5>
                                        <p className="allproducts-card-text">{product.description.substring(0, 100)}...</p>
                                        <div className="allproducts-btns">
                                            <button type='button' className="allproducts-btn buy-now-btn" onClick={(e) => { e.preventDefault() }}>Buy Now</button>
                                            <button type='button' className="allproducts-btn add-to-cart-btn" onClick={(e) => {
                                                e.preventDefault();
                                                setCart([...cart, { ...product, quantity: product.quantity = 1 }]);
                                                localStorage.setItem('cart', JSON.stringify([...cart, { ...product, quantity: product.quantity = 1 }]));
                                                toast.success(`${cart?.length + 1}  Item Added To Cart`);
                                            }}>Add to Cart</button>
                                        </div>
                                    </div>
                                </div>
                            </NavLink>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
