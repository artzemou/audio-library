import React, { useContext } from "react";
import useForm from "react-hook-form";
import AuthContext from "../context/Auth/auth";
import { T } from "react-polyglot-hooks";

export default function SignOut() {
  const { handleSubmit } = useForm();
  const {isAuthenticated, setToken } = useContext(AuthContext);

  const onSubmit = (input) => {
    sessionStorage.removeItem("token");
    setToken(null);
  };
  return (
    <>
      {isAuthenticated && (
        <form onSubmit={handleSubmit(onSubmit)} className="Sign-up-form">
          <button type="submit">
            <T phrase="signOut" />
          </button>
        </form>
      )}
    </>
  );
}
