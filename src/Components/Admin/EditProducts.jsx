import React, { useEffect, useRef } from 'react';
import AdminList from './AdminList';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { getAllProducts } from '../DBFunctions/getProducts';
import axios from 'axios';
import { useAuth } from '../../Contexts/auth';

const EditProducts = () => {
    const [loading, setLoading] = React.useState(true);
    const [products, setProducts] = React.useState([]);
    const toastShownRef = useRef(false);
    const { auth } = useAuth();

    useEffect(() => {
        toastShownRef.current = false;
        setProducts([]);
        setLoading(true);
        (async () => {
            try {
                const response = await getAllProducts();
                if (response.error) {
                    throw response.error;
                } else {
                    setProducts(response.data);
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
    }, []);

    const deleteProduct = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/v1/delete_product/${id}`, {
                headers: {
                    Authorization: auth.token,
                },
            });
            if (response.data.success) {
                if (!toastShownRef.current) {
                    toast.success("Product Deleted Successfully");
                    toastShownRef.current = true;
                }
                const updatedProducts = products.filter(product => product._id !== id);
                setProducts(updatedProducts);
            }
        } catch (error) {
            const { data, status } = error.response;
            if (!toastShownRef.current) {
                if (status === 400) {
                    toast.error(data.msg);
                } else if (status === 404) {
                    toast.error(data.msg);
                } else {
                    toast.error("Server Error");
                }
                toastShownRef.current = true;
            }
        }
    }

    return (
        <>
            <div className="editProductsContainer">
                <AdminList />
                <div className="editAllProducts">
                    {loading ? (
                        <h4>Loading Products...</h4>
                    ) : (
                        products.length === 0 ? (
                            <h3>Oops! No Products Have Been Added Yet</h3>
                        ) : (
                            <>
                                {products.map((product, index) => (
                                    <div key={index} className="singleFeaturedProduct">
                                        <NavLink to={`/product/${product?._id}`} className="featuredImgContainer">
                                            <img src={product.images[0].url} alt={product.title} />
                                        </NavLink>
                                        <p className='productTitle'>{product.title.substring(0, 80)}{product.title.length > 80 ? "..." : ""}</p>
                                        <div className="productPrices">
                                            <p>Rs: {product.price}</p>
                                            <p>Rs: {product.comparedPrice}</p>
                                        </div>
                                        <div className="allproducts-btns">
                                            <NavLink className='editProductNavlink' to={`/account/admin/edit-products/update/${product._id}`}>Update</NavLink>
                                            <button type='button' className="allproducts-btn buy-now-btn" onClick={() => deleteProduct(product._id)}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )
                    )}
                </div>
            </div >
        </>
    )
}

export default EditProducts;
