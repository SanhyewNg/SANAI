import { Menu, MenuButton, MenuItems, Switch, Field, Label } from "@headlessui/react"
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline"
import { Tooltip as ReactTooltip } from "react-tooltip"

import VoicesDropdown from "./VoicesDropdown"

interface Props {
  allowRightSide: any
  setAllowRightSide: any
  allowSpeaker: any
  setAllowSpeaker: any
  voices_available: any
  voice: any
  setVoice: any
  allowMic: any
  setAllowMic: any
  isAudioDirectly: any
  setIsAudioDirectly: any
  handleRoomsControlsChange: any
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

////////////////////////////////////////////////////////
export default function TranslatorControlsDropdown({
  allowRightSide,
  setAllowRightSide,
  allowSpeaker,
  setAllowSpeaker,
  voices_available,
  voice,
  setVoice,
  allowMic,
  setAllowMic,
  isAudioDirectly,
  setIsAudioDirectly,
  handleRoomsControlsChange,
}: Props) {
  ////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////
  return (
    <Menu as="div" className="relative min-w-xs z-40">
      <div>
        <MenuButton
          className="h-8 w-8 flex items-center justify-center rounded-md 
                             hover:ring-2 hover:ring-blue-500 hover:text-blue-500 
                             focus:ring-2 focus:ring-blue-500 focus:text-blue-500"
          data-tooltip-id="rooms-controls"
        >
          <span className="sr-only">Open Controls menu</span>
          <AdjustmentsHorizontalIcon className="h-6 w-6" />
        </MenuButton>
        <ReactTooltip
          id="rooms-controls"
          place="left"
          content="Room Controls"
        />
      </div>
      <MenuItems
        transition
        className="origin-top-right absolute right-0 bg-[#F7F5F7] dark:bg-[#101010]
              rounded-md shadow-lg divide-y focus:outline-none border border-gray-300 dark:border-gray-700
              data-[closed]:opacity-0 data-[closed]:scale-95 transition ease-out data-[enter]:duration-200 data-[leave]:duration-200"
      >
        <div className="px-1 w-[250px] h-96 flex justify-between">
          <ul className="m-5 w-full" onChange={handleRoomsControlsChange}>
            {/* Allow Right Side Input On/Off */}
            <Field
              as="li"
              className="pt-3 pb-6 flex items-center justify-between"
            >
              <div className="flex">
                <Label
                  as="p"
                  className="text-sm font-medium"
                  passive
                >
                  Right-side Input
                </Label>
              </div>
              <Switch
                checked={allowRightSide}
                onChange={setAllowRightSide}
                className={classNames(
                  allowRightSide
                    ? "bg-blue-500 dark:bg-blue-900"
                    : "bg-gray-500",
                  "ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500"
                )}
              >
                <span
                  className={classNames(
                    allowRightSide ? "translate-x-5" : "translate-x-0",
                    "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                  )}
                />
              </Switch>
            </Field>

            {/* Speaker On/Off */}
            <Field
              as="li"
              className="py-6 flex items-center justify-between"
            >
              <div className="flex">
                <Label
                  as="p"
                  className="text-sm font-medium"
                  passive
                >
                  Allow Speaker
                </Label>
              </div>
              <Switch
                checked={allowSpeaker}
                onChange={setAllowSpeaker}
                className={classNames(
                  allowSpeaker
                    ? "bg-blue-500 dark:bg-blue-900"
                    : "bg-gray-500",
                  "ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500"
                )}
              >
                <span
                  className={classNames(
                    allowSpeaker ? "translate-x-5" : "translate-x-0",
                    "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                  )}
                />
              </Switch>
            </Field>

            {/* Voice Selection */}
            <div className="py-6 flex items-center justify-between">
              <div
                className={classNames(
                  allowSpeaker ? "" : "text-gray-500",
                  "flex"
                )}
              >
                <span className="text-sm font-medium">Speaker</span>
              </div>

              <div
                className={classNames(
                  allowSpeaker
                    ? "bg-blue-500 dark:bg-blue-900"
                    : "bg-gray-500",
                  "flex items-center  rounded-md z-50"
                )}
              >
                <VoicesDropdown
                  voices_available={voices_available}
                  voice={voice}
                  setVoice={setVoice}
                  disabled={!allowSpeaker}
                />
              </div>
            </div>

            {/* Mic On/Off */}
            <Field
              as="li"
              className="py-6 flex items-center justify-between"
            >
              <div className="flex">
                <Label
                  as="p"
                  className="text-sm font-medium"
                  passive
                >
                  Allow Mic
                </Label>
              </div>
              <Switch
                checked={allowMic}
                onChange={setAllowMic}
                className={classNames(
                  allowMic
                    ? "bg-blue-500 dark:bg-blue-900"
                    : "bg-gray-500",
                  "ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500"
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    allowMic ? "translate-x-5" : "translate-x-0",
                    "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                  )}
                />
              </Switch>
            </Field>

            {/* Audio Direct Send On/Off */}
            <Field
              as="li"
              className="py-6 flex items-center justify-between"
            >
              <div className="flex">
                <Label
                  as="p"
                  className={classNames(
                    allowMic ? "" : "text-gray-500",
                    "text-sm font-medium"
                  )}
                  passive
                >
                  Audio Directly
                </Label>
              </div>
              <Switch
                checked={isAudioDirectly}
                onChange={setIsAudioDirectly}
                className={classNames(
                  !allowMic
                    ? "bg-gray-500"
                    : isAudioDirectly
                    ? "bg-blue-500 dark:bg-blue-900"
                    : "bg-gray-500",
                  "ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500"
                )}
                disabled={!allowMic}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    isAudioDirectly ? "translate-x-5" : "translate-x-0",
                    "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                  )}
                />
              </Switch>
            </Field>
          </ul>
        </div>
      </MenuItems>
    </Menu>
  )
}
