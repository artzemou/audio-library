import React, { useContext, useEffect, useState }from 'react'

import AuthContext from "../context/Auth/auth"
import axios  from 'axios'

export default function User(props) {
  const context = useContext(AuthContext)

  let [user, setUser] = useState({})
  let [forbidden, setForbidden] = useState(null)
  useEffect(() => {
    axios.get(
      `${process.env.REACT_APP_URI}/user/${props.userId}`,
      {
        headers: {
        'x-access-token': context.token
        }
      })
    .then( (response) => {
      // handle success
      console.log(response)
      setUser(response.data.result)
    })
    .catch( (error) => {
      // handle error
      console.log(error.response)
      setForbidden(error.response.data.message)
    })
  }, [context, props.userId])

  const { firstName, name, email} = user
  if (forbidden) return (<div>{forbidden}</div>)
  return (
    <section>

      <ul className="User-details">
        <li className="User-detail">Prénom: {firstName}</li>
        <li className="User-detail">Nom: {name}</li>
        <li className="User-detail">Email: {email}</li>
      </ul>
    </section>
  )
}

