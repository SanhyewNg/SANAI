import { Link } from "react-router-dom"
import { format } from "date-fns"

export default function NewTranslation() {
  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  return (
    <>
      <div className="px-3 py-1">
        <div className="relative">
          <Link
            to={
              "/translator/" +
              format(new Date(), "MMMdd-p-Y").replaceAll(" ", "")
            }
            id="new_translation"
            className="py-2 px-4 w-full text-md rounded-lg flex justify-center
                      border border-gray-500  hover:bg-blue-500 hover:text-white hover:border-blue-500 transition"
            //   onChange={(e) => handleSearch(e.target.value)}
          >
            Start a new translation
          </Link>
        </div>
      </div>
    </>
  )
}
