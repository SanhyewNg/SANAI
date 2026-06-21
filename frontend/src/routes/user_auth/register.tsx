import { useState, useEffect } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"

import { useAuth } from "../../contexts/AuthContext"
import { UserRegisterSchema } from "../../schemas/user.schema"

//////////////////////////////////////////////////
import { object, string, TypeOf } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider } from "react-hook-form"
import FormInput from "../../components/FormInput"
import { LoadingButton } from "../../components/LoadingButton"
import { toast } from "react-toastify"
import authService from "../../api.services/auth.service"

//////////////////////////////////////////////////

const registerSchema = object({
  first_name: string().min(1, "First name is required").max(15, "First name must be 15 characters or less"),
  last_name: string().min(1, "Last name is required").max(15, "Last name must be 15 characters or less"),
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})

export type RegisterInput = TypeOf<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [duplicateEmail, setDuplicateEmail] = useState("")
  const nextPathParam = new URLSearchParams(location.search).get("next")
  const nextPath = nextPathParam && nextPathParam.startsWith("/") && !nextPathParam.startsWith("//")
    ? nextPathParam
    : "/"

  // const { login } = useAuth();
  const methods = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
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

  const { register } = useAuth()

  const registerUser = async (data: UserRegisterSchema) => {
    setLoading(true)
    setDuplicateEmail("")
    try {
      const response = await register(data)
      toast.success(response.message as string, {
        position: "top-right",
      })
      navigate("/verify_email")
    } catch (error: any) {
      const responseMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create account."
      if (responseMessage === "An account of the email already exists") {
        setDuplicateEmail(data.email)
      }
      toast.error(responseMessage, {
        position: "top-right",
      })
    } finally {
      setLoading(false)
    }
  }

  const onSubmitHandler: SubmitHandler<RegisterInput> = (values) => {
    registerUser(values)
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

            <p className="mt-2 mb-4 text-center  text-md font-medium text-gray-500">
              Create your account
            </p>
          </div>

          <div className="mx-4 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-gray-200 dark:bg-gray-900 py-8 px-4 shadow rounded-3xl sm:px-10">
              {/* <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}> */}
              <FormProvider {...methods}>
                <form
                  className="space-y-4"
                  onSubmit={handleSubmit(onSubmitHandler)}
                >
                  <div className="flex gap-x-2">
                    <FormInput label="First Name" name="first_name" />
                    <FormInput label="Last Name" name="last_name" />
                  </div>
                  <FormInput label="Email" name="email" type="email" />
                  <FormInput label="Password" name="password" type="password" />

                  {/* submit btn */}
                  <div>
                    <LoadingButton
                      loading={loading}
                      btnColor="bg-gradient-to-r from-[#ae519d] via-[#e54389] to-[#f4a14c]"
                    >
                      Sign Up
                    </LoadingButton>
                  </div>

                  {duplicateEmail ? (
                    <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
                      That email already has an account. If it is still waiting for verification, you can{" "}
                      <NavLink
                        to={`/resend_verification?email=${encodeURIComponent(duplicateEmail)}`}
                        className="font-medium text-blue-600 hover:text-blue-700 hover:font-bold dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        resend the verification link
                      </NavLink>
                      .
                    </div>
                  ) : null}
                </form>
              </FormProvider>

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
                    <a
                      href={authService.getGoogleLoginUrl(nextPath)}
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
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account? Please{" "}
              <NavLink
                to={nextPath === "/" ? "/login" : `/login?next=${encodeURIComponent(nextPath)}`}
                className="font-medium text-blue-500 hover:text-blue-700 hover:font-bold"
              >
                Log In
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
