import { createContext, useContext, useState } from "react";

const stateContext=createContext();

const urlStateContextProvider=({children}){
    const [state,setState]=useState();
    return(
        <stateContext.Provider value={state,setState}>
        {children}
        </stateContext.Provider>
    )
}

const useStateContext=()=>{
    return useContext(stateContext);
}

export {useStateContext}