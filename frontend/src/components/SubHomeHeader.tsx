// import { Link } from "react-router-dom"
// import { ArrowLeftIcon } from "@heroicons/react/24/outline"
// import { Tooltip as ReactTooltip } from "react-tooltip"

interface HeaderProps {
  iconSrc: string
  title: string
}

export default function SubHomeHeader({ iconSrc, title }: HeaderProps) {
  return (
    <header className="flex w-full justify-center border-b border-gray-200 dark:border-gray-800 shadow-md dark:mb-0 mb-1">
      <div className="flex-1 flex mt-2 mb-2 max-w-[340px] sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl  2xl:max-w-6xl px-8">
        <div className="flex h-full w-full flex-col sm:flex-row justify-between items-center sm:items-end">
          <div className="flex h-16 items-center justify-start">
            {/* Go to Assistants Home */}
            {/* <Link
              to="/"
              className="m-2 p-2 rounded-full  hover:invert dark:hover:invert-0 hover:bg-gray-300 dark:hover:bg-gray-600 hidden sm:block"
              data-tooltip-id="back-to-home"
            >
              <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
            <ReactTooltip
              id="back-to-home"
              place="left"
              content="Back to Home"
            /> */}

            <img
              className="h-6 w-6 invert dark:invert-0"
              src={iconSrc}
              alt="Icon"
            />
            <span className="ml-2 text-2xl font-bold">{title}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
