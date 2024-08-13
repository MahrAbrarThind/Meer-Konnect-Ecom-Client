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
    const [isFeatured, setIsFeatured] = useState(0);
    const [clothesStatus, setClothesStatus] = useState("none"); // Set initial state based on the existing product data


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
                    setIsFeatured(product.isFeatured);
                    setClothesStatus(product.clothesStatus);
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
        const imgToDel = existingImages[index];
        setExistingImages(updatedImages);
        setImgKeysToDel([...imgKeysToDel, imgToDel]);
        console.log("this is existing image to be shown",existingImages[index]);
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
                imgKeysToDel,
                isFeatured,
                clothesStatus,
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
                setIsFeatured(0);

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
        <div className="addproduct-container">
            <AdminList />
            <form onSubmit={submitForm} className="addproduct-form">
                <div className="addproduct-form-group">
                    <label htmlFor="productTitle" className="addproduct-label">Product Title</label>
                    <input
                        type="text"
                        required
                        placeholder="Title"
                        className="addproduct-input"
                        id="productTitle"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                    />

                    <label htmlFor="productAboutItem" className="addproduct-label">About Item</label>
                    <textarea
                        placeholder="About Item"
                        className="addproduct-textArea"
                        required
                        id="productAboutItem"
                        onChange={(e) => setAboutItem(e.target.value)}
                        value={aboutItem}
                    />

                    <label htmlFor="productDescription" className="addproduct-label">Product Description</label>
                    <textarea
                        placeholder="Description"
                        className="addproduct-textArea"
                        required
                        id="productDescription"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                    />

                    <label htmlFor="productPrice" className="addproduct-label">Product Price</label>
                    <input
                        type="number"
                        min={1}
                        placeholder="Price"
                        className="addproduct-input"
                        id="productPrice"
                        required
                        onChange={(e) => setPrice(e.target.value)}
                        value={price}
                    />

                    <label htmlFor="productComparedPrice" className="addproduct-label">Compared Price</label>
                    <input
                        type="number"
                        min={1}
                        placeholder="Compared Price"
                        className="addproduct-input"
                        id="productComparedPrice"
                        required
                        onChange={(e) => setComparedPrice(e.target.value)}
                        value={comparedPrice}
                    />

                    <label htmlFor="productShippingPrice" className="addproduct-label">Shipping Price</label>
                    <input
                        type="number"
                        min={1}
                        placeholder="Shipping Price"
                        className="addproduct-input"
                        id="productShippingPrice"
                        required
                        onChange={(e) => setShippingPrice(e.target.value)}
                        value={shippingPrice}
                    />

                    <label htmlFor="productStock" className="addproduct-label">Stock</label>
                    <input
                        type="number"
                        min={1}
                        placeholder="Stock"
                        className="addproduct-input"
                        id="productStock"
                        required
                        onChange={(e) => setStock(e.target.value)}
                        value={stock}
                    />

                    <label htmlFor="productCategory" className="addproduct-label">Select Product Category</label>
                    <select
                        className="addproduct-input"
                        value={category}
                        required
                        onChange={(e) => setCategory(e.target.value)}
                        id="productCategory"
                    >
                        <option value="" disabled>
                            Select a Category
                        </option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="productImages" className="addproduct-label">Existing Images</label>
                    <div className="row">
                        {existingImages.map((image, index) => (
                            <div key={index} className="col-md-2">
                                <img src={image.url} alt="product" className="img-thumbnail" />
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeExistingImage(index)}>Remove</button>
                            </div>
                        ))}
                    </div>

                    <label htmlFor="productImages" className="addproduct-label">New Images</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="addproduct-input"
                        id="productImages"
                        onChange={handleImageChange}
                    />

                    {error && <p className="error-message">{error}</p>}
                    {newImages.length > 0 && (
                        <div className="selected-images">
                            {newImages.map((image, index) => (
                                <div key={index} className="image-preview">
                                    <img src={URL.createObjectURL(image)} alt="Selected" />
                                    <button type="button" onClick={() => removeNewImage(index)}>Remove</button>
                                </div>
                            ))}
                        </div>
                    )}


                    <label className="addproduct-label">Is Featured?</label>
                    <div className="feature_selection">
                        <label style={{ marginRight: "6px" }}>
                            <input
                                type="radio"
                                name="isFeatured"
                                value={0} // Not featured
                                checked={isFeatured === 0}
                                onChange={(e) => setIsFeatured(parseInt(e.target.value))}
                            />
                            No
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="isFeatured"
                                value={1} // Featured
                                checked={isFeatured === 1}
                                onChange={(e) => setIsFeatured(parseInt(e.target.value))}
                            />
                            Yes
                        </label>
                    </div>

                    <label className="updateproduct-label">Clothes Status</label>
                    <div className="clothes_status_selection">
                        <label style={{ marginRight: "6px" }}>
                            <input
                                type="radio"
                                name="clothesStatus"
                                value="none"
                                checked={clothesStatus === "none"}
                                onChange={(e) => setClothesStatus(e.target.value)}
                            />
                            None
                        </label>
                        <label style={{ marginRight: "6px" }}>
                            <input
                                type="radio"
                                name="clothesStatus"
                                value="stitched"
                                checked={clothesStatus === "stitched"}
                                onChange={(e) => setClothesStatus(e.target.value)}
                            />
                            Stitched
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="clothesStatus"
                                value="nonStitched"
                                checked={clothesStatus === "nonStitched"}
                                onChange={(e) => setClothesStatus(e.target.value)}
                            />
                            Non-Stitched
                        </label>
                    </div>



                    <button type="submit" className="addproduct-button" disabled={sendingRequest}>
                        {sendingRequest ? `Uploading... ` : 'Add Product'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default UpdateProduct;
