// LoadingIndicator.tsx
import React from "react"
import {
  FadingBalls,
  BarWave,
  Messaging,
  BouncingBalls,
} from "react-cssfx-loading"

interface StatusIndicatorProps {
  inputStatus: "idle" | "typing" | "recording" | "transcribing" | "answering"
  currentSide: "left" | "right"
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  inputStatus,
  currentSide,
}) => {
  const color = currentSide === "left" ? "#3B82F6" : "#22C55E"

  const loadingComponents = {
    idle: <></>,
    typing: <BouncingBalls color={color} />,
    recording: (
      <BarWave width="64px" height="32px" duration="0.8s" color={color} />
    ),
    transcribing: <FadingBalls color={color} />,
    answering: <Messaging color={color} />,
  }

  return (
    loadingComponents[inputStatus] && (
      <div className="flex-1 flex justify-center py-4">
        {loadingComponents[inputStatus]}
      </div>
    )
  )
}

export default StatusIndicator
