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