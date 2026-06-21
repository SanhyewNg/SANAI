import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { useContextMenu } from "mantine-contextmenu"
import { TrashIcon } from "@heroicons/react/24/outline"
import { BookmarkIcon as SolidBookmarkIcon } from "@heroicons/react/24/solid"
import { BookmarkIcon as OutlineBookmarkIcon } from "@heroicons/react/24/outline"
// import { ArrowLeftIcon } from "@heroicons/react/24/outline"
// import { Tooltip as ReactTooltip } from "react-tooltip"

import SubHomeHeader from "../../components/SubHomeHeader"
import SearchBox from "../../components/SearchBox"
import { AssistantSchema } from "../../schemas/assistant.schema"
import FooterMark from "../../components/FooterMark"

interface Props {
  assistantsAll: AssistantSchema[]
  contacts: AssistantSchema[]
  deleteAssistanceRoom: (assistant: AssistantSchema) => Promise<void>
}

export default function AssistantsHome({
  assistantsAll,
  contacts,
  deleteAssistanceRoom,
}: Props) {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const showContextMenu = useContextMenu()

  // Memoize filtered assistants
  const filteredAssistantsAll = useMemo(() => {
    return assistantsAll.filter((assistant) =>
      assistant.persona?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [assistantsAll, searchQuery])

  const handleSearch = (newSearchQuery: string) => {
    setSearchQuery(newSearchQuery)
  }

  return (
    <div className="flex flex-col w-full h-full">
      <SubHomeHeader
        iconSrc="/assets/icons/assistants.svg"
        title="Assistants"
      />

      <div className="flex-1 h-full w-full overflow-y-auto ">
        <div className="flex flex-col items-center">
          <div className="flex justify-center rounded-3xl h-[200px] w-[200px] m-4">
            <img
              src="/assets/Sphere.gif"
              className="rounded-full  dark:invert dark:rotate-180"
            />
          </div>
          <h2 className="text-xl font-bold text-center mx-4 flex justify-center items-center">
            Welcome! Please select an assistant to start chatting.
          </h2>
          <div className="my-4">
            <SearchBox handleSearch={handleSearch} />
          </div>
        </div>

        <div className="flex  justify-center items-center">
          <div className="flex max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl justify-between items-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4  mb-32 mx-8">
              {filteredAssistantsAll.map((assistant: any, index: any) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
                >
                  <Link
                    to={
                      "/assistants/" +
                      assistant.persona.replaceAll(" ", "_").toLowerCase()
                    }
                    onContextMenu={
                      contacts.includes(assistant)
                        ? showContextMenu(
                            [
                              {
                                key: "delete",
                                icon: <TrashIcon className="h-4 w-4" />,
                                title: "Delete Chat History",
                                onClick: () => {
                                  deleteAssistanceRoom(assistant)
                                },
                                color: "red",
                              },
                            ],
                            { zIndex: 1000, shadow: "md", borderRadius: "md" }
                          )
                        : undefined // explicitly return undefined if condition is false
                    }
                    className="block"
                  >
                    <img
                      src={assistant.avatar}
                      alt="image"
                      className="object-cover w-full aspect-[4/3]"
                    />
                    <div className="py-2 flex items-center">
                      <div className="flex items-center justify-center flex-grow relative">
                        {contacts.includes(assistant) ? (
                          <SolidBookmarkIcon className="absolute left-2 h-5 w-5 text-green-500" />
                        ) : (
                          <OutlineBookmarkIcon className="absolute left-2 h-5 w-5 text-gray-400" />
                        )}
                        <h3 className="font-normal text-sm text-gray-900 dark:text-white text-center w-full">
                          {assistant.persona}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <FooterMark />
      </div>
    </div>
  )
}
