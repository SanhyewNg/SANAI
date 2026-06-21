import { useState } from "react"
import { CheckIcon } from "@heroicons/react/24/solid" // Import HeroIcons' check icon

import SubHomeHeader from "../../components/SubHomeHeader"
import FooterMark from "../../components/FooterMark"

export default function Subscription() {
  const [billingType, setBillingType] = useState("monthly")

  return (
    <div className="flex flex-col w-full h-full">
      <SubHomeHeader
        iconSrc="/assets/icons/subscription.svg"
        title="Subscription"
      />

      <div className="flex-1 h-full w-full overflow-y-auto p-6">
        <div className="flex justify-center items-center mb-16">
          <div className="flex flex-col w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-6xl xl:max-w-5xl justify-between items-center">
            {/* Billing Type Tabs */}
            <div className="flex space-x-0 mt-6 mb-6 bg-gray-200 dark:bg-gray-800 p-1 rounded-lg">
              <button
                className={`w-[120px] py-2 px-4 font-semibold ${
                  billingType === "monthly"
                    ? "bg-white text-black shadow-md dark:bg-black dark:text-white"
                    : "bg-gray-200 dark:bg-gray-800 dark:text-white"
                } rounded-lg`}
                onClick={() => setBillingType("monthly")}
              >
                Monthly
              </button>
              <button
                className={`w-[120px] py-2 px-4 font-semibold ${
                  billingType === "yearly"
                    ? "bg-white text-black shadow-md dark:bg-black dark:text-white"
                    : "bg-gray-200 dark:bg-gray-800 dark:text-white"
                } rounded-lg`}
                onClick={() => setBillingType("yearly")}
              >
                Yearly
              </button>
            </div>

            <div className="mb-8 font-semibold text-green-400">
              Saved 33% with annual billing
            </div>

            {/* Subscription Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {/* Lite Plan */}
              <div className="flex flex-col justify-between w-full border border-gray-300 dark:border-gray-700 rounded-lg p-8 bg-[#ebe4f2] dark:bg-gray-800 shadow-lg">
                <div>
                  <div className="flex flex-row items-center mb-4">
                    <img
                      className="w-12 h-12 rounded-full object-cover mr-4"
                      src="/assets/icons/plan-lite.svg"
                      alt="Lite Plan"
                    />
                    <div className="flex flex-col">
                      <h2 className="text-sm font-bold mb-2">LITE</h2>
                      <div className="flex flex-row items-end">
                        <div className="flex flex-row items-start">
                          <p className="text-xs font-bold">{"$"}</p>
                          <p className="text-4xl font-bold">
                            {billingType === "monthly" ? "0" : "0"}
                          </p>
                        </div>
                        <p className="text-xs font-bold">
                          {billingType === "monthly" ? "/mo" : "/yr"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm font-semibold my-6 text-gray-600 dark:text-gray-400">
                    Limited Plan
                  </div>

                  <ul className="list-disc ml-1 my-4 space-y-2 text-sm font-semibold">
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      20 Messages/Week
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />5
                      Experts
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      Message History
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      Human-like Learning & Experience
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      Community Updates
                    </li>
                  </ul>
                </div>

                {/* Subscribe Button */}
                <button className="mt-4 bg-gray-400 dark:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold">
                  Current Plan
                </button>
              </div>

              {/* Pro Plan */}
              <div className="flex flex-col justify-between w-full border border-gray-300 dark:border-gray-700 rounded-lg p-8 bg-[#f2ebe5] dark:bg-gray-800 shadow-lg">
                <div>
                  <div className="flex flex-row items-center mb-4">
                    <img
                      className="w-12 h-12 rounded-full object-cover mr-4"
                      src="/assets/icons/plan-pro.svg"
                      alt="Pro Plan"
                    />
                    <div className="flex flex-col">
                      <h2 className="text-sm font-bold mb-2">PRO</h2>
                      <div className="flex flex-row items-end">
                        <div className="flex flex-row items-start">
                          <p className="text-xs font-bold">{"$"}</p>
                          <p className="text-4xl font-bold">
                            {billingType === "monthly" ? "10" : "80"}
                          </p>
                        </div>
                        <p className="text-xs font-bold">
                          {billingType === "monthly" ? "/mo" : "/yr"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm font-semibold my-6 text-gray-600 dark:text-gray-400">
                    Limitless Plan
                  </div>

                  <ul className="list-disc ml-1 my-4 space-y-2 text-sm font-semibold">
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      No Message Limits
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      Unlimited Experts
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      Message History
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      Human-like Learning & Experience
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      Community Updates
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                      Premium Support
                    </li>
                  </ul>
                </div>

                {/* Subscribe Button */}
                <button
                  className="mt-4 bg-green-400 dark:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold 
                                          hover:bg-green-600 dark:hover:bg-green-400"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        <FooterMark />
      </div>
    </div>
  )
}
