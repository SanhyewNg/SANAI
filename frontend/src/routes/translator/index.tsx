import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import {
  TranslationRecordGetSchema,
  TranslationRecordsListItemSchema,
  DeleteTranslationRecordRequestSchema,
} from "../../schemas/translation_record.schema"

import TranslatorHome from "./TranslatorHome"
import TranslationRecord from "./TranslationRecord"
import translationRecordsService from "../../api.services/translation_records.service"

import { useAuth } from "../../contexts/AuthContext"
import { voices } from "../../constants/voices.constants"

const voices_available = Array.from(voices)

export default function Translator() {
  const navigate = useNavigate()
  const { translation_id } = useParams()
  const { currentUser } = useAuth()

  const [openRecordsAll, setOpenRecordsAll] = useState<
    TranslationRecordsListItemSchema[]
  >([])
  const [currentTranslation, setCurrentTranslation] =
    useState<TranslationRecordGetSchema>()
  const [currentRecord, setCurrentRecord] =
    useState<TranslationRecordGetSchema>()

  const [allowRightSide, setAllowRightSide] = useState(true)
  const [allowSpeaker, setAllowSpeaker] = useState(false)
  const [voice, setVoice] = useState(voices_available[0])
  const [allowMic, setAllowMic] = useState(true)
  const [isAudioDirectly, setIsAudioDirectly] = useState(true)
  const [loading, setLoading] = useState<boolean>(false)

  const handleRecordsControlsChange = () => {}

  const deleteTranslationRecord = async (
    translation_record: TranslationRecordsListItemSchema
  ) => {
    console.log("Deleting a translation record...")
    setLoading(true)

    const deleteTranslationRecordRequest: DeleteTranslationRecordRequestSchema =
      {
        translation_record_uuid: translation_record?.uuid,
      }

    try {
      const response_deleteTranslationRecord =
        await translationRecordsService.deleteTranslationRecord(
          deleteTranslationRecordRequest
        )

      if (response_deleteTranslationRecord.success) {
        const translationRecordsList_copy = Array.from(openRecordsAll)
        const index = translationRecordsList_copy.indexOf(translation_record, 0)
        if (index > -1) {
          translationRecordsList_copy.splice(index, 1)
        }
        setOpenRecordsAll(translationRecordsList_copy)
        navigate("/translator")
      } else {
        toast.error("Failed to delete translation record.")
      }
    } catch (error) {
      console.error("Error deleting translation record:", error)
      toast.error("An error occurred while deleting the record.")
    } finally {
      setLoading(false) // Always set loading to false at the end
    }
  }

  useEffect(() => {
    setIsAudioDirectly(false)
  }, [allowMic])

  useEffect(() => {
    setCurrentTranslation(undefined)
    const fetchData = async () => {
      if (translation_id !== undefined) {
        const currentTranslation: TranslationRecordGetSchema = {
          id: translation_id,
          title: "Translation-" + translation_id,
          items: [],
        }
        setCurrentTranslation(currentTranslation)
      }
    }

    void fetchData()
  }, [currentUser, translation_id])

  useEffect(() => {
    setLoading(true) // Start loading before fetching data
    const fetchData = async () => {
      if (currentUser && currentTranslation) {
        console.log("currentUser is defined in Translations!")
        const currentRecord =
          await translationRecordsService.openRecordOfTranslationID(
            currentTranslation.id
          )
        setCurrentRecord(currentRecord)
      } else {
        if (currentTranslation === undefined) {
          // Handle case where the translation is undefined
        } else {
          toast(
            "You are not logged-in, so the " +
              currentTranslation?.title +
              " will not work."
          )
        }
      }
      setLoading(false) // Stop loading after fetching data
    }

    void fetchData()
  }, [currentUser, currentTranslation])

  useEffect(() => {
    setLoading(true) // Start loading before fetching data
    const fetchData = async () => {
      if (currentUser !== undefined) {
        const openRecordsAll: TranslationRecordsListItemSchema[] | undefined =
          await translationRecordsService.getTranslationRecordsAll()
        setOpenRecordsAll(openRecordsAll || [])
      } else {
        console.log("currentUser is undefined in Translations!")
      }
      setLoading(false) // Stop loading after fetching data
    }

    void fetchData()
  }, [currentUser, currentRecord])

  return (
    <>
      {translation_id === undefined ? (
        <TranslatorHome
          openRecordsAll={openRecordsAll}
          deleteTranslationRecord={deleteTranslationRecord}
          loading={loading}
        />
      ) : (
        <TranslationRecord
          currentUser={currentUser}
          currentTranslation={currentTranslation}
          currentRecord={currentRecord}
          openRecordsAll={openRecordsAll}
          deleteTranslationRecord={deleteTranslationRecord}
          allowRightSide={allowRightSide}
          setAllowRightSide={setAllowRightSide}
          allowSpeaker={allowSpeaker}
          setAllowSpeaker={setAllowSpeaker}
          voices_available={voices_available}
          voice={voice}
          setVoice={setVoice}
          allowMic={allowMic}
          setAllowMic={setAllowMic}
          isAudioDirectly={isAudioDirectly}
          setIsAudioDirectly={setIsAudioDirectly}
          handleRecordsControlsChange={handleRecordsControlsChange}
        />
      )}
    </>
  )
}
