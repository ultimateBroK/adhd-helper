"use client"

import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { useEffect, useRef } from "react"
import { animateElement } from "@/lib/animations/anime"

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

  useEffect(() => {
    if (!disabled && buttonRef.current && iconRef.current) {
      // Add hover animation to button
      const button = buttonRef.current
      const icon = iconRef.current
      
      const handleMouseEnter = () => {
        animateElement(button, {
          translateY: [-2, 0],
          duration: 300
        })
        
        animateElement(icon, {
          rotate: [0, 20],
          duration: 300
        })
      }
      
      const handleMouseLeave = () => {
        animateElement(button, {
          translateY: [0, 0],
          duration: 300
        })
        
        animateElement(icon, {
          rotate: [20, 0],
          duration: 300
        })
      }
      
      button.addEventListener("mouseenter", handleMouseEnter)
      button.addEventListener("mouseleave", handleMouseLeave)
      
      return () => {
        button.removeEventListener("mouseenter", handleMouseEnter)
        button.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [disabled])

  const handleClick = () => {
    if (iconRef.current) {
      // Animate the rocket launch
      animateElement(iconRef.current, {
        translateY: [0, -20],
        opacity: [1, 0],
        duration: 600,
        delay: 100
      }).then(() => {
        // Reset position after animation
        if (iconRef.current) {
          iconRef.current.style.transform = ""
          iconRef.current.style.opacity = ""
        }
        // Execute the actual click handler
        onClick()
      })
    } else {
      onClick()
    }
  }

  return (
    <Button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      size="lg"
      className={`bg-gradient-to-r from-[rgb(52,211,153)] to-[#2dd4bf] hover:from-[#2dd4bf] hover:to-[rgb(52,211,153)] text-black shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 ${className}`}
    >
      <Send ref={iconRef} className="w-5 h-5" />
    </Button>
  )
}