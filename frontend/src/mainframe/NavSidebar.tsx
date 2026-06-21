import { NavLink } from "react-router-dom"
import { Tooltip as ReactTooltip } from "react-tooltip"
import {
  BellIcon,
  SunIcon,
  MoonIcon,
  StopCircleIcon,
} from "@heroicons/react/24/outline"
import { UserSchema } from "../schemas/user.schema"
import { useTheme } from "../contexts/ThemeContext"
import classNames from "classnames"
import {
  appNavigations,
  accountNavigations,
  login,
  logout,
} from "../constants/nav.constants"

const logo_img = "/assets/Logo-Vector.svg"

// Utility function for joining class names
function joinClassNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

interface Props {
  currentUser: UserSchema | undefined
  setModal: React.Dispatch<React.SetStateAction<boolean>>
  isSidebarCollapsed: boolean
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>> // Strong typing
}

// Component for rendering navigation links
const NavItem = ({
  item,
  isSidebarCollapsed,
}: {
  item: any
  isSidebarCollapsed: boolean
}) => (
  <div key={item.href + "-on-NavSideBar"}>
    <NavLink
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
    >
      <img className="h-6 w-6" src={item.icon} alt="Icon" />
      <span className="px-3">{!isSidebarCollapsed && item.name}</span>
    </NavLink>
    {isSidebarCollapsed && (
      <ReactTooltip id={item.name} place="right" content={item.name} />
    )}
  </div>
)

// Main Sidebar component
export default function NavSidebar({
  currentUser,
  setModal,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}: Props) {
  const { theme, setTheme } = useTheme()

  const ThemeIcon =
    theme === "light" ? SunIcon : theme === "dark" ? MoonIcon : StopCircleIcon

  const toggleTheme = () => {
    const newTheme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light"
    setTheme(newTheme)
  }

  return (
    <div
      className={classNames({
        "hidden lg:flex lg:flex-shrink-0 fixed md:static md:translate-x-0 z-20":
          true,
        "transition-all duration-200 ease-in-out": true,
        "w-[220px]": !isSidebarCollapsed,
        "w-[80px]": isSidebarCollapsed,
        "text-gray-300": true,
      })}
    >
      <div className="flex flex-col w-[220px] text-base">
        {/* Collapse Button */}
        <div
          className={classNames({
            "flex items-center transition-none": true,
            "justify-end": !isSidebarCollapsed,
            "justify-center": isSidebarCollapsed,
          })}
        >
          <button
            className="grid place-content-center w-5 h-5 rounded-md ml-10 mx-2 my-4"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            data-tooltip-id="collapse-btn-tooltip"
          >
            <img
              className={`${isSidebarCollapsed ? "rotate-180" : ""} h-4 w-4`}
              src="/assets/icons/collapse.svg"
              alt="Collapse"
            />
          </button>
          <ReactTooltip
            id="collapse-btn-tooltip"
            place="right"
            content={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          />
        </div>

        {/* Logo and Notification/Theme Section */}
        <div
          className={joinClassNames(
            isSidebarCollapsed
              ? "flex-col pb-2"
              : "flex justify-between pt-4 pb-4",
            "flex items-center px-6 border-b border-gray-700"
          )}
        >
          <div className="flex items-center">
            <img
              className="h-6 w-auto"
              src={logo_img}
              alt="SANAI"
              data-tooltip-id="logo-on-sidebar-tooltip"
            />
            {!isSidebarCollapsed && (
              <span className="text-xl font-medium px-2">SANAI</span>
            )}
            {isSidebarCollapsed && (
              <ReactTooltip
                id="logo-on-sidebar-tooltip"
                place="right"
                content="SANAI"
              />
            )}
          </div>
          <div>
            {!currentUser ? (
              // Show Theme Toggler if NOT logged in
              <button
                className="m-auto p-1 rounded-full hover:ring-2"
                onClick={toggleTheme}
                data-tooltip-id="theme-tooltip"
              >
                <ThemeIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            ) : (
              // Show Notification Icon if logged in
              <NavLink to="#">
                <button
                  className="m-auto p-1 rounded-full hover:ring-2"
                  data-tooltip-id="notification-tooltip"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-5 w-5" />
                </button>
              </NavLink>
            )}
            <ReactTooltip
              id="theme-tooltip"
              place="right"
              content={"Now " + theme + " theme"}
            />
            <ReactTooltip
              id="notification-tooltip"
              place="right"
              content="Notifications"
            />
          </div>
        </div>

        {/* App Navigations */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="">
            {appNavigations.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                isSidebarCollapsed={isSidebarCollapsed}
              />
            ))}
          </nav>

          {/* User Account Navigations */}
          {currentUser && (
            <nav className="border-t border-gray-700">
              {accountNavigations.map((item, key) => (
                <NavItem
                  key={key}
                  item={item}
                  isSidebarCollapsed={isSidebarCollapsed}
                />
              ))}

              {/* Logout */}
              <div
                className="flex items-center rounded-full px-3 py-3 text-sm font-medium mx-4 hover:bg-gradient-to-r from-[#3B3636] via-[#615E5E] to-[#3B3636]"
                onClick={() => setModal(true)}
                data-tooltip-id={logout.name}
              >
                <img className="mr-3 h-6 w-6" src={logout.icon} alt="Logout" />
                <span>{!isSidebarCollapsed && logout.name}</span>
              </div>
              {isSidebarCollapsed && (
                <ReactTooltip id={logout.name} place="right" content="Logout" />
              )}
            </nav>
          )}
        </div>

        {/* Login/Current User Section */}
        <div className="bottom-4 flex items-center px-3 mb-6 w-full border-t border-gray-700 pt-2">
          {!currentUser ? (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                joinClassNames(
                  "flex-1 group flex items-center p-2 m-1 rounded-xl ring-1 ring-gray-500",
                  isActive
                    ? "      bg-gradient-to-r from-[#3B3636] via-[#615E5E] to-[#3B3636]"
                    : "bg-gradient-to-b from-[#33322C] via-[#30313A] to-[#273943] hover:bg-gradient-to-r hover:from-[#3B3636] hover:via-[#615E5E] hover:to-[#3B3636]"
                )
              }
              data-tooltip-id={"login"}
            >
              <button className="relative inline-flex items-center justify-center w-full p-1 ">
                {/* <ArrowLeftOnRectangleIcon className="h-6 w-6 rotate-180" /> */}
                <img
                  className="h-6 w-6 invert rotate-180"
                  src={login.icon}
                  aria-hidden="true"
                />
                {!isSidebarCollapsed && (
                  <span className="text-sm font-medium  px-2">
                    {login.name}
                  </span>
                )}
              </button>
              {isSidebarCollapsed && (
                <ReactTooltip id="login" place="right" content="Login" />
              )}
            </NavLink>
          ) : (
            <div
              className="flex-1 group flex items-center m-1 p-2 rounded-xl overflow-hidden
                         bg-gradient-to-b from-[#33322C] via-[#30313A] to-[#273943]"
            >
              <div className="relative inline-flex items-center justify-start w-full">
                <div className="flex-shrink-0" data-tooltip-id={"user"}>
                  <img
                    className="h-8 w-8 rounded-full brightness-100"
                    src={currentUser.avatar}
                    alt="User Avatar"
                  />
                </div>
                {!isSidebarCollapsed && ( //* if not side-bar collapsed
                  <div className="ml-2">
                    <div className="text-sm font-medium">
                      {currentUser?.first_name} {currentUser?.last_name}
                    </div>
                    <div className="text-xs font-normal">
                      {currentUser?.email}
                    </div>
                  </div>
                )}
              </div>
              {isSidebarCollapsed && ( //* if side-bar collapsed
                <ReactTooltip
                  id="user"
                  place="right"
                  content={
                    "You: " +
                    currentUser?.first_name +
                    " " +
                    currentUser?.last_name
                  }
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
