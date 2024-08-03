import { createContext, useContext, useEffect, useState } from "react";


const cartContext=createContext();

const CartProvider=({children})=>{

    const [cart,setCart]=useState([]);

    useEffect(()=>{
       const cartData=JSON.parse(localStorage.getItem('cart'));
       if(cartData){
           setCart(cartData);
       } 
    },[]);

    return (
        <cartContext.Provider value={{cart,setCart}}>
            {children}
        </cartContext.Provider>
    )

}

const useCart=()=>{
    return useContext(cartContext);
}

export {useCart,CartProvider};