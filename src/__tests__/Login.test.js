// Adapted from https://github.com/testing-library/react-testing-library
import '@testing-library/jest-dom'
import React from 'react'
// import API mocking utilities from Mock Service Worker.
import { rest } from 'msw'
import { setupServer } from 'msw/node'
// import testing utilities
import { render, fireEvent, screen } from '@testing-library/react'
import { AuthContext } from '../context/auth'
import { BrowserRouter } from 'react-router-dom'
import Login from '../Components/Login'

const server = setupServer(
  rest.post('/api/login', (req, res, ctx) => {
    return res(ctx.json({ token: 'fake_user_token' }))
  })
)

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  window.localStorage.removeItem('tokens')
})
afterAll(() => server.close())

test('allows the user to login successfully', async () => {
  render(
    <AuthContext.Provider
      value={{
        authTokens: null,
        setAuthTokens: token =>
          localStorage.setItem('tokens', JSON.stringify(token))
      }}
    >
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </AuthContext.Provider>
  )

  // fill out the form
  fireEvent.change(screen.getByPlaceholderText('email'), {
    target: { value: 'test' }
  })
  fireEvent.change(screen.getByPlaceholderText('password'), {
    target: { value: 'test' }
  })

  fireEvent.click(screen.getByText('Sign In'))

  // just like a manual tester, we'll instruct our test to wait for the alert
  // to show up before continuing with our assertions.
  await screen.getByTestId('loggedIn')
  console.log(screen.getByTestId('loggedIn'))
  // .toHaveTextContent() comes from jest-dom's assertions
  // otherwise you could use expect(alert.textContent).toMatch(/congrats/i)
  // but jest-dom will give you better error messages which is why it's recommended
  expect(window.localStorage.getItem('tokens')).toEqual('fake_user_token')
})

