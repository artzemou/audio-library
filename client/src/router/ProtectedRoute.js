import React, { useContext } from "react";

import AuthContext from "../context/Auth/auth";
import DashboardNav from "./DashboardNav";
import { T } from 'react-polyglot-hooks';

function ProtectedRoute({route, name}) {
  const {isAuthenticated} = useContext(AuthContext);
  return (
    <>
      {!isAuthenticated ? (
      <T phrase="mustBeConnected" />
      ) : (
        <main className={name}>
          <DashboardNav></DashboardNav>
          {route}
        </main>
      )}

    </>
  );
}

export default ProtectedRoute;
