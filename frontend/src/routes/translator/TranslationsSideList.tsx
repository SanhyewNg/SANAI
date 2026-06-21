import { useState, useMemo } from "react"

import NewTranslation from "./NewTranslation"
import SearchTranslations from "./SearchTranslations"
import TranslationsList from "./TranslationsList"

import { TranslationRecordsListItemSchema } from "../../schemas/translation_record.schema"

interface Props {
  currentTranslation: TranslationRecordsListItemSchema
  openRecordsAll: TranslationRecordsListItemSchema[]
  deleteTranslationRecord: any
}

export default function TranslationsSideList({
  currentTranslation,
  openRecordsAll,
  deleteTranslationRecord,
}: Props) {
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Memorize filtered assistants
  const filteredRecordsAll = useMemo(() => {
    return openRecordsAll.filter((openRecord) =>
      openRecord.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [openRecordsAll, searchQuery])

  const handleSearch = (newSearchQuery: string) => {
    setSearchQuery(newSearchQuery)
  }

  console.log("openRecordsAll", openRecordsAll)

  return (
    <div
      className={`flex flex-col flex-shrink-0 h-full  
                  border-l border-gray-200 dark:border-gray-800
                  bg-[#F7F5F7] dark:bg-gray-900
                  ${
                    currentTranslation === undefined
                      ? "w-full lg:!w-[300px]"
                      : "hidden lg:!flex w-[300px]"
                  }`}
    >
      {/* RoomsSidebar header */}
      <div className="flex h-16 items-center justify-center ps-4 pe-4">
        <img
          className="w-8 h-8 invert dark:invert-0"
          src="/assets/icons/translator.svg"
          alt="Icon"
        />
        <span className="block text-lg font-medium pl-4 pr-4">
          Translations
        </span>
        {/* <img
          className="w-7 h-7 rounded-full object-cover  border border-gray-400 dark:border-gray-600 dark:invert"
          src="/assets/icons/translation-icon.svg"
          alt=""
        /> */}
      </div>

      <NewTranslation />

      <SearchTranslations handleSearch={handleSearch} />

      <TranslationsList
        currentTranslation={currentTranslation}
        openRecordsAll={searchQuery == "" ? openRecordsAll : filteredRecordsAll}
        deleteTranslationRecord={deleteTranslationRecord}
      />
    </div>
  )
}
