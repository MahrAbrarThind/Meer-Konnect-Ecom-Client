import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminList from './AdminList';
import { useAuth } from '../../Contexts/auth';
import { getAll_subCategories } from '../DBFunctions/getCategories.js';
import imageCompression from 'browser-image-compression';


const AddProduct = () => {
    const { auth } = useAuth();
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState('');
    const [aboutItem, setAboutItem] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [comparedPrice, setComparedPrice] = useState('');
    const [shippingPrice, setShippingPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [images, setImages] = useState([]);
    const [isFeatured, setIsFeatured] = useState(0);

    const toastShownRef = useRef(false);

    const [uploadProgress, setUploadProgress] = useState(0);
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
                toast.error("Internal Server Error");
            }
        })();
    }, []);

    const handleImageChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const invalidFiles = selectedFiles.filter(file => !allowedTypes.includes(file.type));
        const largeFiles = selectedFiles.filter(file => file.size > 1 * 1024 * 1024); // 1 MB
    
        if (invalidFiles.length > 0) {
            setError('Please upload valid image files (JPEG, PNG, GIF)');
        } else if (largeFiles.length > 0) {
            setError('Image file size should not exceed 1MB');
        } else {
            const resizedImages = await Promise.all(
                selectedFiles.map(async (file) => {
                    try {
                        const options = {
                            maxSizeMB: 1, // Reduce file size to below 1MB
                            maxWidthOrHeight: 800, // Resize to 800px width or height, maintaining aspect ratio
                            useWebWorker: true,
                        };
                        const compressedFile = await imageCompression(file, options);
                        return compressedFile;
                    } catch (error) {
                        console.error('Error resizing image:', error);
                        return file; // Fallback to original file if resizing fails
                    }
                })
            );
    
            setImages((prev) => [...prev, ...resizedImages]);
            setError('');
        }
    };
    
    const removeNewImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
    };

    async function getPresignedUrl(title, fileName, fileType, folderName) {
        const params = {
            fileName,
            fileType,
            folderName,
            title
        }
        try {
            const response = await axios.post(`http://localhost:4000/api/v1/addProduct_preSignedUrl`, params);

            if (response.data.success) {
                return response.data.data;
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                toast.error(data.msg);
                return null;
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

        console.log("going to upload file", presignedUrl, file, options);

        const uploadResponse = await axios.put(presignedUrl, file, options);

        console.log("it is the uploadResponse", uploadResponse);

        if (uploadResponse.status !== 200) {
            throw new Error('Failed to upload file');
        }
    }

    async function handleFileUpload(name, file, folderName) {
        const presignedData = await getPresignedUrl(name, file.name, file.type, folderName);
        if (!presignedData) {
            return null;
        }

        console.log("this is the presigned DAta", presignedData);

        const { presignedUrl, key } = presignedData;
        await uploadFile(file, presignedUrl);
        return key;
    }

    const submitForm = async (e) => {
        e.preventDefault();

        if (!title || !aboutItem || !description || !price || !comparedPrice || !shippingPrice || !stock || !category || !images.length) {
            return setError("All Fields Are Required");
        }

        setSendingRequest(true);

        try {
            const imageKeys = await Promise.all(images.map(image => handleFileUpload(title, image, 'MeerKonnectImages')));
            if (imageKeys.includes(null)) {
                setSendingRequest(false);
                return; // Halt if any image upload fails
            }

            const productData = {
                title,
                aboutItem,
                description,
                price,
                comparedPrice,
                shippingPrice,
                stock,
                subCategory_id: category,
                imageKeys,
                isFeatured
            };

            const response = await axios.post("http://localhost:4000/api/v1/add_product", productData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: auth.token,
                },
            });

            if (response.data.success) {
                setSendingRequest(false);
                toast.success("Product added successfully");
                toastShownRef.current = true;
                setTitle('');
                setAboutItem('');
                setDescription('');
                setPrice('');
                setComparedPrice('');
                setShippingPrice('');
                setStock('');
                setCategory('');
                setImages([]);
                setIsFeatured(0);
            }
        } catch (error) {
            if (error.response) {
                const { data, status } = error.response;
                if (!toastShownRef.current) {
                    toast.error(data.msg);
                    toastShownRef.current = true;
                }
            } else {
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
                        className="addproduct-input"
                        required
                        id="productAboutItem"
                        onChange={(e) => setAboutItem(e.target.value)}
                        value={aboutItem}
                    />
                    <label htmlFor="productDescription" className="addproduct-label">Product Description</label>
                    <textarea
                        placeholder="Description"
                        className="addproduct-input"
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
                    <label htmlFor="productImages" className="addproduct-label">Product Images</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="addproduct-input"
                        id="productImages"
                        onChange={handleImageChange}
                    />
                    {error && <p className="error-message">{error}</p>}
                    {images.length > 0 && (
                        <div className="selected-images">
                            {images.map((image, index) => (
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
                    <button type="submit" className="addproduct-button" disabled={sendingRequest}>
                        {sendingRequest ? `Uploading... ${uploadProgress}%` : 'Add Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
