import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AdminList from './AdminList';
import { toast } from 'react-toastify';
import { useAuth } from '../../Contexts/auth';
import { getAll_mainCategories, getAll_subCategories } from '../DBFunctions/getCategories.js';

const SubCategory = () => {
  const { auth } = useAuth();
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

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

  useEffect(() => {
    (async () => {
      try {
        const response = await getAll_mainCategories();
        if (response.error) {
          throw response.error;
        } else {
          setMainCategories(response.data);
        }
      } catch (error) {
        toast.error("Internal Server Error");
      }
    })();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 1 * 1024 * 1024; // 1 MB

    if (file && !allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF)');
      setImage(null);
    } else if (file && file.size > maxSize) {
      setError('Image file size should not exceed 1MB');
      setImage(null);
    } else {
      setError('');
      setImage(file);
    }
  };

  const getPresignedUrl = async (name,fileName, fileType) => {
    const params = {name,fileName, fileType, folderName: 'SubCategoryImages' };
    try {
      const response = await axios.post('http://localhost:4000/api/v1/getSubCatPresinedUrl', params);
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.msg);
      } else {
        toast.error("Internal Server Error");
      }
    }
    return null;
  };

  const uploadImage = async (file, presignedUrl) => {
    try {
      await axios.put(presignedUrl, file, { headers: { 'Content-Type': file.type } });
    } catch (error) {
      throw new Error('Failed to upload image');
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (!name || !selectedMainCategory || !image) {
      toast.error("Fields Cannot Be Empty");
      return;
    }

    try {
      const { presignedUrl, key } = await getPresignedUrl(name,image.name, image.type);
      if (!presignedUrl) return;

      await uploadImage(image, presignedUrl);

      const response = await axios.post("http://localhost:4000/api/v1/add_subCategory",
        { name, id: selectedMainCategory, imageKey: key },
        { headers: { Authorization: auth?.token } }
      );

      if (response.data.success) {
        toast.success("Category Added Successfully.");
        setCategories([...categories, response.data.data]);
      }
      setName("");
      setSelectedMainCategory("");
      setImage(null);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.msg);
      } else {
        toast.error("Server Error");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/v1/delete_subCategory/${id}`, {
        headers: { Authorization: auth?.token },
      });
      if (response.data.success) {
        toast.success("Category deleted successfully.");
        const updatedCategories = categories.filter((i) => i._id !== id);
        setCategories(updatedCategories);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.msg);
      } else {
        toast.error("Server Error");
      }
    }
  };

  const handleUpdateClick = async (id, name) => {
    const newName = prompt(`Enter new name for "${name}":`, name);
    if (newName !== null && newName !== "") {
      try {
        const response = await axios.put(`http://localhost:4000/api/v1/update_subCategory/${id}`, { name: newName }, {
          headers: { Authorization: auth?.token },
        });
        if (response.data.success) {
          toast.success("Category Updated Successfully.");
          const updatedCategories = categories.map(category => {
            if (category._id === id) {
              return { ...category, name: newName };
            }
            return category;
          });
          setCategories(updatedCategories);
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.msg);
        } else {
          toast.error("Server Error");
        }
      }
    }
  };

  const removeNewImage=()=>{
    setImage(null);
  }

  return (
    <div className="mainCatContainer">
      <AdminList />
      <div className="category-content">
        <form onSubmit={submitForm} className="category-form">
          <div className="category-form-group">
            <label htmlFor="mainCategorySelect" className="category-label">Select Main Category</label>
            <select
              className="category-input"
              id="mainCategorySelect"
              value={selectedMainCategory}
              onChange={(e) => setSelectedMainCategory(e.target.value)}
              required
            >
              <option value="">Select Main Category</option>
              {mainCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="category-form-group">
            <label htmlFor="categoryInput" className="category-label">Enter Sub-Category</label>
            <input
              type="text"
              placeholder="Sub-Category"
              className="category-input"
              id="categoryInput"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
          <div className="category-form-group">
            <label htmlFor="categoryImage" className="category-label">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              className="category-input"
              id="categoryImage"
              onChange={handleImageChange}
              required
            />
            {error && <p className="error-message">{error}</p>}
            {image && (
              <div className="image-preview">
                <img src={URL.createObjectURL(image)} alt="Selected" />
                <button onClick={removeNewImage}>Remove</button>
              </div>
            )}
          </div>
          <button type="submit" className="category-button">Add</button>
        </form>
        <div className="category-list">
          {categories.map((c, index) => (
            <div key={index} className="category-item">
              <h2 className="category-name">{c.name}</h2>
              <div className="category-buttons">
                <button className="category-button-update" onClick={() => handleUpdateClick(c._id, c.name)}>Update</button>
                <button className="category-button-delete" onClick={() => handleDelete(c._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SubCategory;
