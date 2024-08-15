import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { getRelatedProducts, getSingleProduct } from '../DBFunctions/getProducts';
import { toast } from 'react-toastify';
import { useCart } from '../../Contexts/cartContex';
import { AddToCartAlert } from '../DBFunctions/AddToCartAlert';
import LoadingSpinner from "../MainFiles/LoadingSpinner.jsx"


const ProductDetails = () => {
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [relatedProductsLoading, setRelatedProductsLoading] = useState(true);
    const { id } = useParams();
    const toastShownRef = useRef(false);
    const [mainImage, setMainImage] = useState(null);
    const { cart, setCart } = useCart();

    const handleAddToCart = AddToCartAlert(cart, setCart);


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
            <div className="upperProductDetails">
                {loading ? (
                    // <h4>Loading Product...</h4>
                    <LoadingSpinner/>
                ) : !product ? (
                    <h3>Oops! No Product Found</h3>
                ) : (
                    <>
                        <div className="mainProductContainer">
                            <div className="productImages">
                                <img className='mainImage' src={mainImage.url} alt="Product Image" />
                                <div className='otherImages'>
                                    {product?.images.map((img, index) =>
                                        <img
                                            className={img.url === mainImage.url ? "activeImage" : ""}
                                            key={index}
                                            onClick={() => changeImage(img)}
                                            src={img.url}
                                            alt="Product Image"
                                        />)}
                                </div>
                            </div>
                            <div className="productDetails">
                                <h1 className='productDetailsTitle'>{product?.title}</h1>
                                <label htmlFor="description">Product Description:</label>
                                <p>{product?.description}</p>
                                <label htmlFor="description">About Item:</label>
                                <p>{product?.aboutItem}</p>
                                <label htmlFor="description">Items Available:</label>
                                <p>{product?.stock} </p>
                                <label htmlFor="description">Price:</label>
                                <div className="detailsProductPrices">
                                    <p>RS: {product?.price}</p>
                                    <p>RS: {product?.comparedPrice}</p>
                                </div>

                                <div className="actionBtns">
                                    <button type='button' onClick={(e) => {
                                        e.preventDefault();
                                        handleAddToCart(product);
                                    }}>
                                        Add to Cart
                                    </button>

                                    {/* <button>Buy Now</button> */}
                                </div>

                                {/* Add other product details here */}
                            </div>
                        </div>
                    </>
                )}
            </div>
            {/* Add related products section here */}

            <div className="featuredProductsContainer">
                <h1>You May Also Like</h1>
                <div className="featuredProducts">
                    {relatedProducts.map((product, index) => (
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
            </div>
        </div>
    );
}

export default ProductDetails;
