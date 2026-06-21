import { Menu, MenuButton, MenuItems, Transition } from "@headlessui/react"
import { NavLink } from "react-router-dom"
import { ArrowLeftOnRectangleIcon, BellIcon } from "@heroicons/react/24/outline"

import { accountNavigations } from "../constants/nav.constants"
import { UserSchema } from "../schemas/user.schema"

function joinClassNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

interface Props {
  currentUser: UserSchema | undefined
}

//////////////////////////////////////////////////////////////////////////
export default function MobileUserDropdown({ currentUser }: Props) {
  return (
    <div className="flex lg:hidden z-40 m-1">
      {/* if not logged in */}
      {!currentUser && (
        <NavLink to="/login">
          <div className="flex grow">
            <span
              className="relative inline-flex items-center justify-center p-1 rounded-full  w-6 h-6
                        bg-gray-500
                        text-sm font-medium text-white dark:text-black
                        hover:ring-offset-2 hover:ring-1 hover:text-white"
            >
              <ArrowLeftOnRectangleIcon className="h-4 w-4 rotate-180" />
            </span>
          </div>
        </NavLink>
      )}

      {/* if logged in */}
      {currentUser && (
        <Menu as="div" className="ml-3 relative">
              <div>
                <MenuButton
                  className="relative inline-flex items-center justify-center p-1 rounded-full w-6 h-6
                  bg-gray-500 text-sm font-medium text-white dark:text-black
                  hover:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-gray-500
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <BellIcon className="h-4 w-4" />
                </MenuButton>
              </div>
              <Transition>
                <MenuItems
                  className="origin-top-right absolute right-0 mt-2 w-[220px] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-500 focus:outline-none
                    bg-gradient-to-b from-[#59544E] via-[#58565C] to-[#4D595F] 
                    dark:bg-gradient-to-b dark:from-[#1D1712] dark:via-[#19151B] dark:to-[#121F26]
                    text-white
                    data-[closed]:opacity-0 data-[closed]:scale-95 transition ease-out data-[enter]:duration-500 data-[leave]:duration-500"
                  >
                    <div className="px-1">
                      {accountNavigations.map((item) => (
                        <NavLink
                          key={item.name}
                          to={item.href}
                          className={({ isActive }) =>
                            joinClassNames(
                              isActive
                                ? "bg-gradient-to-r from-[#6E686B] via-[#878487] to-[#6E686B]         dark:bg-gradient-to-r dark:from-[#3B3636] dark:via-[#615E5E] dark:to-[#3B3636]"
                                : "hover:bg-gradient-to-r from-[#6E686B] via-[#878487] to-[#6E686B]  hover:dark:bg-gradient-to-r dark:from-[#3B3636] dark:via-[#615E5E] dark:to-[#3B3636]",
                              "group flex items-center px-4 py-4 text-sm font-medium rounded-full transition duration-300 m-3"
                            )
                          }
                        >
                          <img
                            className="mr-3 h-6 w-6"
                            src={item.icon}
                            aria-hidden="true"
                          />
                          {item.name}
                        </NavLink>
                      ))}
                    </div>

                    <div className="py-4">
                      <div className="ml-4">
                        <div className="text-base font-medium">
                          View all notifications
                        </div>
                      </div>
                    </div>
                  </MenuItems>
                </Transition>
        </Menu>
      )}
    </div>
  )
}
