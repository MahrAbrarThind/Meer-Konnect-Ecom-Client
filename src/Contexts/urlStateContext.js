import { createContext, useContext, useState } from "react";

const StateContext = createContext();

const UrlStateContextProvider = ({ children }) => {
    const [routeState, setRouteState] = useState();
    return (
        <StateContext.Provider value={{ routeState, setRouteState }}>
            {children}
        </StateContext.Provider>
    );
};

const useStateContext = () => {
    return useContext(StateContext);
};

export { UrlStateContextProvider, useStateContext };
