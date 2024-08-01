
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AdminList from './AdminList'
import { toast } from 'react-toastify';
import { useAuth } from '../../Contexts/auth';
import { getAll_mainCategories } from '../DBFunctions/getCategories.js';


const MainCategory = () => {
  const { auth, setAuth } = useAuth();
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);




  useEffect(() => {
    (async () => {
      try {
        const response = await getAll_mainCategories();
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


  const submitForm = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Fields Cannot Be Empty");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/api/v1/add_main_category", { name},
        {
          headers:
          {
            Authorization: auth?.token,
          },
        });
      if (response.data.success) {
        toast.success("Category Added Successfully.");
        setCategories([...categories, response.data.data]);
      }
      setName("");
    }
    catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        toast.error(data.msg);
      }
      else {
        toast.error("Server Error")
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/v1/delete_main_category/${id}`, {
        headers:
        {
          Authorization: auth?.token,
        },
      });
      if (response.data.success) {
        toast.success("Category deleted successfully.");
        const updatedCategories = categories.filter((i) => i._id !== id);
        setCategories(updatedCategories);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        toast.error(data.msg);
      } else {
        toast.error("Server Error");
      }

    }
  }

  const handleUpdateClick = async (id, name) => {
    const newName = prompt(`Enter new name for "${name}":`, name);
    if (newName !== null && newName !== "") {
      try {
        const response = await axios.put(`http://localhost:4000/api/v1/update_main_category/${id}`, { name: newName }, {
          headers:
          {
            Authorization: auth?.token,
          },
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
      }
      catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          toast.error(data.msg);
        } else {
          toast.error("Server Error");
        }
      }
    }
  };

  return (
    <div className="mainCatContainer">
      <AdminList />
      <div className="category-content">
        <form onSubmit={submitForm} className="category-form">
          <div className="category-form-group">
            <label htmlFor="categoryInput" className="category-label">Enter Category</label>
            <input
              type="text"
              placeholder="Category"
              className="category-input"
              id="categoryInput"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
          <button type="submit" className="category-button">Add</button>
        </form>
        <div className="category-list">
          {categories?.map((c, index) => (
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

export default MainCategory;
