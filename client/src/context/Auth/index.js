import React, { useState, useEffect } from "react";
import Context from "./auth";

const AuthContext = props => {
const [token, setToken] = useState(null);
const [isAuthenticated, setIsAuthenticated] = useState(false);

useEffect(() => {
  if(sessionStorage.getItem("token")) {
    setToken(sessionStorage.getItem("token"))
  }
}, []);

useEffect(() => {
  setIsAuthenticated(token  ? true : false)
}, [token ]);

return (
    <Context.Provider
      value={{
        isAuthenticated,
        token: sessionStorage.getItem("token") ? sessionStorage.getItem("token") : token,
        setToken
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default AuthContext;