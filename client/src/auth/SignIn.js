import React, { useContext } from "react";

import AuthContext from "../context/Auth/auth";
import { T } from "react-polyglot-hooks";
import axios from "axios";
import useForm from "react-hook-form";

export default function SignIn() {
  // const [errors, setErrors] = useState([]);
  const { register, handleSubmit } = useForm();
  const {isAuthenticated, setToken} = useContext(AuthContext);
  const onSubmit = (input, e) => {
    const { email, password } = input;
    axios({
      method: "post",
      url: `${process.env.REACT_APP_URI}/user/signIn`,
      data: {
        email,
        password,
      },
    })
      .then((response) => {
        console.log(response);
        // if (response.data.error) setErrors(response.data.errors);
        setToken(response.data.token);
        sessionStorage.setItem("token", response.data.token);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      {/* {errors.length > 0 ? (<ul className="Sign-up-errors">
        {errors.map((error, i) => (<li key={i}>{error}</li>))}
      </ul>) : null} */}
      {!isAuthenticated && (
        <form onSubmit={handleSubmit(onSubmit)} className="Sign-up-form">
          <input id="email" name="email" placeholder="email" ref={register} />
          <input
            autoComplete="false"
            id="password"
            name="password"
            type="password"
            placeholder="Mot de passe"
            ref={register}
          />
          <button type="submit">
            <T phrase="signIn" />
          </button>
        </form>
      )}
    </>
  );
}
