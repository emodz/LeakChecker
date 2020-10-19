import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from './context/auth'

function PrivateRoute({ component: Component, ...rest }) {
  const { authTokens } = useAuth()

  // Private route only accessible if authorized
  return (
    <Route
      {...rest}
      render={props =>
        authTokens ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  )
}

export default PrivateRoute
