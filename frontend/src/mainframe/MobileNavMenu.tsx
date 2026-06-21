import { Dialog, Transition, TransitionChild } from "@headlessui/react"
import { NavLink } from "react-router-dom"

import { useAuth } from "../contexts/AuthContext"

function joinClassNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}
const logo_img = "/assets/Logo-Vector.svg"

import {
  appNavigations,
  accountNavigations,
  login,
  logout,
} from "../constants/nav.constants"

interface Props {
  mobileMenuOpen: boolean
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  setModal: React.Dispatch<React.SetStateAction<boolean>>
}

//////////////////////////////////////////////////////////////////////////
export default function MobileNavMenu({
  mobileMenuOpen,
  setMobileMenuOpen,
  setModal,
}: Props) {
  const { currentUser } = useAuth()

  return (
    <div>
      {/* Mobile Navigation Menu */}
      <Transition show={mobileMenuOpen}>
        <Dialog
          as="div"
          className="fixed inset-0 flex z-50 lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <TransitionChild
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-opacity-75" aria-hidden="true" />
          </TransitionChild>

          <TransitionChild
            enter="transition ease-in-out duration-500 transform"
            enterFrom="-translate-x-full opacity-0"
            enterTo="translate-x-0 opacity-95"
            leave="transition ease-in-out duration-500 transform"
            leaveFrom="translate-x-0 opacity-95"
            leaveTo="-translate-x-full opacity-0"
          >
            <div
              className="relative flex flex-col max-w-sm w-56 pt-2 pb-4
              bg-gradient-to-b from-[#59544E] via-[#58565C] to-[#4D595F]
              dark:bg-gradient-to-b dark:from-[#1D1712] dark:via-[#19151B] dark:to-[#121F26]
            text-gray-300"
            >
              {/* <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child> */}

              {/* Mobile Navigation Menu close icon */}
              {/* <button
                className="mx-7 my-3 flex items-center justify-center h-6 w-6 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button> */}

              <div
                className="flex items-center justify-center flex-shrink-0 pt-12 pb-4
                              border-b border-gray-500"
              >
                <img className="h-6 w-auto" src={logo_img} alt="SANAI Logo" />
                <span className="text-xl font-medium px-2">SANAI</span>
              </div>

              {/* Mobile Navigation Menu Items */}
              <div className="flex-1 h-0 flex-col overflow-y-auto">
                {/* Navigation */}
                <div className="flex-1 flex flex-col mb-auto">
                  <nav className="" key={"MobileNavMenu"}>
                    {/* <div className="space-y-1"> */}
                    {appNavigations.map((item) => (
                      <div key={item.href + "-on-MobileNavMenu"}>
                        <NavLink
                          to={item.href}
                          className={({ isActive }) =>
                            joinClassNames(
                              " group flex items-center px-3 py-3 text-sm font-medium rounded-full space-y-1 my-2 mx-4",
                              isActive
                                ? "bg-gradient-to-r from-[#3B3636] via-[#615E5E] to-[#3B3636]"
                                : "hover:bg-gradient-to-r from-[#3B3636] via-[#615E5E] to-[#3B3636]"
                            )
                          }
                          // aria-current={item.current ? "page" : undefined}
                          data-tooltip-id={item.name}
                          onClick={() => {
                            setMobileMenuOpen(false)
                          }}
                        >
                          {/* <item.icon
                      className={classNames(
                        item.current
                          ? "text-gray-500"
                          : "text-gray-400 group-hover:text-gray-500",
                        "mr-3 h-6 w-6"
                      )}
                      aria-hidden="true"
                    /> */}
                          <img
                            className="h-6 w-6"
                            src={item.icon}
                            alt="Icon image"
                            aria-hidden="true"
                          />
                          <span className="px-3">{item.name}</span>
                        </NavLink>
                      </div>
                    ))}
                    {/* </div> */}
                  </nav>
                </div>

                {/* Sidebar user account navigations */}
                {/* if logged in */}
                <div className="flex-1 flex flex-col-reverse mt-auto">
                  {currentUser && (
                    <>
                      {/* User Navigation */}
                      <nav className="border-t border-gray-500">
                        <div className="space-y-1">
                          {accountNavigations.map((item, key: any) => (
                            <div key={item.href + "-on-MobileNavMenu"}>
                              <NavLink
                                key={key}
                                to={item.href}
                                className={({ isActive }) =>
                                  joinClassNames(
                                    isActive
                                      ? "bg-gradient-to-r from-[#3B3636] via-[#615E5E] to-[#3B3636]"
                                      : "hover:bg-gradient-to-r from-[#3B3636] via-[#615E5E] to-[#3B3636]",
                                    "group flex items-center px-3 py-3 text-sm font-medium rounded-full my-2 mx-4"
                                  )
                                }
                                data-tooltip-id={item.name}
                                onClick={() => {
                                  setMobileMenuOpen(false)
                                }}
                              >
                                <img
                                  className="mr-3 h-6 w-6"
                                  src={item.icon}
                                  aria-hidden="true"
                                />
                                <span>{item.name}</span>
                              </NavLink>
                            </div>
                          ))}
                        </div>

                        {/* Logout */}
                        <div className="space-y-1">
                          <div
                            className="flex items-center rounded-full px-3 py-3 text-sm font-medium my-2 mx-4
                    hover:bg-gradient-to-r from-[#3B3636] via-[#615E5E] to-[#3B3636]"
                            onClick={() => {
                              setMobileMenuOpen(false)
                              setModal(true)
                            }}
                            data-tooltip-id={logout.name}
                          >
                            <img
                              className="mr-3 h-6 w-6"
                              src={logout.icon}
                              aria-hidden="true"
                            />
                            <span>{logout.name}</span>
                          </div>
                        </div>
                      </nav>
                    </>
                  )}
                </div>
              </div>

              {/* User login state */}
              <div className="bottom-4 flex items-center px-3 mb-6 w-full border-t border-gray-500 pt-2 ">
                {!currentUser && (
                  <>
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        joinClassNames(
                          isActive
                            ? "      bg-gradient-to-r from-[#3B3636] via-[#615E5E] to-[#3B3636]"
                            : "hover:bg-gradient-to-r from-[#3B3636] via-[#615E5E] to-[#3B3636]",
                          "flex-1 group flex items-center p-2 mx-1 rounded-md ring-1 ring-gray-300"
                        )
                      }
                      data-tooltip-id={"login"}
                      onClick={() => {
                        setMobileMenuOpen(false)
                      }}
                    >
                      <button className="relative inline-flex items-center justify-center w-full p-1 ">
                        {/* <ArrowLeftOnRectangleIcon className="h-6 w-6 rotate-180" /> */}
                        <img
                          className="h-6 w-6 invert rotate-180"
                          src={login.icon}
                          aria-hidden="true"
                        />
                        <span className=" text-sm font-medium  px-2">
                          {login.name}
                        </span>
                      </button>
                    </NavLink>
                  </>
                )}

                {currentUser && (
                  <div
                    className="flex-1 group flex items-center m-1 p-2 rounded-xl overflow-hidden
                         bg-gradient-to-b from-[#33322C] via-[#30313A] to-[#273943]"
                  >
                    <div className="relative inline-flex items-center justify-start w-full">
                      <div className="flex-shrink-0" data-tooltip-id={"user"}>
                        <img
                          className="h-8 w-8 rounded-full brightness-100"
                          src={currentUser.avatar}
                          alt="Current user Image"
                        />
                      </div>
                      <div className="ml-2">
                        <div className="text-sm font-medium">
                          {currentUser?.first_name} {currentUser?.last_name}
                        </div>
                        <div className="text-xs font-normal">
                          {currentUser?.email}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TransitionChild>

          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}
