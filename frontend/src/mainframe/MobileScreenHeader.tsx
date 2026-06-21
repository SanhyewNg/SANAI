import { useState } from "react"
import { Bars3Icon } from "@heroicons/react/24/outline"

import MobileNavMenu from "./MobileNavMenu"

import { useTheme } from "../contexts/ThemeContext"
import {
  BellIcon,
  SunIcon,
  MoonIcon,
  StopCircleIcon,
} from "@heroicons/react/24/outline"

import { UserSchema } from "../schemas/user.schema"
import Logout from "../routes/user_auth/Logout"

interface Props {
  currentUser: UserSchema | undefined
  setModal: React.Dispatch<React.SetStateAction<boolean>>
}

/////////////////////////////////////////////
export default function MobileScreenHeader({ currentUser }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [modal, setModal] = useState(false)

  const { theme, setTheme } = useTheme()

  const ThemeIcon =
    theme === "light" ? SunIcon : theme === "dark" ? MoonIcon : StopCircleIcon

  const toggleTheme = () => {
    const newTheme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light"
    setTheme(newTheme)
  }

  return (
    <>
      <div className="">
        <MobileNavMenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          setModal={setModal}
        />
      </div>

      <header className="fixed w-full bg-transparent z-50">
        <div className="flex justify-between items-center bg-transparent m-1">
          <button
            className="lg:hidden rounded-full w-6 h-6 flex items-center justify-center mx-2
                        bg-gradient-to-r from-[#ae519d] via-[#e54389] to-[#f4a14c]
                      text-white dark:text-black
                        focus:outline-none focus:ring focus:ring-inset focus:ring-gray-500 
                        hover:ring-offset-2 hover:ring-1 hover:text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-4 w-4" aria-hidden="true" />
          </button>

          {!currentUser && (
            <button
              className="lg:hidden relative inline-flex items-center justify-center p-1 rounded-full  w-6 h-6 m-2
                        bg-gradient-to-r from-[#ae519d] via-[#e54389] to-[#f4a14c]
                        text-sm font-medium text-white dark:text-black
                        hover:ring-offset-2 hover:ring-1 hover:text-white"
              onClick={toggleTheme}
            >
              {/* <span> Log </span> */}
              <ThemeIcon className="h-4 w-4" />
              {/* <span className="text-white text-md px-2">Start</span> */}
            </button>
          )}
          {currentUser && (
            <button
              className="lg:hidden relative inline-flex items-center justify-center p-1 rounded-full  w-6 h-6 m-2
                        bg-gradient-to-r from-[#ae519d] via-[#e54389] to-[#f4a14c]
                        text-sm font-medium text-white dark:text-black
                        hover:ring-offset-2 hover:ring-1 hover:text-white"
            >
              {/* <span> Log </span> */}
              <BellIcon className="h-4 w-4" />
              {/* <span className="text-white text-md px-2">Start</span> */}
            </button>
          )}
        </div>
      </header>
      {modal && <Logout modal={modal} setModal={setModal} />}
    </>
  )
}
