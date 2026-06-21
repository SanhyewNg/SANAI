import { useState, useEffect } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
// import { useAuth } from "../../contexts/AuthContext";

// import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from "react-hook-form"

import { LoadingButton } from "../../components/LoadingButton"

import { useAuth } from "../../contexts/AuthContext"
import authService from "../../api.services/auth.service"
import { UserLoginSchema } from "../../schemas/user.schema"

///
import { object, string, TypeOf } from "zod"
import { FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import FormInput from "../../components/FormInput"
import { toast } from "react-toastify"

const loginSchema = object({
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})

export type LoginInput = TypeOf<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const [loading, setLoading] = useState(false)
  const [unverifiedEmail, setUnverifiedEmail] = useState("")
  const { login } = useAuth()
  const nextPathParam = new URLSearchParams(location.search).get("next")
  const nextPath = nextPathParam && nextPathParam.startsWith("/") && !nextPathParam.startsWith("//")
    ? nextPathParam
    : "/"

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful])

  const loginUser = async (data: UserLoginSchema) => {
    setLoading(true)
    setUnverifiedEmail("")
    try {
      const authResult = await login(data)
      setLoading(false)
      if (authResult.requires_otp) {
        toast.success("Enter your authentication code to finish signing in.")
        navigate(`/validate_otp?next=${encodeURIComponent(nextPath)}`)
        return
      }

      toast.success("You are logged in successfully! 😉👌")

      navigate(nextPath)
    } catch (error: any) {
      const responseDetail =
        error.response &&
        error.response.data &&
        (error.response.data.message || error.response.data.detail)
      const resMessage =
        responseDetail ||
        error.message ||
        error.toString()
      if (responseDetail === "Email address is not verified") {
        setUnverifiedEmail(data.email)
      }
      toast.error(resMessage, {
        position: "top-right",
      })
      setLoading(false)
    }
  }

  const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
    loginUser(values)
  }

  const handleGoogleLogin = async () => {
    window.location.href = authService.getGoogleLoginUrl(nextPath)
  }

  return (
    // <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-300">
    <>
      <div
        className="flex w-full h-full items-center justify-center overflow-y-auto
    bg-white text-black dark:bg-black dark:text-white"
      >
        <div className="flex-1 flex-col justify-center py-2 sm:px-6 lg:px-8">
          {/* <div className="max-w-md w-full space-y-8"> */}
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex justify-center items-center mb-2">
              <img
                className="h-8 w-auto mx-2"
                src="/assets/Logo-Vector.svg"
                alt="SANAI"
              />
              <h2 className="text-center text-3xl font-medium text-black dark:text-white">
                SANAI
              </h2>
            </div>

            <p className="mt-2 text-center text-md font-medium text-gray-500">
              Login to your account
            </p>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-md p-4">
            <div className="bg-gray-200 dark:bg-gray-900 py-8 px-4 shadow rounded-3xl sm:px-10">
              <FormProvider {...methods}>
                <form
                  className="space-y-6"
                  onSubmit={handleSubmit(onSubmitHandler)}
                >
                  <FormInput label="Email" name="email" type="email" />
                  <FormInput label="Password" name="password" type="password" />

                  {/* remember and forgot */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember_me"
                        name="remember_me"
                        type="checkbox"
                        className="h-4 w-4 
                    bg-gray-200 dark:bg-gray-600
                    text-blue-500 dark:text-gray-600 
                    focus:ring-gray-600 border-gray-600 rounded"
                      />
                      <label
                        htmlFor="remember_me"
                        className="ml-2 block text-sm text-blue-500"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <NavLink
                        to="/forgot_password"
                        className="text-blue-500 hover:text-blue-700 hover:font-bold"
                      >
                        Forgot password?
                      </NavLink>
                    </div>
                  </div>

                  {/* submit btn */}
                  <div>
                    <LoadingButton
                      loading={loading}
                      btnColor="bg-gradient-to-r from-[#ae519d] via-[#e54389] to-[#f4a14c]"
                    >
                      Login
                    </LoadingButton>
                  </div>

                  {unverifiedEmail ? (
                    <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
                      Your account still needs email verification.{" "}
                      <NavLink
                        to={`/resend_verification?email=${encodeURIComponent(unverifiedEmail)}`}
                        className="font-medium text-blue-600 hover:text-blue-700 hover:font-bold dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Resend the verification link
                      </NavLink>
                      .
                    </div>
                  ) : null}
                </form>
              </FormProvider>

              <p className="mt-4 text-center text-sm text-gray-500">
                Need a new verification email?{" "}
                <NavLink
                  to={nextPath === "/" ? "/resend_verification" : `/resend_verification?next=${encodeURIComponent(nextPath)}`}
                  className="font-medium text-blue-500 hover:text-blue-700 hover:font-bold"
                >
                  Resend it
                </NavLink>
              </p>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-200 dark:bg-gray-900 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3">
                  <div>
                    <button
                      onClick={handleGoogleLogin}
                      type="button"
                      className="
                    w-full inline-flex justify-center py-2 px-4  rounded-md shadow-sm
                     text-sm font-medium text-gray-500 
                     border border-gray-300 dark:border-gray-500 
                    bg-blue-100 dark:bg-gray-800 hover:bg-blue-300 dark:hover:bg-gray-900"
                    >
                      <span className="sr-only">Sign in with Google</span>
                      <img
                        className="w-5 h-5 mr-2"
                        aria-hidden="true"
                        src="assets/logos/google-svgrepo-com.svg"
                      />
                      <span>Google</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <p className="mt-2 text-center text-sm text-gray-600">
              Don't have an account? Please{" "}
              <NavLink
                to={nextPath === "/" ? "/register" : `/register?next=${encodeURIComponent(nextPath)}`}
                className="font-medium text-blue-500  hover:text-blue-700 hover:font-bold"
              >
                Sign Up
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
