import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Spinner from "../components/Spinner"

const WithPrivateRoute = ({ children }: any) => {
  const { currentUser, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner width={8} height={8} />
      </div>
    )
  }

  if (!currentUser) {
    const nextPath = `${location.pathname}${location.search}`
    return <Navigate to={`/login?next=${encodeURIComponent(nextPath)}`} replace />
  }
  return children
}

export default WithPrivateRoute
