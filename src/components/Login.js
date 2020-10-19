import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import logo from '../logo.svg'
import Spinner from './Spinner.js'
import { useAuth } from '../context/auth'
import './Login.scss'

const Login = () => {
  const [isError, setIsError] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuthTokens, authTokens } = useAuth()
  const [didMount, setDidMount] = useState(false); 

  useEffect(() => {
     setDidMount(true);
     return () => setDidMount(false);
  }, [])
  
  if(!didMount) {
    return null;
  }
  

  // Submit login credentials to api
  const postLogin = event => {
    event.preventDefault()
    setLoading(true)
    axios
      .post('/api/login', {
        email,
        password
      })
      .then(result => {
        if (result.status === 200) {
          setAuthTokens(result.data.token)
        } else {
          setIsError(result.status)
        }
      })
      .catch(error => {
        setIsError(error.response.status)
      })
  }

  // If successful login or existing token, redirect to dashboard
  if (authTokens) {
    return <Redirect to="/" />
  }

  // 400 Status is incorrect password 404 is incorrect email, otherwise generic error
  const errorMessage = isError ? (
    <div className="error">Error, please try again</div>
  ) : null

  return (
    <div className="login">
      <div className="logoContainer">
        <img src={logo} className="logoImage" alt="logo" />
        <div className="logoText">Leak Checker</div>
      </div>
      <form>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={e => {
            setEmail(e.target.value)
          }}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={e => {
            setPassword(e.target.value)
          }}
        />
        {errorMessage}
        <div className="buttonContainer">
          {loading && !isError ? (
            <Spinner />
          ) : (
            <button disabled={!password || !email} onClick={e => postLogin(e)}>
              Sign In
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default Login
