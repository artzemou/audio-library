import React, { useState } from 'react';
import useForm from 'react-hook-form'
import { T } from 'react-polyglot-hooks';
const axios = require('axios');

export default function CreateUser(props) {
  const [errors, setErrors] = useState([])
  const { register, handleSubmit } = useForm()
  const onSubmit = (input, e) => {
    const {firstName, name, email, password, pwdConfirm} = input
    axios({
      method: 'post',
      url: `${process.env.REACT_APP_URI}/user`,
      data: {
        firstName,
        name,
        email,
        password,
        pwdConfirm,
      }
    })
      .then(function (response) {
        if(response.data.error) setErrors(response.data.errors)
        e.target.reset()
        props.getUsers()
      })
      .catch(function (error) {
        console.log(error);
      })

  }
  
  return (
    <>
      {errors.length > 0 ? (<ul className="Sign-up-errors">
        {errors.map((error, i) => (<li key={i}>{error}</li>))}

      </ul>) : null}
      <form onSubmit={handleSubmit(onSubmit)} className="Sign-up-form">
        <input
          id="firstName"
          name="firstName"
          placeholder={<T phrase="firstName" />}
          ref={register}
        />
        <input
          id="name"
          name="name"
          placeholder="Nom"
          ref={register}
        />
        <input
          id="email"
          name="email"
          placeholder="Email"
          ref={register}
        />
        <input
          autoComplete="false"
          id="password"
          name="password"
          type="password"
          placeholder="Mot de passe"
          ref={register}
        />
        <input
          autoComplete="false"
          id="pwdConfirm"
          name="pwdConfirm"
          type="password"
          placeholder="Confirmation du mot de passe"
          ref={register}
        />
        <button type="submit"><i className="material-icons">refresh</i></button>
      </form>
    </>
  )
}

