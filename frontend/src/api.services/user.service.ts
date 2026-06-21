import axios from "axios"
import {
  ChangeEmailPayload,
  ChangePasswordPayload,
  DeleteAccountPayload,
  OtpDisablePayload,
  OtpDisableResponse,
  OtpSetupPayload,
  OtpSetupResponse,
  OtpVerifyResponse,
  StatusMessageResponse,
  UpdateProfilePayload,
  UserSchema,
} from "../schemas/user.schema"

const baseURL: string = import.meta.env.VITE_BACKEND_API_URL as string

type BackendUser = {
  uuid: string
  avatar?: string
  first_name?: string
  last_name?: string
  email: string
  email_verified?: boolean
  phone?: string
  birthday?: string
  language?: string
  provider?: string
  otp_enabled?: boolean
  otp_verified?: boolean
  is_active?: boolean
  is_manager?: boolean
  is_developer?: boolean
}

const normalizeUser = (user: BackendUser): UserSchema => ({
  uuid: user.uuid,
  avatar: user.avatar,
  first_name: user.first_name,
  last_name: user.last_name,
  email: user.email,
  email_verified: user.email_verified,
  phoneNumber: user.phone,
  birthday: user.birthday,
  language: user.language,
  provider: user.provider,
  otp_enabled: user.otp_enabled,
  otp_verified: user.otp_verified,
  is_active: user.is_active,
  is_manager: user.is_manager,
  is_developer: user.is_developer,
})

class UserService {
  async getProfile(): Promise<UserSchema> {
    const response = await axios.get<BackendUser>(`${baseURL}/read_me`)
    return normalizeUser(response.data)
  }

  async updateProfile(profile: UpdateProfilePayload): Promise<UserSchema> {
    const response = await axios.patch<BackendUser>(`${baseURL}/update_me`, profile)
    return normalizeUser(response.data)
  }

  async changePassword(payload: ChangePasswordPayload): Promise<StatusMessageResponse> {
    const response = await axios.post<StatusMessageResponse>(`${baseURL}/change_password`, payload, { withCredentials: true })
    return response.data
  }

  async changeEmail(payload: ChangeEmailPayload): Promise<StatusMessageResponse> {
    const response = await axios.post<StatusMessageResponse>(`${baseURL}/change_email`, payload, { withCredentials: true })
    return response.data
  }

  async generateOtp(payload: OtpSetupPayload): Promise<OtpSetupResponse> {
    const response = await axios.post<OtpSetupResponse>(`${baseURL}/otp/generate`, payload)
    return response.data
  }

  async verifyOtp(token: string): Promise<OtpVerifyResponse> {
    const response = await axios.post<OtpVerifyResponse>(`${baseURL}/otp/verify`, { token })
    return response.data
  }

  async disableOtp(payload: OtpDisablePayload): Promise<OtpDisableResponse> {
    const response = await axios.post<OtpDisableResponse>(`${baseURL}/otp/disable`, payload)
    return response.data
  }

  async getUsers(): Promise<Array<UserSchema>> {
    const response = await axios.get(`${baseURL}/users`)
    return response.data
  }

  async deleteSelf(payload: DeleteAccountPayload): Promise<StatusMessageResponse> {
    const response = await axios.delete<StatusMessageResponse>(`${baseURL}/delete_me`, {
      data: payload,
      withCredentials: true,
    })
    return response.data
  }
}

export default new UserService()
