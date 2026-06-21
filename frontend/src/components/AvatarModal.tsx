import React, { useState } from "react"

interface AvatarModalProps {
  avatarUrl: string
  onClose: () => void // Function to close the modal
  onSave: (avatarUrl: string) => void // Function to save the selected avatar
}

const AvatarModal: React.FC<AvatarModalProps> = ({
  avatarUrl,
  onClose,
  onSave,
}) => {
  const [newAvatarUrl, setNewAvatarUrl] = useState<string>(avatarUrl)
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          setNewAvatarUrl(e.target.result)
          setFile(selectedFile)
        }
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSaveAvatar = () => {
    if (file) {
      // Perform image upload or processing logic here
      // For simplicity, we'll just return the base64 data URL
      onSave(newAvatarUrl) // Pass the new avatar URL to save
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-4 max-w-lg w-full">
        <div className="flex justify-end">
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="mt-4 flex justify-center items-center">
          <img
            src={newAvatarUrl}
            alt="Avatar Preview"
            className="rounded-full border-2 border-gray-200 max-w-full h-auto"
            style={{ maxWidth: "200px", maxHeight: "200px" }}
          />
        </div>
        <div className="mt-4 flex justify-center">
          <label htmlFor="avatarUpload" className="cursor-pointer">
            <div className="flex items-center justify-center rounded-full border-2 border-gray-200 w-32 h-10">
              <svg
                className="w-6 h-6 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="ml-1 text-sm text-gray-600">Change</span>
            </div>
            <input
              type="file"
              id="avatarUpload"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleSaveAvatar}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default AvatarModal
