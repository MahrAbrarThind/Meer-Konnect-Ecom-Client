import axios from "axios"

export const getProductsForSubCat=async(name)=>{
    try {
        const response=await axios.get(`https://meer-kennect-ecom-server.vercel.app/api/v1/getProducts_forSubCat/${name}`);
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
        const response=await axios.get(`https://meer-kennect-ecom-server.vercel.app/api/v1/getProducts_forMainCat/${name}`);
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
        const response=await axios.get(`https://meer-kennect-ecom-server.vercel.app/api/v1/get-all-products`);
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
        const response=await axios.get(`https://meer-kennect-ecom-server.vercel.app/api/v1/get-single-product/${id}`);
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
        const response=await axios.get(`https://meer-kennect-ecom-server.vercel.app/api/v1/get-related-products/${id}`);
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

export const getFeaturedProducts=async(id)=>{

    try {
        const response=await axios.get(`https://meer-kennect-ecom-server.vercel.app/api/v1/get-featured-products`);
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

export const getClothesProducts=async(id)=>{

    try {
        const response=await axios.get(`https://meer-kennect-ecom-server.vercel.app/api/v1/get-clothes-products`);
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

export const getBagsProducts=async(id)=>{

    try {
        const response=await axios.get(`https://meer-kennect-ecom-server.vercel.app/api/v1/get-bags-products`);
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