// import { useState } from "react"
import { NavLink } from "react-router-dom"

import { AssistantSchema } from "../../schemas/assistant.schema"
import HeroSection from "./HeroSection"
// import SearchBox from "../../components/SearchBox"
// import TabsBar from "./TabsBar"
// import ImageCardsContainer from "./ImageCardsContainer"
import AssistantsCardsSlider from "./AssistantsCardsSlider"
// import ToolsCardsSlider from "./ToolsCardsSlider"
import ToolsCardsContainer from "./ToolsCardsContainer"
import FooterMark from "../../components/FooterMark"

interface Props {
  assistantsAll: AssistantSchema[]
}

/////////////////////////////////////////////
export default function Home({ assistantsAll }: Props) {
  return (
    <div
      className="flex flex-col w-full h-full overflow-y-auto    
      bg-[#FEFCFE] dark:bg-[#010301] text-black dark:text-white"
    >
      <div className="overflow-y-auto focus:outline-none">
        <HeroSection />

        <div className="flex-1 flex justify-center">
          <div
            // className="flex-1 flex  max-w-[340px] sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl justify-between items-center mt-4 "
            className="flex-1 flex  justify-between items-center mt-4 
                       max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl "
          >
            <NavLink
              to={"/assistants"}
              className="hover:bg-[#F7F5F7] dark:hover:bg-gray-900 rounded-lg"
              // key={index}
            >
              <h1 className="items-center  justify-start flex mx-4 my-2">
                <img
                  className="h-5 w-5 invert dark:invert-0"
                  src="/assets/icons/assistants.svg"
                  aria-hidden="true"
                />
                <span className="px-2 text-lg font-bold">Assistants</span>
              </h1>
            </NavLink>
          </div>
        </div>

        <div className="flex-1 mt-2 mx-2 mb-4">
          <section className="max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl  mx-auto overflow-x-hidden">
            <div
              className="flex flex-wrap overflow-y-auto justify-center 
                      overflow-x-hidden"
            >
              <AssistantsCardsSlider cards={assistantsAll} />
            </div>
          </section>
        </div>

        <div className="flex-1 mt-2 mx-2 mb-4">
          {/* Tools */}
          <div className="flex-1 flex justify-center mt-4">
            <div
              className="flex-1 flex justify-between overflow-x-hidden flex-col
                            max-w-full md:max-w-3xl lg:max-w-4xl"
            >
              <h1 className="flex items-center  justify-start ms-4">
                <img
                  className="h-5 w-5 invert dark:invert-0"
                  src="/assets/icons/tools.svg"
                  aria-hidden="true"
                />
                <span className="px-2 text-md font-bold">Tools</span>
              </h1>

              <div
                className="flex flex-wrap overflow-y-auto justify-center 
                      m-2 md:m-2"
              >
                <ToolsCardsContainer />
              </div>
            </div>
          </div>
        </div>

        <FooterMark />

        {/* <div className="flex-1 mx-2 py-6">
          <section className="max-w-7xl mx-auto">
            <h3 className="font-bold text-sm text-gray-500 my-2">
              Languages supported on San speakers
            </h3>
          </section>
          <LanguageCardsContainer />
        </div> */}
      </div>
    </div>
  )
}
