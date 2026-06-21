import { object, string, TypeOf } from "zod"
import { useEffect, useState } from "react"
import { useForm, FormProvider, SubmitHandler } from "react-hook-form"
import { NavLink, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { zodResolver } from "@hookform/resolvers/zod"

import FormInput from "../../components/FormInput"
import { LoadingButton } from "../../components/LoadingButton"
import { GenericResponse } from "../../schemas/generic.response"
import authService from "../../api.services/auth.service"

const emailVerificationSchema = object({
  verificationCode: string().min(1, "Email verifciation code is required"),
})

export type EmailVerificationInput = TypeOf<typeof emailVerificationSchema>

const EmailVerificationPage = () => {
  const navigate = useNavigate()
  const { verificationCode } = useParams()

  const [loading, setLoading] = useState(false)
  const [verificationExpired, setVerificationExpired] = useState(false)

  const methods = useForm<EmailVerificationInput>({
    resolver: zodResolver(emailVerificationSchema),
  })

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitSuccessful },
  } = methods

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful])

  useEffect(() => {
    if (verificationCode) {
      setValue("verificationCode", verificationCode)
    }
  }, [])

  const verifyEmail = async (data: EmailVerificationInput) => {
    try {
      setLoading(true)
      setVerificationExpired(false)
      const response = await authService.verifyEmail(
        data.verificationCode
      ) as GenericResponse
      setLoading(false)
      toast.success(response.message as string, {
        position: "top-right",
      })
      navigate("/login")
    } catch (error: any) {
      setLoading(false)
      const responseDetail =
        error.response &&
        error.response.data &&
        (error.response.data.message || error.response.data.detail)
      const resMessage =
        responseDetail ||
        error.message ||
        error.toString()
      setVerificationExpired(responseDetail === "Verification code has expired")
      toast.error(resMessage, {
        position: "top-right",
      })
    }
  }

  const onSubmitHandler: SubmitHandler<EmailVerificationInput> = (values) => {
    verifyEmail(values)
  }
  return (
    <div
      className="flex w-full h-full items-center justify-center overflow-y-auto
    bg-white text-black dark:bg-black dark:text-white"
    >
      <div className="w-full">
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

        <h1 className="text-md text-center font-[600] text-gray-500 dark:bg-black mb-7">
          Verify Email Address
        </h1>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5  bg-gray-200 dark:bg-gray-800"
          >
            <FormInput label="Verification Code" name="verificationCode" />
            <LoadingButton
              loading={loading}
              btnColor="bg-gradient-to-r from-[#ae519d] via-[#e54389] to-[#f4a14c]"
            >
              Verify Email
            </LoadingButton>

            {verificationExpired ? (
              <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
                This verification link has expired. Request a fresh verification email to continue.
                <div className="mt-2">
                  <NavLink
                    to="/resend_verification"
                    className="font-medium text-blue-600 hover:text-blue-700 hover:font-bold dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Resend verification email
                  </NavLink>
                </div>
              </div>
            ) : null}
          </form>
        </FormProvider>

        <p className="mt-4 text-center text-sm text-gray-600">
          Need another verification email?{" "}
          <NavLink
            to="/resend_verification"
            className="font-medium text-blue-500 hover:text-blue-700 hover:font-bold"
          >
            Resend it
          </NavLink>
        </p>
      </div>
    </div>
  )
}

export default EmailVerificationPage
