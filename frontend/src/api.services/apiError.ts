import axios from "axios"

type ApiErrorOptions = {
  message: string
  status?: number
  code?: string
  details?: unknown
  cause?: unknown
}

const isValidationIssue = (value: unknown): value is { msg: string } => {
  return typeof value === "object" && value !== null && typeof (value as { msg?: unknown }).msg === "string"
}

const getErrorMessage = (details: unknown, fallbackMessage: string) => {
  if (typeof details === "string" && details.trim()) {
    return details
  }

  if (Array.isArray(details)) {
    const validationMessage = details.filter(isValidationIssue).map((issue) => issue.msg).join("; ")
    if (validationMessage) {
      return validationMessage
    }
  }

  if (typeof details === "object" && details !== null) {
    const detailRecord = details as { message?: unknown; detail?: unknown }
    if (typeof detailRecord.message === "string" && detailRecord.message.trim()) {
      return detailRecord.message
    }
    if (typeof detailRecord.detail === "string" && detailRecord.detail.trim()) {
      return detailRecord.detail
    }
  }

  return fallbackMessage
}

export class ApiServiceError extends Error {
  status?: number
  code?: string
  details?: unknown
  cause?: unknown

  constructor({ message, status, code, details, cause }: ApiErrorOptions) {
    super(message)
    this.name = "ApiServiceError"
    this.status = status
    this.code = code
    this.details = details
    this.cause = cause
  }
}

export const toApiServiceError = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError(error)) {
    const details = error.response?.data ?? error.message
    return new ApiServiceError({
      message: getErrorMessage(details, fallbackMessage),
      status: error.response?.status,
      code: error.code,
      details,
      cause: error,
    })
  }

  if (error instanceof Error) {
    return new ApiServiceError({
      message: error.message || fallbackMessage,
      details: error,
      cause: error,
    })
  }

  return new ApiServiceError({
    message: fallbackMessage,
    details: error,
    cause: error,
  })
}