import AudioFile from "../audio/AudioFile";
import AudioLibrary from "../audio/AudioLibrary";
import Dashboard from "../templates/admin/Dashboard";
import HomePage from "../templates/HomePage";
import Micro from "../audio/Micro";
import ProtectedRoute from "./ProtectedRoute";
import Radio from "../audio/Radio";
import React from "react";
import Route from "./Route";
import { T } from 'react-polyglot-hooks'
import Upload from "../audio/Upload";
import User from "../users/User";
import UsersList from "../users/UsersList";

const routes = {
  "/": () => <Route route={<HomePage />} />,
  "/dashboard": () => <ProtectedRoute route={<Dashboard />} />,
  "/dashboard/users": () => <ProtectedRoute name={"UsersList"} route={<UsersList />} />,
  "/dashboard/user/:id": ({ id }) => (
    <ProtectedRoute name={"User"} route={<User userId={id} />} />
  ),
  "/upload-files": () => <ProtectedRoute name={"Upload"} route={<Upload />} />,
  "/micro": () => <ProtectedRoute route={<Micro />} />,
  "/radio": () => <ProtectedRoute name={"Radio"} route={<Radio />} />,
  "/audio-library": () => <ProtectedRoute route={<AudioLibrary />} />,
  "/audio-library/:path": ({ path }) => <ProtectedRoute  route={<AudioFile path={path} />} />,
  "/audio-library/:path/:path": ({ path }) => <ProtectedRoute name={"AudioFile"} route={<AudioFile path={path} />} />,
};

export default routes;
