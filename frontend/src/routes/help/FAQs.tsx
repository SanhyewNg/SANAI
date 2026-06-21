import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline" // Import Chevron icons
import { Tooltip as ReactTooltip } from "react-tooltip"
import FooterMark from "../../components/FooterMark"
import { FAQAs } from "../../constants/faqs.constants"

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null) // Track which FAQ is open

  const toggleFAQ = (index: number) => {
    // Add type annotation here
    setOpenIndex(openIndex === index ? null : index)
  }

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
              src="/assets/icons/faqs.svg"
              alt="Icon"
            />
            <span className="ml-2 text-2xl font-bold">FAQs</span>
          </div>
        </div>
      </header>

      <div className="flex-1 h-full w-full overflow-y-auto p-4">
        <div className="flex flex-col max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-5xl mx-auto">
          {FAQAs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-900 shadow-md rounded-lg mb-4 cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center p-4">
                <h4 className="font-semibold">{faq.question}</h4>
                {openIndex === index ? (
                  <ChevronUpIcon className="h-5 w-5" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5" />
                )}
              </div>
              {openIndex === index && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <FooterMark />
      </div>
    </div>
  )
}
