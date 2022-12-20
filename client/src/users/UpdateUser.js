import React, { useState }from 'react'
import useForm from 'react-hook-form'
import axios from 'axios'

export default function CreateUser(props) {
  const [errors, setErrors] = useState([])
  const { register, handleSubmit } = useForm()

  const onSubmit = (input, e) => {
    const {firstName, name, email} = input
    axios({
      method: 'put',
      url: `${process.env.REACT_APP_URI}/user`,
      data: {
        id: props.user.id,
        firstName,
        name,
        email,
        
      }
    })
      .then(function (response) {
        console.log(response)
        if(response.data.error) setErrors(response.data.errors)
      })
      .catch(function (error) {
        console.log(error);
      })

  }
  const {firstName, name, email} = props.user

  return (
    <>
      {errors.length > 0 ? (<ul className="Sign-up-errors">
        {errors.map((error, i) => (<li key={i}>{error}</li>))}

      </ul>) : null}
      <form onSubmit={handleSubmit(onSubmit)} className="Sign-up-form">
        <input
          id="firstName"
          name="firstName"
          defaultValue={firstName}
          ref={register}
        />
        <input
          id="name"
          name="name"
          defaultValue={name}
          ref={register}
        />
        <input
          id="email"
          name="email"
          defaultValue={email}
          ref={register}
        />

        <button type="submit"><i className="material-icons">refresh</i></button>
      </form>
    </>
  )
}

