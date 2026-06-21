import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { useContextMenu } from "mantine-contextmenu"
import { TrashIcon } from "@heroicons/react/24/outline"
// import { ArrowLeftIcon } from "@heroicons/react/24/outline"
// import { Tooltip as ReactTooltip } from "react-tooltip"

import SubHomeHeader from "../../components/SubHomeHeader"
import SearchBox from "../../components/SearchBox"
import FooterMark from "../../components/FooterMark"
import { TranslationRecordsListItemSchema } from "../../schemas/translation_record.schema"
import NewTranslation from "./NewTranslation"
import Spinner from "../../components/Spinner"

interface Props {
  openRecordsAll: TranslationRecordsListItemSchema[]
  deleteTranslationRecord: any
  loading: boolean
}

export default function TranslatorHome({
  openRecordsAll,
  deleteTranslationRecord,
  loading,
}: Props) {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const showContextMenu = useContextMenu()

  // Memoize filtered translation records based on search query
  const filteredRecordsAll = useMemo(() => {
    return openRecordsAll.filter((openRecord) =>
      openRecord.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [openRecordsAll, searchQuery])

  const handleSearch = (newSearchQuery: string) => {
    setSearchQuery(newSearchQuery)
  }

  return (
    <div className="flex flex-col w-full h-full">
      <SubHomeHeader
        iconSrc="/assets/icons/translator.svg"
        title="Translator"
      />

      <div className="flex-1 h-full w-full overflow-y-auto">
        <div className="flex flex-col items-center m-4">
          <div className="flex justify-center h-[200px] w-[200px]">
            <img
              src="/assets/Sphere.gif"
              className="dark:invert dark:rotate-180"
            />
          </div>
          <h2 className="text-xl font-bold text-center mx-4 flex justify-center items-center">
            Welcome! Translate spoken or written language with the best
            correctness.
          </h2>
        </div>

        <div className="flex justify-center items-center">
          <div className="flex flex-col max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl justify-between items-center">
            <div className="py-8">
              <NewTranslation />
            </div>

            {/* Display spinner when loading */}
            {loading && (
              <div className="p-8 flex items-center">
                <Spinner width={10} height={10} />
                {" Loading your translation records..."}
              </div>
            )}

            {/* Display translation records if any, else show a fallback message */}
            {!loading && filteredRecordsAll.length > 0 ? (
              <>
                <div className="flex flex-row w-full justify-between py-4 px-8 items-center">
                  <div className="w-full border-b border-gray-300 dark:border-gray-700">
                    <div className="font-semibold text-md">
                      Your Translation Records
                    </div>
                  </div>

                  {filteredRecordsAll.length > 5 ? (
                    <div className="">
                      <SearchBox handleSearch={handleSearch} />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-32 mx-8">
                  {filteredRecordsAll.map((openRecord: any, index: any) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300 p-2"
                    >
                      <Link
                        to={"/translator/" + openRecord.id}
                        onContextMenu={showContextMenu(
                          [
                            {
                              key: "delete",
                              icon: <TrashIcon className="h-4 w-4" />,
                              title: "Delete this record",
                              onClick: () => {
                                deleteTranslationRecord(openRecord)
                              },
                              color: "red",
                            },
                          ],
                          { zIndex: 1000, shadow: "md", borderRadius: "md" }
                        )}
                        className="block"
                      >
                        <img
                          className="w-full aspect-[4/2] rounded-md object-fill  border border-gray-400 dark:invert"
                          src="/assets/icons/translation-icon.svg"
                          alt="Translation Icon"
                        />
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white text-center w-full">
                          {openRecord?.title === ""
                            ? "Translation-" + openRecord.id
                            : openRecord?.title}
                        </h3>
                      </Link>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        <FooterMark />
      </div>
    </div>
  )
}
