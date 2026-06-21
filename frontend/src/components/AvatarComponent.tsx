import React from "react"

interface AvatarComponentProps {
  avatarUrl: string
  onClick: () => void // Function to handle click event
}

const AvatarComponent: React.FC<AvatarComponentProps> = ({
  avatarUrl,
  onClick,
}) => {
  return (
    <div className="relative">
      <img
        src={avatarUrl}
        alt="Avatar"
        className="w-24 h-24 rounded-full cursor-pointer"
        onClick={onClick} // Handle click event to open modal
      />
    </div>
  )
}

export default AvatarComponent
