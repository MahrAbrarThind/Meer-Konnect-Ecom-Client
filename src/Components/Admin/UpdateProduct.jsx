import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../Contexts/auth';
import { useParams } from 'react-router-dom';
import { getAll_subCategories } from '../DBFunctions/getCategories.js';
import { getSingleProduct } from '../DBFunctions/getProducts.js'
import AdminList from './AdminList.jsx';

const UpdateProduct = () => {
    const { auth } = useAuth();
    const { id } = useParams();

    const [title, setTitle] = useState('');
    const [aboutItem, setAboutItem] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [comparedPrice, setComparedPrice] = useState('');
    const [shippingPrice, setShippingPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [existingImages, setExistingImages] = useState([]);
    const [imgKeysToDel, setImgKeysToDel] = useState([]);

    const [newImages, setNewImages] = useState([]);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const toastShownRef = useRef(false);

    const [sendingRequest, setSendingRequest] = useState(false);



    useEffect(() => {
        (async () => {
            try {
                const response = await getAll_subCategories();
                if (response.error) {
                    throw response.error;
                } else {
                    setCategories(response.data);
                }
            } catch (error) {
                if (error.response) {
                    toast.error(error.response.data.msg);
                } else {
                    toast.error("Internal Server Error");
                }
            }
        })();
    }, []);


    useEffect(() => {
        (async () => {
            try {
                const response = await getSingleProduct(id);
                if (response.error) {
                    throw response.error;
                } else {
                    const product = response.data;
                    setTitle(product.title);
                    setAboutItem(product.aboutItem);
                    setDescription(product.description);
                    setPrice(product.price);
                    setComparedPrice(product.comparedPrice);
                    setShippingPrice(product.shippingPrice);
                    setStock(product.stock);
                    setCategory(product.subCategory_id);
                    setExistingImages(product.images);
                    setImgKeysToDel(product.images);
                }
            } catch (error) {
                if (!toastShownRef.current) {
                    toast.error(error.msg);
                    toastShownRef.current = true;
                }
            }
        })();
    }, [id]);

    const validateImage = (file) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const maxSize = 1 * 1024 * 1024; // 1MB

        if (!fileTypes.test(file.type)) {
            return 'Image format should be jpeg, jpg, png, or gif';
        }

        if (file.size > maxSize) {
            return 'Image size should not exceed 1MB';
        }

        return null;
    };

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const errors = selectedFiles.map(validateImage).filter(error => error);
        if (errors.length > 0) {
            setError(errors[0]);
        } else {
            setNewImages(selectedFiles);
            setError('');
        }
    };

    const removeExistingImage = (index) => {
        const updatedImages = existingImages.filter((_, i) => i !== index);
        setExistingImages(updatedImages);
    };

    const removeNewImage = (index) => {
        const updatedImages = newImages.filter((_, i) => i !== index);
        setNewImages(updatedImages);
    };

    async function getPresignedUrl(fileName, fileType, folderName) {
        const params = {
            fileName,
            fileType,
            folderName,
            id,
        }
        try {
            const response = await axios.post(`http://localhost:4000/api/v1/updateProduct_preSignedUrl`, params, {
                headers: {
                    Authorization: auth.token,
                },
            });

            if (response.data.success) {
                return response.data.data;
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                toast.error(data.msg);
            } else {
                toast.error("Internal Server Error");
                return null;
            }

        }
    }

    async function uploadFile(file, presignedUrl) {
        const options = {
            headers: {
                'Content-Type': file.type,
            },
        };

        const uploadResponse = await axios.put(presignedUrl, file, options);

        if (uploadResponse.status !== 200) {
            throw new Error('Failed to upload file');
        }
    }

    async function handleFileUpload(file, folderName) {
        const presignedData = await getPresignedUrl(file.name, file.type, folderName);
        if (!presignedData) {
            return null;
        }
        const { presignedUrl, key } = presignedData;
        await uploadFile(file, presignedUrl);
        return key;
    }

    const submitForm = async (e) => {
        e.preventDefault();

        if (!title || !aboutItem || !description || !category) {
            setError('All Fields Are Required');
            return;
        }
        if (!price || isNaN(price)) {
            setError('Valid price is required');
            return;
        }
        if (!comparedPrice || isNaN(comparedPrice)) {
            setError('Valid compared price is required');
            return;
        }
        if (!shippingPrice || isNaN(shippingPrice)) {
            setError('Valid shipping price is required');
            return;
        }
        if (!stock || isNaN(stock)) {
            setError('Valid stock is required');
            return;
        }
        if (newImages.length === 0 && existingImages.length === 0) {
            setError('At least one image is required');
            return;
        }

        setSendingRequest(true);

        try {

            // handling logic so that we send those images to backend for deletion
            // that are removed from existing images


            const filteredImgKeysToDel = imgKeysToDel.filter(imgToDel =>
                !existingImages.some(existingImg => existingImg.key === imgToDel.key)
            );

            setImgKeysToDel(filteredImgKeysToDel);


            let newImageKeys = [];

            if (newImages.length > 0) {
                newImageKeys = await Promise.all(newImages.map(image => handleFileUpload(image, 'MeerKonnectImages')));
                if (newImageKeys.includes(null)) {
                    setSendingRequest(false);
                    return; // Halt if any image upload fails
                }
            }


            const updateData = {
                title,
                aboutItem,
                description,
                price,
                comparedPrice,
                shippingPrice,
                stock,
                category,
                imgKeysToDel
            }

            if (newImageKeys.length > 0) {
                updateData.newImageKeys = newImageKeys;
            }

            const response = await axios.put(`http://localhost:4000/api/v1/update_product/${id}`, updateData, {
                headers: {
                    Authorization: auth.token,
                },
            });
            if (response.data.success) {
                setSendingRequest(false);
                toast.success('Product Updated Successfully');
                setTitle('');
                setAboutItem('');
                setDescription('');
                setPrice('');
                setComparedPrice('');
                setShippingPrice('');
                setStock('');
                setCategory('');
                setNewImages([]);
                setExistingImages([]);
            }
        } catch (error) {
            if (error.response) {
                const { data, status } = error.response;
                toast.error(data.msg);
            }
            else {
                toast.error("Server Error");
            }
            setSendingRequest(false);
        }
    };

    return (
        <div className="updateProductContainer">
            <AdminList />
            <form className='updateProductForm' onSubmit={submitForm}>
                <div className="form-group">
                    <label>Product Title</label>
                    <input
                        type="text"
                        className={`form-control ${error && !title ? 'is-invalid' : ''}`}
                        placeholder="Product Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>About Item</label>
                    <textarea
                        className={`form-control ${error && !aboutItem ? 'is-invalid' : ''}`}
                        placeholder="About Item"
                        value={aboutItem}
                        onChange={(e) => setAboutItem(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        className={`form-control ${error && !description ? 'is-invalid' : ''}`}
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Price</label>
                    <input
                        type="number"
                        className={`form-control ${error && (!price || isNaN(price)) ? 'is-invalid' : ''}`}
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Compared Price</label>
                    <input
                        type="number"
                        className={`form-control ${error && (!comparedPrice || isNaN(comparedPrice)) ? 'is-invalid' : ''}`}
                        placeholder="Compared Price"
                        value={comparedPrice}
                        onChange={(e) => setComparedPrice(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Shipping Price</label>
                    <input
                        type="number"
                        className={`form-control ${error && (!shippingPrice || isNaN(shippingPrice)) ? 'is-invalid' : ''}`}
                        placeholder="Shipping Price"
                        value={shippingPrice}
                        onChange={(e) => setShippingPrice(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Stock</label>
                    <input
                        type="number"
                        className={`form-control ${error && (!stock || isNaN(stock)) ? 'is-invalid' : ''}`}
                        placeholder="Stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <select
                        className={`form-control ${error && !category ? 'is-invalid' : ''}`}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Existing Images</label>
                    <div className="row">
                        {existingImages.map((image, index) => (
                            <div key={index} className="col-md-2">
                                <img src={image.url} alt="product" className="img-thumbnail" />
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeExistingImage(index)}>Remove</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>New Images</label>
                    <input
                        type="file"
                        multiple
                        className={`form-control ${error && newImages.length === 0 ? 'is-invalid' : ''}`}
                        onChange={handleImageChange}
                    />
                </div>

                {newImages.length > 0 && (
                    <div className="form-group">
                        <label>Preview Selected Images</label>
                        <div className="row">
                            {newImages.map((image, index) => (
                                <div key={index} className="col-md-2">
                                    <img src={URL.createObjectURL(image)} alt="product" className="img-thumbnail" />
                                    <button type="button" className="btn btn-danger btn-sm" onClick={() => removeNewImage(index)}>Remove</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {error && <div className="alert alert-danger">{error}</div>}

                <button type="submit" className="btn btn-primary" disabled={sendingRequest}>
                    {sendingRequest ? 'Updating...' : 'Update Product'}
                </button>
            </form>
        </div>
    );
};

export default UpdateProduct;
