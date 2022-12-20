import React, { useCallback, useContext, useEffect, useState } from "react";

import AuthContext from "../context/Auth/auth";
import CreateUser from "./CreateUser";
import UpdateUser from "./UpdateUser";
import axios from "axios";

function UsersList() {
  const {token} = useContext(AuthContext);

  const [users, setUsers] = useState([]);

  const getUsers = useCallback(() => {
    axios
      .get(`${process.env.REACT_APP_URI}/user/`, {
        headers: { "x-access-token": token },
      })
      .then(function (response) {
        // handle success
        setUsers(response.data.results);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  },
  [token],);

  const onDelete = (id) => {
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_URI}/user`,
      data: {
        id,
      },
    })
      .then(function (response) {
        console.log(response.data.message);
        getUsers();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <>
      <h3>Créer un nouvel utilisateur</h3>
      <ul className="Create-user-form">
        <li>
          <ul className="User-item">
            <li>
              <CreateUser getUsers={getUsers} />
            </li>
          </ul>
        </li>
      </ul>
      <h3>Liste utilisateurs</h3>
      <ul className="Users-list">
        {users.map((user, i) => (
          <li key={user.id} className="User-item">
            <ul className="User-item-content">
              <UpdateUser user={user} />
            </ul>
            <ul className="Tool-bar">
              <li>
                <a href={`/dashboard/user/${user.id}`}>
                  <i className="material-icons">link</i>
                </a>
              </li>
              <li onClick={() => onDelete(user.id)}>
                <i className="material-icons">delete_outline</i>
              </li>
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}

export default UsersList;
