import React, { useContext } from 'react'

import AuthContext from '../context/Auth/auth'
import LocaleSelect from '../locales/LocaleSelect'
import SignIn from '../auth/SignIn'
import SignOut from '../auth/SignOut'
import { T } from "react-polyglot-hooks";

export default function DashboardNav() {
  const { isAuthenticated } = useContext(AuthContext)
  return (
    <>
    <LocaleSelect />
          <SignIn></SignIn>
          <SignOut></SignOut>
          <nav>
            <ul>
              <li>
                <a href='/'>
                  <T phrase='homepage' />
                </a>
              </li>
              {isAuthenticated && (
                <li>
                  <a href='/dashboard'>
                    <T phrase='dashboard' />
                  </a>
                </li>
              )}
            </ul>
          </nav>
    </>
  );
}
