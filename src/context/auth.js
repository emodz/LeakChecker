import { createContext, useContext } from 'react'

export const AuthContext = createContext()

// Create auth provider
export function useAuth() {
  return useContext(AuthContext)
}
