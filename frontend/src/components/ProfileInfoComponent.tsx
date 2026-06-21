import React, { useState } from "react"

interface ProfileInfoComponentProps {
  label: string
  value: string
  type: "text" | "password" // Type can be text or password
  name: string // Name for input field
  onChange: (name: string, value: string) => void
}

const ProfileInfoComponent: React.FC<ProfileInfoComponentProps> = ({
  label,
  value,
  type,
  name,
  onChange,
}) => {
  const [newValue, setNewValue] = useState(value)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewValue(event.target.value)
  }

  const handleBlur = () => {
    onChange(name, newValue)
  }

  return (
    <div className="mb-4">
      <div className="flex items-center mb-1">
        <div className="w-24 font-medium">{label}</div>
        <input
          type={type}
          value={newValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className="py-1 px-2 border rounded-md ml-2 w-full"
        />
      </div>
    </div>
  )
}

export default ProfileInfoComponent
