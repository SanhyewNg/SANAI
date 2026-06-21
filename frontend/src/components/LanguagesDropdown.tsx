/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState, useEffect } from "react"
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react"
import { CheckCircleIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline"

import { languages_v2 } from "../constants/languages.constants"

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ")
}

type Language = {
  code: string // Language code (e.g., "en")
  name: string // Language name in English (e.g., "English")
  local_name: string // Language name in the native language (e.g., "English")
  countries: string[] // Array of country codes where the language is spoken (e.g., ["GB", "US"])
}

type Props = {
  color: string
  setLanguage: any
}

export default function LanguagesDropdown({ color, setLanguage }: Props) {
  const [selected, setSelected] = useState<Language>(languages_v2[0])

  useEffect(() => {
    setLanguage(selected)
  }, [selected])

  // console.log("selected : ", selected)

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative w-[150px]">
        <ListboxButton
          className="relative w-full pl-2 pr-4 py-2 
              text-left 
              rounded-md shadow-sm
            text-white
              cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        >
          <span className="flex items-center">
            <span className="ml-1 block truncate">
              {selected.name + " (" + selected.local_name + ")"}
            </span>
          </span>
          <span className="ml-1 absolute inset-y-0 right-0 flex items-center pr-0 pointer-events-none">
            <ChevronUpDownIcon className="h-6 w-6" aria-hidden="true" />
          </span>
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute mt-1 w-full shadow-lg max-h-64 rounded-b-md rou py-1 text-sm ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm
                bg-white text-black dark:bg-black dark:text-white
                border-x border-b border-gray-300 dark:border-gray-700 z-50
                data-[closed]:opacity-0 transition ease-in data-[leave]:duration-100
                "
        >
          {languages_v2.map((language) => (
            <ListboxOption
              key={language.code}
              className={({ focus }) =>
                classNames(
                  focus
                    ? color == "blue"
                      ? "bg-blue-500 dark:bg-blue-950 text-white"
                      : color == "green"
                      ? "bg-green-500 dark:bg-green-950 text-white"
                      : ""
                    : "",
                  "cursor-default select-none relative py-2 pl-2 pr-4 z-50"
                )
              }
              value={language}
            >
              {({ selected: isSelected, focus }) => (
                <>
                  <div className="flex items-start">
                    <span
                      className={classNames(
                        isSelected ? "font-semibold" : "font-normal",
                        "ml-1 block truncate"
                      )}
                    >
                      {language.name + " (" + language.local_name + ")"}
                    </span>
                  </div>

                  {isSelected ? (
                    <span
                      className={classNames(
                        focus
                          ? "text-white"
                          : "text-black dark:text-white",
                        "absolute inset-y-0 right-0 flex items-center pr-0"
                      )}
                    >
                      <CheckCircleIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </span>
                  ) : null}
                </>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  )
}
