/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import axios from "axios"

import { AssistantSchema } from "../schemas/assistant.schema"
import { toApiServiceError } from "./apiError"

const baseURL: string = import.meta.env.VITE_BACKEND_API_URL as string

class PreviewService {
  async getAllAssistants() {
    try {
      const res = await axios.get(`${baseURL}/all-assistants`)
      console.log("The response data of getAllAssistants(): ", res.data)

      return res.data as AssistantSchema[]
    } catch (error) {
      throw toApiServiceError(error, "Failed to load assistants.")
    }
  }

 
}

export default new PreviewService()
