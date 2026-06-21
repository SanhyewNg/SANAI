import { Link } from "react-router-dom"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { Tooltip as ReactTooltip } from "react-tooltip"
import FooterMark from "../../components/FooterMark"

export default function About() {
  return (
    <div className="flex flex-col w-full h-full">
      <header className="flex w-full justify-center border-b border-gray-200 dark:border-gray-800 shadow-md mb-1">
        <div className="flex mt-8 w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-2 justify-between items-center">
          <div className="flex gap-2 items-center">
            {/* Go to Help Home */}
            <Link
              to="/help"
              className="m-2 p-2 rounded-full hover:invert dark:hover:invert-0 hover:bg-gray-300 dark:hover:bg-gray-600"
              data-tooltip-id="back-to-help-home"
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
              src="/assets/icons/about.svg"
              alt="Icon"
            />
            <span className="ml-2 text-2xl font-bold">About</span>
          </div>
        </div>
      </header>

      <div className="flex-1 h-full w-full overflow-y-auto">
        <div className="flex justify-center items-center px-8 py-8">
          <div className="flex flex-col max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-5xl">
            {/* Content Area */}
            {/* <h2 className="text-xl font-semibold mb-4">About SANAI</h2> */}
            <p className="mb-4 text-base">
              SANAI is your next-gen personal life assistant, designed to
              revolutionize the way you interact with technology. We aim to
              bridge the AI gap for everyday users by delivering a human-like
              experience in every interaction. With intuitive language
              processing, real-time learning, and a persona that feels like a
              close friend, SANAI is more than just a digital assistant – it's
              your BFF and expert on everything.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-2">Key Features</h3>
            <ul className="list-disc ml-5 text-base mb-4">
              <li>Human-like interaction with contextual understanding</li>
              <li>
                Personalized voice and text chat, remembering user interactions
              </li>
              <li>
                Expert on all topics, providing trustworthy and reliable
                information
              </li>
              <li>Real-time language translation for text and speech</li>
              <li>Art and image creation based on user inputs</li>
              <li>
                Integrated social media and email support for a seamless
                experience
              </li>
              <li>
                Online media access with built-in music and video playback
              </li>
              <li>
                User-friendly interface with responsive design and dark mode
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <FooterMark />
      </div>
    </div>
  )
}
