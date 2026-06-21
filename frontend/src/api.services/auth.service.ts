import axios from 'axios'
import { clearAccessToken, setAccessToken } from '../authToken'
import { 
  // UserSchema,
  UserLoginSchema,
  UserRegisterSchema,
} from '../schemas/user.schema'

const baseURL: string = import.meta.env.VITE_BACKEND_API_URL as string

export type AuthLoginResult = {
  access_token?: string
  token_type: string
  requires_otp?: boolean
}

type ForgotPasswordPayload = {
  email: string
}

type ResendVerificationPayload = {
  email: string
}

type ResetPasswordPayload = {
  password: string
  passwordConfirm: string
}

const sanitizeNextPath = (nextPath?: string) => {
  if (!nextPath || !nextPath.startsWith('/') || nextPath.startsWith('//')) {
    return '/'
  }
  return nextPath
}

class AuthService {
  async register(registerData: UserRegisterSchema) {
    const response = await axios.post(baseURL + '/register', registerData)
    return response.data
  }

  async login(loginData: UserLoginSchema): Promise<AuthLoginResult> {
    clearAccessToken()
    const response = await axios.post<AuthLoginResult>(
      baseURL + '/login/access-token',
      loginData,
      { withCredentials: true }
    )
    if (response.data.access_token) {
      setAccessToken(response.data.access_token)
    } else {
      clearAccessToken()
    }
    return response.data
  }

  async refreshToken() {
    const response = await axios.post(baseURL + '/login/refresh-token', undefined, { withCredentials: true })
    if (response.data.access_token) {
      setAccessToken(response.data.access_token)
    }
    return response.data
  }

  async logout() {
    await axios.post(baseURL + '/logout', undefined, { withCredentials: true })
    clearAccessToken()
  }

  async validateOtp(token: string) {
    const response = await axios.post<AuthLoginResult & { otp_valid: boolean }>(
      baseURL + '/otp/validate',
      { token },
      { withCredentials: true }
    )
    if (response.data.access_token) {
      setAccessToken(response.data.access_token)
    }
    return response.data
  }

  async forgotPassword(data: ForgotPasswordPayload) {
    const response = await axios.post(baseURL + '/forgot_password', data)
    return response.data
  }

  async resendVerification(data: ResendVerificationPayload) {
    const response = await axios.post(baseURL + '/resend_verification', data)
    return response.data
  }

  async resetPassword(resetCode: string, data: ResetPasswordPayload) {
    const response = await axios.patch(baseURL + `/resetpassword/${resetCode}`, data)
    return response.data
  }

  async verifyEmail(verificationCode: string) {
    const response = await axios.get(baseURL + `/verify_email/${verificationCode}`)
    return response.data
  }

  getGoogleLoginUrl(nextPath?: string) {
    const params = new URLSearchParams({ next: sanitizeNextPath(nextPath) })
    return `${baseURL}/login/google?${params.toString()}`
  }
}

export default new AuthService()
