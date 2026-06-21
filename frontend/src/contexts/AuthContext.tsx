import {
  createContext,
  FC,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react"
import userService from "../api.services/user.service"
import authService from "../api.services/auth.service"
import {
  UserSchema,
  UserLoginSchema,
  UserRegisterSchema,
} from "../schemas/user.schema"
import type { AuthLoginResult } from "../api.services/auth.service"
import Spinner from "../components/Spinner"

type AuthContextType = {
  currentUser: UserSchema | undefined
  setCurrentUser: (user: UserSchema | undefined) => void
  error: any
  setError: any
  loading: boolean // Add loading status here
  register: (data: UserRegisterSchema) => any
  login: (data: UserLoginSchema) => Promise<AuthLoginResult>
  validateOtp: (token: string) => Promise<void>
  logout: () => Promise<void>
  // updateUserProfile: any;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

interface AuthContextProviderProps {
  children: ReactNode
}

const AuthProvider: FC<AuthContextProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserSchema>()
  const [loading, setLoading] = useState(true) // Add loading state
  const [error, setError] = useState("")

  // Check if there is a currently active session
  // when the provider is mounted for the first time.
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const user = await userService.getProfile()
        setCurrentUser(user)
      } catch (error: any) {
        const status = error?.response?.status
        if (status === 401 || status === 403) {
          try {
            await authService.refreshToken()
            const user = await userService.getProfile()
            setCurrentUser(user)
          } catch {
            setCurrentUser(undefined)
          }
        } else {
          setCurrentUser(undefined)
        }
      } finally {
        setLoading(false) // Set loading to false when done
      }
    }
    void fetchUserProfile()
  }, [])

  const register = (data: UserRegisterSchema) => {
    return authService.register(data)
  }

  const login = async (data: UserLoginSchema) => {
    setLoading(true) // Set loading to true when starting the login process
    try {
      const authResult = await authService.login(data)
      if (authResult.requires_otp) {
        setCurrentUser(undefined)
        return authResult
      }
      const user = await userService.getProfile()
      setCurrentUser(user)
      return authResult
    } finally {
      setLoading(false) // Set loading to false after fetching user profile
    }
  }

  const validateOtp = async (token: string) => {
    setLoading(true)
    try {
      await authService.validateOtp(token)
      const user = await userService.getProfile()
      setCurrentUser(user)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true) // Set loading to true when starting the logout process
    return authService.logout().finally(() => {
      setCurrentUser(undefined)
      setLoading(false) // Set loading to false after logging out
    })
  }

  // const updateUserProfile = (user, profile) => {
  //   return updateProfile(user, profile);
  // }

  const value = {
    currentUser,
    setCurrentUser,
    error,
    setError,
    loading, // Return loading status
    login,
    register,
    validateOtp,
    logout,
    // updateUserProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="flex min-h-screen items-center justify-center">
          <Spinner width={10} height={10} />
        </div>
      )}
    </AuthContext.Provider>
  )
}

const useAuth = (): AuthContextType => {
  return useContext(AuthContext)
}

export { AuthProvider, useAuth }
