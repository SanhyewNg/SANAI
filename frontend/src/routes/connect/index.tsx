// import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
// import { useNavigate } from "react-router-dom"
// import { toast } from "react-toastify"

// import {
//   CommunicationRecordGetSchema,
//   CommunicationRecordsListItemSchema,
//   DeleteCommunicationRecordRequestSchema,
// } from "../../schemas/communication_record.schema"

import ConnectHome from "./ConnectHome"
import ConnectRecord from "./ConnectRecord"
// import communicationRecordsService from "../../api.services/communication_records.service"

// import { useAuth } from "../../contexts/AuthContext"
// import { voices } from "../../constants/voices.constants"

// const voices_available = Array.from(voices)

export default function Connect() {
  // const navigate = useNavigate()
  const { social_name } = useParams()
  // const { currentUser } = useAuth()

  // const [openRecordsAll, setOpenRecordsAll] = useState<
  //   CommunicationRecordsListItemSchema[]
  // >([])
  // const [currentCommunication, setCurrentCommunication] =
  //   useState<CommunicationRecordGetSchema>()
  // const [currentRecord, setCurrentRecord] =
  //   useState<CommunicationRecordGetSchema>()

  // const [allowRightSide, setAllowRightSide] = useState(true)
  // const [allowSpeaker, setAllowSpeaker] = useState(false)
  // const [voice, setVoice] = useState(voices_available[0])
  // const [allowMic, setAllowMic] = useState(true)
  // const [isAudioDirectly, setIsAudioDirectly] = useState(true)
  // const [loading, setLoading] = useState<boolean>(false)

  // const handleRecordsControlsChange = () => {}

  // const deleteCommunicationRecord = async (
  //   communication_record: CommunicationRecordsListItemSchema
  // ) => {
  //   console.log("Deleting a communication record...")
  //   setLoading(true)

  //   const deleteCommunicationRecordRequest: DeleteCommunicationRecordRequestSchema =
  //     {
  //       communication_record_uuid: communication_record?.uuid,
  //     }

  //   try {
  //     const response_deleteCommunicationRecord =
  //       await communicationRecordsService.deleteCommunicationRecord(
  //         deleteCommunicationRecordRequest
  //       )

  //     if (response_deleteCommunicationRecord.success) {
  //       const communicationRecordsList_copy = Array.from(openRecordsAll)
  //       const index = communicationRecordsList_copy.indexOf(
  //         communication_record,
  //         0
  //       )
  //       if (index > -1) {
  //         communicationRecordsList_copy.splice(index, 1)
  //       }
  //       setOpenRecordsAll(communicationRecordsList_copy)
  //       navigate("/communicator")
  //     } else {
  //       toast.error("Failed to delete communication record.")
  //     }
  //   } catch (error) {
  //     console.error("Error deleting communication record:", error)
  //     toast.error("An error occurred while deleting the record.")
  //   } finally {
  //     setLoading(false) // Always set loading to false at the end
  //   }
  // }

  // useEffect(() => {
  //   setIsAudioDirectly(false)
  // }, [allowMic])

  // useEffect(() => {
  //   setCurrentCommunication(undefined)
  //   const fetchData = async () => {
  //     if (communication_id !== undefined) {
  //       const currentCommunication: CommunicationRecordGetSchema = {
  //         id: communication_id,
  //         title: "Communication-" + communication_id,
  //         items: [],
  //       }
  //       setCurrentCommunication(currentCommunication)
  //     }
  //   }

  //   void fetchData()
  // }, [currentUser, communication_id])

  // useEffect(() => {
  //   setLoading(true) // Start loading before fetching data
  //   const fetchData = async () => {
  //     if (currentUser && currentCommunication) {
  //       console.log("currentUser is defined in Communications!")
  //       const currentRecord =
  //         await communicationRecordsService.openRecordOfCommunicationID(
  //           currentCommunication.id
  //         )
  //       setCurrentRecord(currentRecord)
  //     } else {
  //       if (currentCommunication === undefined) {
  //         // Handle case where the communication is undefined
  //       } else {
  //         toast(
  //           "You are not logged-in, so the " +
  //             currentCommunication?.title +
  //             " will not work."
  //         )
  //       }
  //     }
  //     setLoading(false) // Stop loading after fetching data
  //   }

  //   void fetchData()
  // }, [currentUser, currentCommunication])

  // useEffect(() => {
  //   setLoading(true) // Start loading before fetching data
  //   const fetchData = async () => {
  //     if (currentUser !== undefined) {
  //       const openRecordsAll: CommunicationRecordsListItemSchema[] | undefined =
  //         await communicationRecordsService.getCommunicationRecordsAll()
  //       setOpenRecordsAll(openRecordsAll || [])
  //     } else {
  //       console.log("currentUser is undefined in Communications!")
  //     }
  //     setLoading(false) // Stop loading after fetching data
  //   }

  //   void fetchData()
  // }, [currentUser, currentRecord])

  return (
    <>
      {social_name === undefined ? (
        <ConnectHome
        // openRecordsAll={openRecordsAll}
        // deleteCommunicationRecord={deleteCommunicationRecord}
        // loading={loading}
        />
      ) : (
        <ConnectRecord
        // currentUser={currentUser}
        // currentCommunication={currentCommunication}
        // currentRecord={currentRecord}
        // openRecordsAll={openRecordsAll}
        // deleteCommunicationRecord={deleteCommunicationRecord}
        // allowRightSide={allowRightSide}
        // setAllowRightSide={setAllowRightSide}
        // allowSpeaker={allowSpeaker}
        // setAllowSpeaker={setAllowSpeaker}
        // voices_available={voices_available}
        // voice={voice}
        // setVoice={setVoice}
        // allowMic={allowMic}
        // setAllowMic={setAllowMic}
        // isAudioDirectly={isAudioDirectly}
        // setIsAudioDirectly={setIsAudioDirectly}
        // handleRecordsControlsChange={handleRecordsControlsChange}
        />
      )}
    </>
  )
}
