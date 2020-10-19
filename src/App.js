import React, { useState } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { AuthContext } from './context/auth'
import './App.scss'

const App = () => {
  const existingTokens = JSON.parse(localStorage.getItem('tokens'))
  const [authTokens, setAuthTokens] = useState(existingTokens)

  // Set Provider function
  const setTokens = data => {
    localStorage.setItem('tokens', JSON.stringify(data))
    setAuthTokens(data)
  }

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <Router>
        <div className="app">
          <Route path="/login" component={Login} />
          <PrivateRoute path="/" component={Dashboard} />
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
