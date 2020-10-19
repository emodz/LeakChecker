import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from '../context/auth'
import Spinner from './Spinner.js'
import logo from '../logo.svg'
import './Dashboard.scss'

// This component contains the Dashboard, given more time it would be split into smaller components
const Dashboard = () => {
  const [searchInput, setSearchInput] = useState('')
  const [fieldActive, setFieldActive] = useState(false)
  const [example, setExample] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedField, setSelectedField] = useState('')
  const [selectedLeak, setSelectedLeak] = useState('')
  const [leakData, setLeakData] = useState([])
  const [error, setError] = useState(false)
  const [prevInput, setPrevInput] = useState('')
  const { setAuthTokens, authTokens } = useAuth()

  // Clear auth tokens from cache
  const logOut = () => {
    setAuthTokens(null)
  }

  // Submit search input to api
  const submitSearch = () => {
    setLoading(true)
    // Make a request to node server as a proxy to API
    axios
      .get('/api/search', {
        params: {
          token: authTokens,
          selectedField: selectedField,
          searchInput: searchInput
        }
      })
      .then(result => {
        setLoading(false)
        // Should put into context
        setLeakData(result.data)
      })
      .catch(error => {
        setLoading(false)
        setLeakData([])
        // Previous input to be used for error message
        setPrevInput(searchInput)
        setError(true)
      })
  }

  const handleChange = event => {
    setSelectedField(event.target.value)
  }

  // Effect to submit search once example is set to true
  useEffect(() => {
    if (example) {
      submitSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [example])

  // Populate example search
  const handleExample = () => {
    setSelectedField('domain')
    setSearchInput('example.com')
    setExample(true)
  }

  // Sets the selected leak
  const selectLeak = leakName => {
    // Due to the limited data for email leaks, only domains are handled
    if (selectedField === 'domain') {
      setSelectedLeak(leakName)
    }
  }

  // Welcome & Error message, updates when there are changes in loading, example, prevInput, and error states
  const welcomeMessage = useCallback(() => {
    return (
      <>
        <div className="dashboardHeader">
          {error ? `No results for ${prevInput}...` : 'Welcome to Leak Checker'}
        </div>
        <div className="welcomeText">
          {error
            ? `Unable to find results for the entered field. Please try again or use the button below for an example`
            : `Please use the searchbar above to check for a data leak. You can select
        to search for both compromised emails and domains. If you don't have a
        domain in mind, use the example button below to preview.`}
        </div>
        <div className="buttonContainer">
          {!loading || !example ? (
            <button
              onClick={e => {
                handleExample(e)
              }}
              className="exampleButton"
            >
              Example Search
            </button>
          ) : (
            <Spinner name="example" />
          )}
        </div>
      </>
    )
  }, [loading, example, prevInput, error])
  
  // Content if data is successfully found, updated only if data updates
  // Ideally would add in pagination with more time
  const dataContent = useCallback(() => {
    let selectedLeakData =
      leakData && selectedField === 'domain'
        ? leakData.filter(obj => obj['name'] === selectedLeak)[0]
        : null
    return (
      <>
        <div className="dashboardHeader">
          {selectedLeakData ? (
            <>
              Compromised data for
              <span> {selectedLeak}</span>
              <button className="back" onClick={() => setSelectedLeak(null)}>Back</button>
            </>
          ) : (
            <>
              {`${leakData.length} leaks found for `}
              <span>{searchInput}</span>
            </>
          )}
        </div>
        {selectedLeakData
          ? selectedLeakData.emails.map((email, index) => (
              <div key={index} className="leakRow">
                {email.email}
              </div>
            ))
          : leakData.map(leak => (
              <button
                key={leak.name}
                className="leakRow"
                onClick={() => selectLeak(leak.name)}
              >
                <div className="leakName" alt="Leak Name">
                  {leak.name}
                </div>
                {selectedField === 'domain' ? (
                  <div className="leakCount" alt="Leak Count">
                    {leak.emails.length} email
                    {leak.emails.length > 1 ? 's' : ''}
                  </div>
                ) : null}
              </button>
            ))}
      </>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leakData, selectedLeak])

  return (
    <div>
      <div className="header">
        <div className="headerInner">
          <a href="/">
            <div className="logoContainer">
              <img src={logo} className="logoImage" alt="logo" />
              <div className="logoText">Leak Checker</div>
            </div>
          </a>
          <div
            className={`searchBar${fieldActive ? ' fieldActive' : ''}`}
            onFocus={() => setFieldActive(true)}
            onBlur={() => setFieldActive(false)}
          >
            <form
              onSubmit={e => {
                setExample(false)
                submitSearch(e)
                e.preventDefault()
              }}
              alt="Search Bar"
            >
              <select
                className="searchToggle"
                value={selectedField}
                onChange={e => handleChange(e)}
                alt="Search Type"
              >
                <option value="" defaultValue>
                  Select
                </option>
                <option value="email">Email</option>
                <option value="domain">Domain</option>
              </select>
              <input
                type={selectedField}
                className="searchInput"
                alt="Search input"
                onChange={e => setSearchInput(e.target.value)}
                value={searchInput}
                placeholder={
                  !selectedField
                    ? 'Please select a type before searching'
                    : `Search for a compromised ${selectedField}`
                }
                disabled={!selectedField}
              />
            </form>
            {loading && !example ? <Spinner name="search" /> : null}
          </div>
          <button onClick={logOut} className="logOut" alt="Log out">
            Log out
          </button>
        </div>
      </div>
      <div className="dashboardContainer">
        <div className="dashboardContent">
          {leakData.length ? dataContent() : welcomeMessage()}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
