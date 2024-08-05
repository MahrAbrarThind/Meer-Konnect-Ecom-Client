import axios from "axios"

export const getProductsForSubCat=async(name)=>{
    try {
        const response=await axios.get(`http://localhost:4000/api/v1/getProducts_forSubCat/${name}`);
        if(response.data.success){
            return response.data || [];
        }
    } catch (error) {
        if(error.response){
            return{
                error:{
                    status:error.response.status,
                    msg:error.response.data.msg
                }
            }
        }else{
            return {
                error: {
                    msg: "Server Error",
                    status: 500
                }
            };
        }
    }
}

export const getProductsForMainCat=async(name)=>{
    try {
        const response=await axios.get(`http://localhost:4000/api/v1/getProducts_forMainCat/${name}`);
        if(response.data.success){
            return response.data || [];
        }
    } catch (error) {
        if(error.response){
            return{
                error:{
                    status:error.response.status,
                    msg:error.response.data.msg
                }
            }
        }else{
            return {
                error: {
                    msg: "Server Error",
                    status: 500
                }
            };
        }
    }
}

export const getAllProducts=async()=>{
    try {
        const response=await axios.get(`http://localhost:4000/api/v1/get-all-products`);
        if(response.data.success){
            return response.data || [];
        }
    } catch (error) {
        if(error.response){
            return{
                error:{
                    status:error.response.status,
                    msg:error.response.data.msg
                }
            }
        }else{
            return {
                error: {
                    msg: "Server Error",
                    status: 500
                }
            };
        }
    }
}

export const getSingleProduct=async(id)=>{

    try {
        const response=await axios.get(`http://localhost:4000/api/v1/get-single-product/${id}`);
        if(response.data.success){
            return response.data || [];
        }
    } catch (error) {
        if(error.response){
            return{
                error:{
                    status:error.response.status,
                    msg:error.response.data.msg
                }
            }
        }else{
            return {
                error: {
                    msg: "Server Error",
                    status: 500
                }
            };
        }
    }
}

export const getRelatedProducts=async(id)=>{

    try {
        const response=await axios.get(`http://localhost:4000/api/v1/get-related-products/${id}`);
        if(response.data.success){
            return response.data || [];
        }
    } catch (error) {
        if(error.response){
            return{
                error:{
                    status:error.response.status,
                    msg:error.response.data.msg
                }
            }
        }else{
            return {
                error: {
                    msg: "Server Error",
                    status: 500
                }
            };
        }
    }

}