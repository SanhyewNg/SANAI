import { Link } from "react-router-dom"
import { ArrowRightIcon } from "@heroicons/react/24/solid" // Import Heroicons ArrowRightIcon

import SubHomeHeader from "../../components/SubHomeHeader"
import FooterMark from "../../components/FooterMark"
import { helpNavigations } from "../../constants/nav.constants"

export default function Help() {
  return (
    <div className="flex flex-col w-full h-full">
      <SubHomeHeader iconSrc="/assets/icons/help.svg" title="Help" />

      <div className="flex-1 h-full w-full overflow-y-auto">
        <div className="flex flex-col items-center">
          <div className="flex justify-center h-[200px] w-[200px] m-4">
            <img
              src="/assets/Sphere.gif"
              className="dark:invert dark:rotate-180"
            />
          </div>
          {/* <h2 className="text-xl font-bold justify-center mx-4">
            Welcome! Translate spoken or written language with the best
            correctness.
          </h2> */}
        </div>
        <div className="flex justify-center items-center">
          <div className="flex flex-col w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-5xl px-4">
            {/* Help Navigation Section */}
            <nav className="w-full">
              <ul className="flex flex-col gap-6 w-full">
                {helpNavigations.map((item) => (
                  <li key={item.name} className="w-full">
                    <Link
                      to={"/help/" + item.path}
                      className="w-full p-6 bg-gray-100 dark:bg-gray-900 hover:bg-[#F7F5F7] dark:hover:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center text-left justify-between"
                    >
                      <div className="flex items-center">
                        <img
                          className="h-6 w-6 mr-4 invert dark:invert-0"
                          src={item.icon}
                          alt={`${item.name} icon`}
                        />
                        <h3 className="text-xl font-semibold mb-1">
                          {item.name}
                        </h3>
                      </div>
                      <ArrowRightIcon className="h-6 w-6" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <FooterMark />
      </div>
    </div>
  )
}
