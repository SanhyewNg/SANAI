import axios from "axios"

import { 
  TranslationRecordsListItemSchema, 
  TranslationRecordGetSchema, 
  DeleteTranslationRecordItemRequestSchema,
  DeleteTranslationRecordRequestSchema
 } from "../schemas/translation_record.schema"
import { toApiServiceError } from "./apiError"

const baseURL: string = import.meta.env.VITE_BACKEND_API_URL as string

class TranslationRecordsService {
  async getTranslationRecordsAll() {
    try {
      const res = await axios.get(`${baseURL}/all-translation-records`)
      console.log("The response data of getTranslationRecordsAll(): ", res.data)

      return res.data as TranslationRecordsListItemSchema[]
    } catch (error) {
      throw toApiServiceError(error, "Failed to load translation records.")
    }
  }

  async openRecordOfTranslationID(translation_id: string) {
    try {
      const res = await axios.post(
        `${baseURL}/open-record-of-translation_id`,
        translation_id
      )
      console.log("The response data of openRecordOfTranslationID(): ", res.data)

      return res.data as TranslationRecordGetSchema
    } catch (error) {
      throw toApiServiceError(error, "Failed to open translation record.")
    }
  }

  async deleteTranslationRecord(deleteTranslationRecordRequest: DeleteTranslationRecordRequestSchema) {
    try {
      const res = await axios.post(
        `${baseURL}/delete-translation-record`,
        deleteTranslationRecordRequest
      )
      console.log("The response data of deleteTranslationRecord(): ", res.data)

      return res.data
    } catch (error) {
      throw toApiServiceError(error, "Failed to delete translation record.")
    }
  }

  async deleteRecordItem(deleteRecordItemRequest: DeleteTranslationRecordItemRequestSchema) {
    try {
      const res = await axios.post(
        `${baseURL}/delete-item-in-translation-record`,
        deleteRecordItemRequest
      )
      console.log("The response data of deleteRecordItem(): ", res.data)

      return res.data
    } catch (error) {
      throw toApiServiceError(error, "Failed to delete translation record item.")
    }
  }

}

export default new TranslationRecordsService()
