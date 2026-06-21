import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Switch } from "@headlessui/react"
import {
  PencilSquareIcon,
  CloudArrowUpIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid"
import { SunIcon, MoonIcon, StopCircleIcon } from "@heroicons/react/24/outline" // Import the icons
import { toast } from "react-toastify"

import userService from "../../api.services/user.service"
import { clearAccessToken } from "../../authToken"
import { useAuth } from "../../contexts/AuthContext"
import { useTheme } from "../../contexts/ThemeContext" // Import the ThemeContext
import SubHomeHeader from "../../components/SubHomeHeader"
import LanguagesDropdown from "../../components/LanguagesDropdown"
import FooterMark from "../../components/FooterMark"

type Language = {
  code: string // Language code (e.g., "en")
  name: string // Language name in English (e.g., "English")
  local_name: string // Language name in the native language (e.g., "English")
  countries: string[] // Array of country codes where the language is spoken (e.g., ["GB", "US"])
}

export default function Settings() {
  const navigate = useNavigate()
  const { currentUser, logout, setCurrentUser } = useAuth()
  const { theme, setTheme } = useTheme() // Use the ThemeContext
  const [hapticFeedback, setHapticFeedback] = useState<boolean>(false)
  const [language, setLanguage] = useState<Language | null>(null)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    otpToken: "",
  })
  const [isEditingPassword, setIsEditingPassword] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("")
  const [savingPassword, setSavingPassword] = useState(false)
  const [deleteForm, setDeleteForm] = useState({
    currentPassword: "",
    otpToken: "",
  })
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [otpSetup, setOtpSetup] = useState<{ base32: string; otpauthUrl: string } | null>(null)
  const [otpToken, setOtpToken] = useState("")
  const [otpCurrentPassword, setOtpCurrentPassword] = useState("")
  const [otpCurrentCode, setOtpCurrentCode] = useState("")
  const [otpLoading, setOtpLoading] = useState(false)
  const passwordInputRef = useRef<HTMLInputElement | null>(null)

  const refreshCurrentUser = async () => {
    const user = await userService.getProfile()
    setCurrentUser(user)
  }

  const handleThemeChangeWrapper = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme) // Update the theme using context
    setMessage(`Theme changed to: ${newTheme}`)
    setTimeout(() => setMessage(""), 3000)
  }

  const handleHapticToggle = () => {
    setHapticFeedback(!hapticFeedback)
    setMessage("Haptic feedback setting successfully saved.")
    setTimeout(() => setMessage(""), 3000)
  }

  const handlePasswordSave = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirmation must match.")
      return
    }
    if (currentUser?.otp_enabled && !passwordForm.otpToken.trim()) {
      toast.error("Enter your authenticator code to change your password.")
      return
    }

    setSavingPassword(true)
    try {
      const response = await userService.changePassword({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
        new_password_confirm: passwordForm.confirmPassword,
        otp_token: passwordForm.otpToken.trim() || undefined,
      })
      setIsEditingPassword(false)
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        otpToken: "",
      })
      setMessage(response.message)
      toast.success(response.message)
      if (response.requires_reauth) {
        await logout()
        navigate("/login")
        return
      }
      setTimeout(() => setMessage(""), 3000)
    } catch (error: any) {
      const responseMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update password."
      toast.error(responseMessage)
    } finally {
      setSavingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!deleteForm.currentPassword.trim()) {
      toast.error("Current password is required to delete your account.")
      return
    }
    if (currentUser?.otp_enabled && !deleteForm.otpToken.trim()) {
      toast.error("Enter your authenticator code to delete your account.")
      return
    }

    setDeletingAccount(true)
    try {
      const response = await userService.deleteSelf({
        current_password: deleteForm.currentPassword.trim(),
        otp_token: deleteForm.otpToken.trim() || undefined,
      })
      clearAccessToken()
      setCurrentUser(undefined)
      toast.success(response.message)
      navigate("/login")
    } catch (error: any) {
      const responseMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete account."
      toast.error(responseMessage)
    } finally {
      setDeletingAccount(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      void handlePasswordSave()
    }
  }

  const handleBlur = () => {
    return
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleEditClick = () => {
    setIsEditingPassword(true)
    setTimeout(() => {
      passwordInputRef.current?.focus()
    }, 100)
  }

  const handleLanguageChange = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage)
    setMessage(`Language changed to: ${selectedLanguage.name}`)
    setTimeout(() => setMessage(""), 3000)
  }

  const handleOtpSetup = async () => {
    if (!otpCurrentPassword.trim()) {
      toast.error("Current password is required to set up two-factor authentication.")
      return
    }

    setOtpLoading(true)
    try {
      const response = await userService.generateOtp({
        current_password: otpCurrentPassword.trim(),
        otp_token: currentUser?.otp_enabled ? otpCurrentCode.trim() || undefined : undefined,
      })
      setOtpSetup({
        base32: response.base32,
        otpauthUrl: response.otpauth_url,
      })
      setOtpToken("")
      toast.success("Open your authenticator app and enter the generated code to finish setup.")
    } catch (error: any) {
      const responseMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to start two-factor setup."
      toast.error(responseMessage)
    } finally {
      setOtpLoading(false)
    }
  }

  const handleOtpVerify = async () => {
    if (!otpToken.trim()) {
      toast.error("Enter the code from your authenticator app.")
      return
    }

    setOtpLoading(true)
    try {
      await userService.verifyOtp(otpToken.trim())
      setOtpSetup(null)
      setOtpToken("")
      await refreshCurrentUser()
      toast.success("Two-factor authentication is enabled.")
    } catch (error: any) {
      const responseMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to verify two-factor setup."
      toast.error(responseMessage)
    } finally {
      setOtpLoading(false)
    }
  }

  const handleOtpDisable = async () => {
    if (!otpCurrentPassword.trim()) {
      toast.error("Current password is required to disable two-factor authentication.")
      return
    }

    if (!otpCurrentCode.trim()) {
      toast.error("Enter the current authenticator code to disable two-factor authentication.")
      return
    }

    setOtpLoading(true)
    try {
      await userService.disableOtp({
        current_password: otpCurrentPassword.trim(),
        otp_token: otpCurrentCode.trim(),
      })
      setOtpSetup(null)
      setOtpToken("")
      setOtpCurrentCode("")
      setOtpCurrentPassword("")
      await refreshCurrentUser()
      toast.success("Two-factor authentication is disabled.")
    } catch (error: any) {
      const responseMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to disable two-factor authentication."
      toast.error(responseMessage)
    } finally {
      setOtpLoading(false)
    }
  }

  useEffect(() => {
    return
  }, [language])

  useEffect(() => {
    // Initialize theme on component mount
    handleThemeChangeWrapper(theme)
  }, [theme])

  return (
    <div className="flex flex-col w-full h-full">
      <SubHomeHeader iconSrc="/assets/icons/settings.svg" title="Settings" />

      <div className="flex-1 h-full w-full overflow-y-auto">
        <div className="flex justify-center items-center">
          <div className="flex flex-col max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-5xl w-full space-y-8 px-6 py-8">
            {/* Password Edit Card */}
            <div className="flex flex-col sm:flex-row justify-start sm:justify-between items-start sm:items-center w-full p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Password</h2>
              <div className="flex items-center max-w-[300px] relative">
                <button
                  onClick={() =>
                    isEditingPassword ? void handlePasswordSave() : handleEditClick()
                  }
                  className="absolute left-2 hover:text-black text-gray-700"
                >
                  {isEditingPassword ? (
                    <CloudArrowUpIcon className="h-6 w-6" />
                  ) : (
                    <PencilSquareIcon className="h-6 w-6" />
                  )}
                </button>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  onKeyDown={handleKeyPress}
                  onBlur={handleBlur}
                  disabled={!isEditingPassword}
                  ref={passwordInputRef}
                  className={`pl-10 pr-10 p-2 w-full rounded-lg border border-gray-300 ring-gray-300 text-black
                            bg-gray-300 focus:outline-none focus:border-gray-300 focus:ring-gray-300 ${
                              isEditingPassword ? "" : "cursor-not-allowed"
                            }`}
                />

                <button
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 hover:text-black text-gray-700"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-6 w-6" />
                  ) : (
                    <EyeIcon className="h-6 w-6" />
                  )}
                </button>
              </div>
              {isEditingPassword && (
                <div className="mt-4 grid w-full gap-3 sm:grid-cols-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="rounded-lg border border-gray-300 bg-gray-300 p-2 text-black"
                    placeholder="New password"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="rounded-lg border border-gray-300 bg-gray-300 p-2 text-black"
                    placeholder="Confirm new password"
                  />
                  {currentUser?.otp_enabled && (
                    <input
                      type="text"
                      value={passwordForm.otpToken}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          otpToken: e.target.value,
                        }))
                      }
                      className="rounded-lg border border-gray-300 bg-gray-300 p-2 text-black"
                      placeholder="Authenticator code"
                    />
                  )}
                  {savingPassword && (
                    <p className="text-sm text-blue-600">Saving password...</p>
                  )}
                </div>
              )}
            </div>

            {/* Speech Language Selection Card */}
            <div className="flex flex-col sm:flex-row justify-start sm:justify-between items-start sm:items-center w-full p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Speech Language</h2>
              <div className="flex items-center bg-blue-500 rounded-md">
                <LanguagesDropdown
                  color="blue"
                  setLanguage={handleLanguageChange}
                />
              </div>
            </div>

            {/* Theme Selection Card */}
            <div className="flex flex-col sm:flex-row justify-start sm:justify-between items-start sm:items-center w-full p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Theme</h2>
              <div className="flex space-x-0 bg-gray-500 p-1 rounded-lg">
                {/* Light Theme Option */}
                <div
                  onClick={() => handleThemeChangeWrapper("light")}
                  className={`flex items-center space-x-2 cursor-pointer ps-2 pe-4 py-1 rounded-md  text-white ${
                    theme === "light" ? "bg-blue-500" : "bg-transparent"
                  }`}
                >
                  <SunIcon className="h-5 w-5" />{" "}
                  {/* Sun Icon for Light Theme */}
                  <span>Light</span>
                </div>

                {/* Dark Theme Option */}
                <div
                  onClick={() => handleThemeChangeWrapper("dark")}
                  className={`flex items-center space-x-2 cursor-pointer ps-2 pe-4 py-1 rounded-md text-white ${
                    theme === "dark" ? "bg-blue-500" : "bg-transparent"
                  }`}
                >
                  <MoonIcon className="h-5 w-5" />{" "}
                  {/* Moon Icon for Dark Theme */}
                  <span>Dark</span>
                </div>

                {/* System Theme Option */}
                <div
                  onClick={() => handleThemeChangeWrapper("system")}
                  className={`flex items-center space-x-2 cursor-pointer ps-2 pe-4 py-1 rounded-md text-white ${
                    theme === "system" ? "bg-blue-500" : "bg-transparent"
                  }`}
                >
                  <StopCircleIcon className="h-5 w-5" />{" "}
                  {/* StopCircle Icon for System Theme */}
                  <span>System</span>
                </div>
              </div>
            </div>

            {/* Haptic Feedback Toggle Card */}
            <div className="flex flex-row justify-between items-center w-full p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Haptic Feedback</h2>
              <Switch
                checked={hapticFeedback}
                onChange={handleHapticToggle}
                className={`${
                  hapticFeedback ? "bg-blue-500" : "bg-gray-500"
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span
                  className={`${
                    hapticFeedback ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>

            <div className="w-full rounded-lg bg-gray-100 p-6 shadow-md dark:bg-gray-900">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Account Security</h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Two-factor authentication adds a verification code step to sign-in and email changes.
                  </p>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Status: {currentUser?.otp_enabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <div className="flex gap-3">
                  {!currentUser?.otp_enabled && (
                    <button
                      type="button"
                      onClick={handleOtpSetup}
                      disabled={otpLoading}
                      className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                      {otpLoading ? "Preparing..." : "Set Up 2FA"}
                    </button>
                  )}
                  {currentUser?.otp_enabled && (
                    <button
                      type="button"
                      onClick={handleOtpDisable}
                      disabled={otpLoading}
                      className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                    >
                      {otpLoading ? "Updating..." : "Disable 2FA"}
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input
                  type="password"
                  value={otpCurrentPassword}
                  onChange={(e) => setOtpCurrentPassword(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-gray-200 p-3 text-sm text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Current password"
                />
                {currentUser?.otp_enabled && (
                  <input
                    value={otpCurrentCode}
                    onChange={(e) => setOtpCurrentCode(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-gray-200 p-3 text-sm text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Current authenticator code"
                  />
                )}
              </div>

              {otpSetup && (
                <div className="mt-6 rounded-lg border border-dashed border-blue-300 p-4 dark:border-blue-700">
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    Add this secret or provisioning URL to your authenticator app, then enter the 6-digit code below.
                  </p>
                  <div className="mt-4 grid gap-3">
                    <input
                      readOnly
                      value={otpSetup.base32}
                      className="rounded-lg border border-gray-300 bg-gray-200 p-3 text-sm text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <textarea
                      readOnly
                      value={otpSetup.otpauthUrl}
                      className="min-h-24 rounded-lg border border-gray-300 bg-gray-200 p-3 text-sm text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        value={otpToken}
                        onChange={(e) => setOtpToken(e.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 bg-gray-200 p-3 text-sm text-black dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        placeholder="Authenticator code"
                      />
                      <button
                        type="button"
                        onClick={handleOtpVerify}
                        disabled={otpLoading}
                        className="rounded-lg bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
                      >
                        {otpLoading ? "Verifying..." : "Verify and Enable"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full rounded-lg border border-red-300 bg-red-50 p-6 shadow-md dark:border-red-900 dark:bg-red-950/30">
              <div className="flex flex-col gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-red-700 dark:text-red-300">Delete Account</h2>
                  <p className="mt-2 text-sm text-red-700/80 dark:text-red-200">
                    This permanently deletes your account. Enter your current password and, if enabled, your authenticator code.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="password"
                    value={deleteForm.currentPassword}
                    onChange={(e) =>
                      setDeleteForm((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="rounded-lg border border-red-200 bg-white p-3 text-sm text-black dark:border-red-900 dark:bg-gray-900 dark:text-white"
                    placeholder="Current password"
                  />
                  {currentUser?.otp_enabled && (
                    <input
                      type="text"
                      value={deleteForm.otpToken}
                      onChange={(e) =>
                        setDeleteForm((prev) => ({
                          ...prev,
                          otpToken: e.target.value,
                        }))
                      }
                      className="rounded-lg border border-red-200 bg-white p-3 text-sm text-black dark:border-red-900 dark:bg-gray-900 dark:text-white"
                      placeholder="Authenticator code"
                    />
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={deletingAccount}
                    className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                  >
                    {deletingAccount ? "Deleting..." : "Delete Account"}
                  </button>
                </div>
              </div>
            </div>
            {/* Message Display */}
            {message && (
              <div className="bg-green-500 text-white p-4 rounded-lg text-center">
                {message}
              </div>
            )}
            {/* Footer */}
            <FooterMark />
          </div>
        </div>
      </div>
    </div>
  )
}
