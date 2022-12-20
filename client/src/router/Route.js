import React from "react";

function Route({ route, name }) {
  return <main className={name}>{route}</main>;
}

export default Route;
