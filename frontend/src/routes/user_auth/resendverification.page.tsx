import { object, string, TypeOf } from "zod"
import { useEffect, useState } from "react"
import { useForm, FormProvider, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { NavLink, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"

import FormInput from "../../components/FormInput"
import { LoadingButton } from "../../components/LoadingButton"
import { GenericResponse } from "../../schemas/generic.response"
import authService from "../../api.services/auth.service"

const resendVerificationSchema = object({
  email: string().min(1, "Email is required").email("Invalid email address"),
})

type ResendVerificationInput = TypeOf<typeof resendVerificationSchema>

const ResendVerificationPage = () => {
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()

  const methods = useForm<ResendVerificationInput>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
    },
  })

  const {
    handleSubmit,
    setValue,
  } = methods

  useEffect(() => {
    const email = searchParams.get("email")
    if (email) {
      setValue("email", email)
    }
  }, [searchParams, setValue])

  const resendVerification = async (data: ResendVerificationInput) => {
    try {
      setLoading(true)
      const response = await authService.resendVerification(data) as GenericResponse
      toast.success(response.message, {
        position: "top-right",
      })
    } catch (error: any) {
      const resMessage =
        (error.response &&
          error.response.data &&
          (error.response.data.message || error.response.data.detail)) ||
        error.message ||
        error.toString()
      toast.error(resMessage, {
        position: "top-right",
      })
    } finally {
      setLoading(false)
    }
  }

  const onSubmitHandler: SubmitHandler<ResendVerificationInput> = (values) => {
    resendVerification(values)
  }

  return (
    <main className="flex w-full h-full bg-white text-black dark:bg-black dark:text-white">
      <div className="flex w-full h-full items-center justify-center overflow-y-auto bg-white text-black dark:bg-black dark:text-white">
        <div className="w-full px-4">
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

          <h1 className="text-md text-center font-[600] text-gray-500 mb-3">
            Resend verification email
          </h1>

          <p className="max-w-md mx-auto text-center text-sm text-gray-500 mb-7">
            Enter the email you used to sign up. If the account exists and is still unverified, we will send a fresh verification link.
          </p>

          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmitHandler)}
              className="max-w-md w-full mx-auto overflow-hidden shadow-lg rounded-2xl p-8 space-y-5 bg-gray-200 dark:bg-gray-800"
            >
              <FormInput label="Email Address" name="email" type="email" />
              <LoadingButton
                loading={loading}
                btnColor="bg-gradient-to-r from-[#ae519d] via-[#e54389] to-[#f4a14c]"
              >
                Resend Verification Link
              </LoadingButton>
            </form>
          </FormProvider>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already verified?{" "}
            <NavLink
              to="/login"
              className="font-medium text-blue-500 hover:text-blue-700 hover:font-bold"
            >
              Return to login
            </NavLink>
          </p>
        </div>
      </div>
    </main>
  )
}

export default ResendVerificationPage