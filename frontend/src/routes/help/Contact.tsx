import { Link } from "react-router-dom"

import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { Tooltip as ReactTooltip } from "react-tooltip"
import FooterMark from "../../components/FooterMark"

export default function Contact() {
  return (
    <div className="flex flex-col w-full h-full">
      <header className="flex w-full justify-center border-b border-gray-200 dark:border-gray-800 shadow-md mb-1">
        <div className="flex mt-8 w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-2 justify-between items-center">
          <div className="flex gap-2 items-center">
            {/* Go to Help Home */}
            <Link
              to="/help"
              className="m-2 p-2 rounded-full hover:invert dark:hover:invert-0 hover:bg-gray-300 dark:hover:bg-gray-600"
              data-tooltip-id="back-to-home"
            >
              <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
            <ReactTooltip
              id="back-to-help-home"
              place="left"
              content="Back to Help Home"
            />

            <img
              className="h-6 w-6 invert dark:invert-0"
              src="/assets/icons/contact.svg"
              alt="Icon"
            />
            <span className="ml-2 text-2xl font-bold">Contact</span>
          </div>
        </div>
      </header>

      <div className="flex-1 h-full w-full overflow-y-auto">
        <div className="flex justify-center items-center">
          <div className="flex flex-col max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-5xl justify-between items-center">
            <p className="text-base m-8">
              Have any questions, feedback, or need support? Send me an email at{" "}
              <a href="mailto:talkoceanstar@gmail.com" className="underline">
                talkoceanstar@gmail.com
              </a>
              . I am here to help and ensure your experience with SANAI is as
              smooth as possible.
            </p>
          </div>
        </div>
        <FooterMark />
      </div>
    </div>
  )
}
