import React, { useEffect, useState } from 'react'
import AdminList from './AdminList';
import { useAuth } from '../../Contexts/auth';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminAccount = () => {

  const { auth, setAuth } = useAuth();
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: auth?.user?.name || "",
    email: auth?.user?.email || "",
    phone: auth?.user?.phone || "",
    address: auth?.user?.address || ""
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }


  useEffect(() => {
    setFormData({
      name: auth?.user?.name || "",
      email: auth?.user?.email || "",
      phone: auth?.user?.phone || "",
      address: auth?.user?.address || ""
    });
  }, [auth]);


  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phone, address } = formData;

    if (!name || !email || !phone || !address) {
      return setError("Fields Cannot be Empty");
    }

    try {
      const response = await axios.put("http://localhost:4000/api/v1/edit-profile", formData,
        {
          headers:
          {
            Authorization: auth?.token,
          },
        });

      if (response.data.success) {
        toast.success("Profile Updated Successfully");

        setAuth({
          user: response.data.data,
          token: response.data.token
        });
        localStorage.setItem('Token', response.data.token);
      }

    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        toast.error(data.msg);
      } else {
        toast.error("An Error Occurred");
      }
    }

    setFormData({
      name: auth?.user?.name || "",
      email: auth?.user?.email || "",
      phone: auth?.user?.phone || "",
      address: auth?.user?.address || ""
    });

  }

  return (
    <>
      <div className="adminAccountContainer">
        <div className="adminListAccount">
          <AdminList />
        </div>
        <div className="adminProfile">
          <div className="adminProfileForm">
            <input disabled type="text" name="name" placeholder="Name" value={formData.name} onChange={handleOnChange} />
            <input disabled type="email" name="email" placeholder="Email" value={formData.email} onChange={handleOnChange} />
            <input type="text" name="phone" required placeholder="Phone" value={formData.phone} onChange={handleOnChange} />
            <input type="text" name="address" required placeholder="Complete Address" value={formData.address} onChange={handleOnChange} />
            <button onClick={handleOnSubmit}>Update</button>
          </div>
        </div>
      </div>

    </>
  )
}
export default AdminAccount;