export interface UserSchema {
  uuid: string

  avatar?: string
  first_name?: string
  last_name?: string
  email: string
  email_verified?: boolean
  phoneNumber?: string
  birthday?: string
  country?: string
  
  password?: string
  language?: string
  theme?: string
  haptic?: boolean
  
  provider?: string
  otp_enabled?: boolean
  otp_verified?: boolean
  is_active?: boolean
  is_manager?: boolean
  is_developer?: boolean
}

export interface StatusMessageResponse {
  status: string
  message: string
  requires_reauth?: boolean
}

export interface UpdateProfilePayload {
  first_name?: string
  last_name?: string
  avatar?: string
  phone?: string
  birthday?: string
  language?: string
}

export interface ChangePasswordPayload {
  current_password: string
  new_password: string
  new_password_confirm: string
  otp_token?: string
}

export interface ChangeEmailPayload {
  email: string
  current_password: string
  otp_token?: string
}

export interface OtpSetupResponse {
  base32: string
  otpauth_url: string
}

export interface OtpSetupPayload {
  current_password: string
  otp_token?: string
}

export interface OtpVerifyResponse {
  otp_verified: boolean
}

export interface OtpDisableResponse {
  otp_disabled: boolean
}

export interface OtpDisablePayload {
  current_password: string
  otp_token: string
}

export interface DeleteAccountPayload {
  current_password: string
  otp_token?: string
}

export interface UserLoginSchema {
  email: string
  password: string
}

export interface UserRegisterSchema {
  first_name?: string
  last_name?: string
  email: string
  password: string
}
