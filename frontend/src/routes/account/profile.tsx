import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/solid" // Importing icons from Heroicons
import { toast } from "react-toastify"

import SubHomeHeader from "../../components/SubHomeHeader"
import FooterMark from "../../components/FooterMark"
import userService from "../../api.services/user.service"
import { useAuth } from "../../contexts/AuthContext"
import Spinner from "../../components/Spinner"

export default function Profile() {
  const navigate = useNavigate()
  const { currentUser, loading, logout } = useAuth()

  const [profile, setProfile] = useState({
    uuid: "",
    email: "",
    firstName: "",
    lastName: "",
    avatar: "/assets/icons/default-avatar.png",
    provider: "",
    isActive: false,
    isManager: false,
    isDeveloper: false,
    phoneNumber: "",
    birthday: "",
    language: "",
  })
  const [emailChange, setEmailChange] = useState({
    email: "",
    currentPassword: "",
    otpToken: "",
  })

  const [isChanged, setIsChanged] = useState(false)
  const [isSaved, setIsSaved] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [isFocused, setIsFocused] = useState({
    firstName: false,
    lastName: false,
    phoneNumber: false,
    birthday: false,
    language: false,
  })

  // Initialize profile after loading is done
  useEffect(() => {
    if (!loading && currentUser) {
      setProfile({
        uuid: currentUser.uuid || "",
        email: currentUser.email || "",
        firstName: currentUser.first_name || "",
        lastName: currentUser.last_name || "",
        avatar: currentUser.avatar || "/assets/icons/user-circle-large.svg",
        provider: currentUser.provider || "",
        isActive: currentUser.is_active || false,
        isManager: currentUser.is_manager || false,
        isDeveloper: currentUser.is_developer || false,
        phoneNumber: currentUser.phoneNumber || "",
        birthday: currentUser.birthday || "",
        language: currentUser.language || "",
      })
      setEmailChange({
        email: currentUser.email || "",
        currentPassword: "",
        otpToken: "",
      })
    }
    setIsChanged(false)
    setIsSaved(true)
  }, [loading, currentUser])

  useEffect(() => {
    const hasChanged =
      profile.firstName !== currentUser?.first_name ||
      profile.lastName !== currentUser?.last_name ||
      profile.phoneNumber !== currentUser?.phoneNumber ||
      profile.birthday !== currentUser?.birthday ||
      profile.language !== currentUser?.language ||
      profile.avatar !== currentUser?.avatar

    setIsChanged(hasChanged)
    setIsSaved(false) // Reset save message when any change happens
  }, [profile, currentUser])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileReader = new FileReader()
      fileReader.onload = () => {
        setProfile((prevProfile) => ({
          ...prevProfile,
          avatar: fileReader.result as string,
        }))
      }
      fileReader.readAsDataURL(e.target.files[0])
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailChange({ ...emailChange, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const emailHasChanged = emailChange.email.trim() !== (currentUser?.email || "")
      const profileHasChanged =
        profile.firstName !== (currentUser?.first_name || "") ||
        profile.lastName !== (currentUser?.last_name || "") ||
        profile.avatar !== (currentUser?.avatar || "/assets/icons/user-circle-large.svg") ||
        profile.phoneNumber !== (currentUser?.phoneNumber || "") ||
        profile.birthday !== (currentUser?.birthday || "") ||
        profile.language !== (currentUser?.language || "")

      if (emailHasChanged) {
        if (!emailChange.currentPassword) {
          toast.error("Current password is required to change your email.")
          return
        }

        if (profileHasChanged) {
          toast.error("Save profile details separately from an email change. Email changes sign you out after verification is sent.")
          return
        }

        const response = await userService.changeEmail({
          email: emailChange.email.trim(),
          current_password: emailChange.currentPassword,
          otp_token: emailChange.otpToken.trim() || undefined,
        })

        toast.success(response.message)
        if (response.requires_reauth) {
          await logout()
          navigate("/login")
          return
        }

        return
      }

      const updatedProfile = await userService.updateProfile({
        first_name: profile.firstName,
        last_name: profile.lastName,
        avatar: profile.avatar,
        phone: profile.phoneNumber,
        birthday: profile.birthday || undefined,
        language: profile.language,
      })

      setProfile((prev) => ({
        ...prev,
        email: updatedProfile.email,
        firstName: updatedProfile.first_name || "",
        lastName: updatedProfile.last_name || "",
        avatar: updatedProfile.avatar || "/assets/icons/user-circle-large.svg",
        phoneNumber: updatedProfile.phoneNumber || "",
        birthday: updatedProfile.birthday || "",
        language: updatedProfile.language || "",
      }))
      setEmailChange({
        email: updatedProfile.email,
        currentPassword: "",
        otpToken: "",
      })
      setIsSaved(true)
      setIsChanged(false)
      toast.success("Profile saved successfully.")
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update profile"
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col w-full h-full">
      <SubHomeHeader iconSrc="/assets/icons/user-cirle.svg" title="Profile" />

      <div className="flex-1 h-full w-full overflow-y-auto">
        <div className="flex justify-center items-center">
          {loading && (
            <div className="p-16">
              <Spinner width={10} height={10} />
            </div>
          )}
          {!loading && (
            <div className="flex flex-col w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-5xl p-8">
              {/* Avatar Photo and Change */}
              <div className="flex flex-col items-center mb-4">
                <img
                  src={
                    profile.avatar
                      ? profile.avatar
                      : "/assets/icons/user-circle-large.svg"
                  }
                  alt="Avatar"
                  className="rounded-full w-48 h-48 object-cover mb-4"
                />
                <label className="cursor-pointer border border-gray-500 py-2 px-4 rounded-lg hover:bg-blue-500 hover:text-white hover:border-blue-500 transition">
                  Change Photo
                  <input
                    type="file"
                    className="hidden" // Keep this hidden
                    accept="image/*"
                    onChange={handleAvatarChange} // Call function on change
                  />
                </label>
              </div>

              {/* First Name and Last Name */}
              <div className="flex flex-col sm:flex-row w-full space-y-0 sm:space-x-4 mt-4">
                <div className="flex flex-col w-full ">
                  <label className="text-md font-semibold py-2">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center justify-center">
                      <UserCircleIcon
                        className="h-5 w-5 text-gray-500"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      onFocus={() =>
                        setIsFocused((prev) => ({ ...prev, firstName: true }))
                      }
                      onBlur={() =>
                        setIsFocused((prev) => ({ ...prev, firstName: false }))
                      }
                      className={`block py-3 pl-12 pr-3 w-full text-sm rounded-lg 
                                ${
                                  isFocused.firstName
                                    ? "border-0"
                                    : "border border-gray-200"
                                } 
                                focus:outline-none focus:ring-gray-200 focus:border-gray-200 
                                dark:focus:outline-none dark:focus:ring-gray-800 dark:focus:border-gray-800 
                                bg-gray-200 border-gray-200 placeholder-gray-600
                                dark:bg-gray-800 dark:border-gray-800 dark:placeholder-gray-400`} // Updated styling
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-md font-semibold py-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center justify-center">
                      <UserCircleIcon
                        className="h-5 w-5 text-gray-500"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      onFocus={() =>
                        setIsFocused((prev) => ({ ...prev, lastName: true }))
                      }
                      onBlur={() =>
                        setIsFocused((prev) => ({ ...prev, lastName: false }))
                      }
                      className={`block py-3 pl-12 pr-3 w-full text-sm rounded-lg 
                                  ${
                                    isFocused.lastName
                                      ? "border-0"
                                      : "border border-gray-200"
                                  } 
                                  focus:outline-none focus:ring-gray-200 focus:border-gray-200 
                                  dark:focus:outline-none dark:focus:ring-gray-800 dark:focus:border-gray-800 
                                  bg-gray-200 border-gray-200 placeholder-gray-600
                                  dark:bg-gray-800 dark:border-gray-800 dark:placeholder-gray-400`} // Updated styling
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

              {/* Email and Phone */}
              <div className="flex flex-col sm:flex-row w-full space-y-0 sm:space-x-4 mt-4">
                <div className="flex flex-col w-full">
                  <label className="text-md font-semibold py-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center justify-center">
                      <EnvelopeIcon
                        className="h-5 w-5 text-gray-500"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={emailChange.email}
                      onChange={handleEmailChange}
                      className="block py-3 pl-12 pr-3 w-full text-sm rounded-lg 
                                border-1 
                                focus:outline-none focus:ring-gray-200 focus:border-gray-200 
                                  dark:focus:outline-none dark:focus:ring-gray-800 dark:focus:border-gray-800 
                                  bg-gray-200 border-gray-200 placeholder-gray-600
                                  dark:bg-gray-800 dark:border-gray-800 dark:placeholder-gray-400" // Updated styling
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-md font-semibold py-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center justify-center">
                      <PhoneIcon
                        className="h-5 w-5 text-gray-500"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={profile.phoneNumber}
                      onChange={handleChange}
                      onFocus={() =>
                        setIsFocused((prev) => ({ ...prev, phoneNumber: true }))
                      }
                      onBlur={() =>
                        setIsFocused((prev) => ({
                          ...prev,
                          phoneNumber: false,
                        }))
                      }
                      className={`block py-3 pl-12 pr-3 w-full text-sm rounded-lg 
                                  ${
                                    isFocused.phoneNumber
                                      ? "border-0"
                                      : "border border-gray-200"
                                  } 
                                  focus:outline-none focus:ring-gray-200 focus:border-gray-200 
                                  dark:focus:outline-none dark:focus:ring-gray-800 dark:focus:border-gray-800 
                                  bg-gray-200 border-gray-200 placeholder-gray-600
                                  dark:bg-gray-800 dark:border-gray-800 dark:placeholder-gray-400`} // Updated styling
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

              {/* Birthday and Language */}
              <div className="flex flex-col sm:flex-row w-full space-y-0 sm:space-x-4 mt-4">
                <div className="flex flex-col w-full">
                  <label className="text-md font-semibold py-2">Birthday</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center justify-center">
                      <CalendarIcon
                        className="h-5 w-5 text-gray-500"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type="date"
                      name="birthday"
                      value={profile.birthday}
                      onChange={handleChange}
                      className={`block py-3 pl-12 pr-3 w-full text-sm rounded-lg 
                                ${
                                  isFocused.birthday
                                    ? "border-0"
                                    : "border border-gray-200"
                                } 
                                  focus:outline-none focus:ring-gray-200 focus:border-gray-200 
                                  dark:focus:outline-none dark:focus:ring-gray-800 dark:focus:border-gray-800 
                                  bg-gray-200 border-gray-200 placeholder-gray-600
                                  dark:bg-gray-800 dark:border-gray-800 dark:placeholder-gray-400`} // Updated styling
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-md font-semibold py-2">Language</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center justify-center">
                      <GlobeAltIcon
                        className="h-5 w-5 text-gray-500"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type="text"
                      name="language"
                      value={profile.language}
                      onChange={handleChange}
                      onFocus={() =>
                        setIsFocused((prev) => ({ ...prev, language: true }))
                      }
                      onBlur={() =>
                        setIsFocused((prev) => ({ ...prev, language: false }))
                      }
                      className={`block py-3 pl-12 pr-3 w-full text-sm rounded-lg 
                                ${
                                  isFocused.language
                                    ? "border-0"
                                    : "border border-gray-200"
                                } 
                                  focus:outline-none focus:ring-gray-200 focus:border-gray-200 
                                  dark:focus:outline-none dark:focus:ring-gray-800 dark:focus:border-gray-800 
                                  bg-gray-200 border-gray-200 placeholder-gray-600
                                  dark:bg-gray-800 dark:border-gray-800 dark:placeholder-gray-400`} // Updated styling
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-gray-100 p-6 dark:bg-gray-900">
                <h2 className="text-lg font-semibold">Confirm Email Change</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Changing your email signs you out and sends a verification link to the new address.
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <input
                    type="password"
                    name="currentPassword"
                    value={emailChange.currentPassword}
                    onChange={handleEmailChange}
                    className="rounded-lg border border-gray-200 bg-gray-200 px-4 py-3 text-sm text-black dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                    placeholder="Current password"
                  />
                  <input
                    type="text"
                    name="otpToken"
                    value={emailChange.otpToken}
                    onChange={handleEmailChange}
                    className="rounded-lg border border-gray-200 bg-gray-200 px-4 py-3 text-sm text-black dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                    placeholder="Authentication code if 2FA is enabled"
                  />
                </div>
              </div>

              {/* Save Button and Status Message */}
              <div className="flex justify-end mt-6">
                {(isChanged || emailChange.email !== (currentUser?.email || "")) &&
                  !isSaved && ( // Show Save button only when changes are made
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 font-semibold text-white rounded-lg 
                                bg-blue-500 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                      {isSaving ? "Saving..." : "Save Profile"}
                    </button>
                  )}

                {isSaved && ( // Show success message after saving
                  <div className="flex mt-4 text-green-600 dark:text-green-400 justify-end">
                    Profile saved successfully!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <FooterMark />
      </div>
    </div>
  )
}
