import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import { AssistantSchema } from "../../schemas/assistant.schema"
import {
  AssistanceRoomGetSchema,
  AssistanceRoomListItemSchema,
  DeleteAssistanceRoomRequestSchema,
} from "../../schemas/assiatant_room.schema"

import AssistanceRoom from "./AssistanceRoom"
import AssistantsHome from "./AssistantsHome"
import assistanceRoomsService from "../../api.services/assistance_rooms.service"

import { useAuth } from "../../contexts/AuthContext"

interface Props {
  assistantsAll: AssistantSchema[]
}

export default function Assistants({ assistantsAll }: Props) {
  const navigate = useNavigate()
  const { assistant_persona } = useParams()
  const { currentUser } = useAuth()

  const [openRoomsAll, setOpenRoomsAll] = useState<
    AssistanceRoomListItemSchema[]
  >([])

  const [contactsIds, setContactsIds] = useState<string[]>([])
  const [contacts, setContacts] = useState<AssistantSchema[]>([])
  const [nonContacts, setNonContacts] = useState<AssistantSchema[]>([])

  const [currentAssistant, setCurrentAssistant] = useState<AssistantSchema>()
  const [currentRoom, setCurrentRoom] = useState<AssistanceRoomGetSchema>()

  const [allowSpeaker, setAllowSpeaker] = useState(false)
  const [allowMic, setAllowMic] = useState(true)
  const [isAudioDirectly, setIsAudioDirectly] = useState(false)

  // Handle room deletion
  const deleteAssistanceRoom = async (
    assistant: AssistantSchema
  ): Promise<void> => {
    console.log("Deleting assistance room for assistant:", assistant.uuid)

    const assistanceRoom = openRoomsAll.find(
      (openRoom) => openRoom.assistant_uuid === assistant.uuid
    )

    if (!assistanceRoom) return

    const deleteAssistantRoomRequest: DeleteAssistanceRoomRequestSchema = {
      assistance_room_uuid: assistanceRoom.uuid,
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const response = await assistanceRoomsService.deleteAssistanceRoom(
        deleteAssistantRoomRequest
      )
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (response.success) {
        setOpenRoomsAll((prevRooms) =>
          prevRooms.filter((room) => room.uuid !== assistanceRoom.uuid)
        )
        toast.success(`Room for ${assistant.persona} deleted successfully`)
        navigate("/assistants")
      }
    } catch (error) {
      console.error("Error deleting assistance room:", error)
      toast.error("Failed to delete the assistance room")
    }
  }

  ////////////////////////////////////////////////////////

  // setCurrentAssistant
  useEffect(() => {
    setCurrentAssistant(undefined)
    const fetchData = async () => {
      if (assistant_persona != undefined) {
        const currentAssistant = assistantsAll.find(
          (assistant) =>
            assistant.persona.replaceAll(" ", "_").toLowerCase() ==
            assistant_persona.toLowerCase()
        )
        setCurrentAssistant(currentAssistant)
      }
    }

    void fetchData()
  }, [currentUser, assistantsAll, assistant_persona])

  // setCurrentRoom
  useEffect(() => {
    if (currentUser && currentAssistant) {
      console.log("currentUser is defined in Assistants !")
      const fetchData = async () => {
        const currentRoom =
          await assistanceRoomsService.openRoomOfAssistantUUID(
            currentAssistant.uuid
          )
        setCurrentRoom(currentRoom)
      }

      void fetchData()
      // if (!msgTextArray) {
      //   setIsCardView(true)
      // }
    } else {
      if (currentAssistant == undefined) {
        // toast("You are not logged-in, so the assistants will not reply.")
      } else {
        toast(
          "You are not logged-in, so the assistant " +
            currentAssistant?.persona +
            " will not reply."
        )
      }
    }
  }, [currentUser, currentAssistant])

  // setOpenRoomsAll
  useEffect(() => {
    // setOpenRoomsAll([])

    const fetchData = async () => {
      if (currentUser !== undefined) {
        const openRoomsAll: AssistanceRoomListItemSchema[] | undefined =
          await assistanceRoomsService.getAllOpenRooms()
        setOpenRoomsAll(openRoomsAll || [])
      } else {
        console.log("currentUser is undefined in Assistants !")
        // toast("You are not logged-in, so the assistant does not reply.")
      }
    }

    void fetchData()
  }, [currentUser, currentRoom])

  // setContactsIds
  useEffect(() => {
    const contactsIds = openRoomsAll.map((openRoom: any) => {
      return openRoom?.assistant_uuid
    })
    setContactsIds(contactsIds)
  }, [openRoomsAll, currentUser, currentRoom])

  // setContacts
  useEffect(() => {
    setContacts(
      assistantsAll.filter((assistant: AssistantSchema) =>
        contactsIds.includes(assistant.uuid)
      )
    )
  }, [contactsIds, assistantsAll, currentUser, currentRoom])

  // setNonContacts
  useEffect(() => {
    setNonContacts(
      assistantsAll.filter(
        (assistant: AssistantSchema) => !contactsIds.includes(assistant.uuid)
      )
    )
  }, [contactsIds, assistantsAll, currentUser, currentRoom])

  // console.log("currentUser: ", currentUser)
  // console.log("currentAssistant: ", currentAssistant)
  // console.log("contacts: ", contacts)

  return (
    <>
      {!assistant_persona ? (
        <AssistantsHome
          assistantsAll={assistantsAll}
          contacts={contacts}
          deleteAssistanceRoom={deleteAssistanceRoom}
        />
      ) : (
        <AssistanceRoom
          currentUser={currentUser}
          currentAssistant={currentAssistant}
          currentRoom={currentRoom}
          allowSpeaker={allowSpeaker}
          setAllowSpeaker={setAllowSpeaker}
          allowMic={allowMic}
          setAllowMic={setAllowMic}
          isAudioDirectly={isAudioDirectly}
          setIsAudioDirectly={setIsAudioDirectly}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          handleRoomsControlsChange={() => {}}
          contacts={contacts}
          nonContacts={nonContacts}
          deleteAssistanceRoom={deleteAssistanceRoom}
        />
      )}
    </>
  )
}
