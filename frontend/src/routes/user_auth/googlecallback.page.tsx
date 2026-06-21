import { useEffect, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"

import Spinner from "../../components/Spinner"
import { useAuth } from "../../contexts/AuthContext"

const sanitizeNextPath = (nextPath: string | null) => {
  if (!nextPath || !nextPath.startsWith('/') || nextPath.startsWith('//')) {
    return '/'
  }
  return nextPath
}

const GoogleCallbackPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { currentUser, loading } = useAuth()
  const handledRef = useRef(false)

  useEffect(() => {
    if (loading || handledRef.current) {
      return
    }

    const status = searchParams.get("status")
    const message = searchParams.get("message")
    const nextPath = sanitizeNextPath(searchParams.get("next"))
    const requiresOtp = searchParams.get("requires_otp") === "true"

    if (status === "error") {
      handledRef.current = true
      toast.error(message || "Google sign-in failed.", {
        position: "top-right",
      })
      navigate(`/login?next=${encodeURIComponent(nextPath)}`, { replace: true })
      return
    }

    if (requiresOtp) {
      handledRef.current = true
      toast.success("Enter your authentication code to finish signing in.", {
        position: "top-right",
      })
      navigate(`/validate_otp?next=${encodeURIComponent(nextPath)}`, { replace: true })
      return
    }

    if (status === "success" && currentUser) {
      handledRef.current = true
      toast.success(message || "Signed in with Google successfully.", {
        position: "top-right",
      })
      navigate(nextPath.startsWith("/") ? nextPath : "/", { replace: true })
      return
    }

    if (status === "success" && !currentUser) {
      handledRef.current = true
      toast.error("Google sign-in could not be completed.", {
        position: "top-right",
      })
      navigate(`/login?next=${encodeURIComponent(nextPath)}`, { replace: true })
      return
    }

    handledRef.current = true
    toast.error("Invalid Google sign-in response.", {
      position: "top-right",
    })
    navigate(`/login?next=${encodeURIComponent(nextPath)}`, { replace: true })
  }, [currentUser, loading, navigate, searchParams])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center text-gray-600 dark:text-gray-300">
      <Spinner width={10} height={10} />
      <div>
        <h1 className="text-lg font-semibold text-black dark:text-white">
          Completing Google sign-in
        </h1>
        <p className="mt-2 text-sm">
          Please wait while we finish your authentication session.
        </p>
      </div>
    </div>
  )
}

export default GoogleCallbackPage