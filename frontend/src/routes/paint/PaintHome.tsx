// import { Link } from "react-router-dom"
// import { ArrowRightIcon } from "@heroicons/react/24/solid" // Import Heroicons ArrowRightIcon

import SubHomeHeader from "../../components/SubHomeHeader"
import FooterMark from "../../components/FooterMark"

export default function PaintHome() {
  return (
    <div className="flex flex-col w-full h-full">
      <SubHomeHeader iconSrc="/assets/icons/paint.svg" title="Paint" />

      <div className="flex-1 h-full w-full overflow-y-auto">
        <div className="flex flex-col items-center">
          <div className="flex justify-center h-[200px] w-[200px] m-4">
            <img
              src="/assets/Sphere.gif"
              className="dark:invert dark:rotate-180"
            />
          </div>
          <h2 className="text-xl font-bold text-center mx-4 flex justify-center items-center">
            Welcome! Paint images.
          </h2>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex flex-col w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-5xl px-4">
            {/* Section */}
          </div>
        </div>
        <FooterMark />
      </div>
    </div>
  )
}
