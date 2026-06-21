import { useState, useEffect } from "react"

import SearchBox from "../../components/SearchBox"
import AssistantsList from "./AssistantsList"

import { AssistantSchema } from "../../schemas/assistant.schema"

interface Props {
  currentAssistant: any
  contacts: any
  nonContacts: any
  deleteAssistanceRoom: any
}

export default function AssistantsSideList({
  currentAssistant,
  contacts,
  nonContacts,
  deleteAssistanceRoom,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("")

  const [filteredContacts, setFilteredContacts] = useState<AssistantSchema[]>(
    []
  )
  const [filteredNonContacts, setFilteredNonContacts] = useState<
    AssistantSchema[]
  >([])

  useEffect(() => {
    handleSearch(searchQuery)
  }, [contacts, nonContacts])

  const handleSearch = (newSearchQuery: any) => {
    setSearchQuery(newSearchQuery)

    const searchedContacts = contacts.filter((contact: any) => {
      return contact.persona
        .toLowerCase()
        .includes(newSearchQuery.toLowerCase())
    })
    setFilteredContacts(searchedContacts)

    const searchedNonContacts = nonContacts.filter((nonContact: any) => {
      return nonContact.persona
        .toLowerCase()
        .includes(newSearchQuery.toLowerCase())
    })
    setFilteredNonContacts(searchedNonContacts)
  }

  // console.log("assistant_uuid", assistant_uuid)

  return (
    <div
      className={`flex flex-col flex-shrink-0 h-full  
                  border-l border-gray-200 dark:border-gray-800
                  bg-[#F7F5F7] dark:bg-gray-900
                  ${
                    currentAssistant === undefined
                      ? "w-full lg:!w-[300px]"
                      : "hidden lg:!flex w-[300px]"
                  }`}
    >
      {/* RoomsSidebar header */}
      <div className="flex h-12 items-end justify-center">
        <img
          className="w-6 h-6 invert dark:invert-none"
          src="/assets/icons/assistants.svg"
          alt="Icon"
        />
        <span className="block ml-2 text-lg font-medium pl-0 pr-4">
          Assistants
        </span>

        {/* <img
          className="w-7 h-7 object-cover"
          src="/assets/icons/chat-svgrepo-com.svg"
          alt=""
        /> */}
      </div>
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-1">
        <SearchBox handleSearch={handleSearch} />
      </div>

      <AssistantsList
        currentAssistant={currentAssistant}
        contacts={searchQuery == "" ? contacts : filteredContacts}
        nonContacts={searchQuery == "" ? nonContacts : filteredNonContacts}
        deleteAssistanceRoom={deleteAssistanceRoom}
      />
    </div>
  )
}
