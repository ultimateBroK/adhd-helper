"use client"

import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { useRef } from "react"

export function RocketButton({ 
  onClick, 
  disabled,
  className
}: { 
  onClick: () => void
  disabled?: boolean
  className?: string
}) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const iconRef = useRef<SVGSVGElement>(null)

  return (
    <Button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      size="lg"
      className={`bg-gradient-to-r from-[rgb(52,211,153)] to-[#2dd4bf] hover:from-[#2dd4bf] hover:to-[rgb(52,211,153)] text-black shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 ${className}`}
    >
      <Send ref={iconRef} className="w-5 h-5" />
    </Button>
  )
}