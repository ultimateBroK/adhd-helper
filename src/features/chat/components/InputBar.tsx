"use client"

import { PromptInput, PromptInputTextarea, PromptInputActions } from "@/components/ui/prompt-input"
import { RocketButton } from "@/components/ui/rocket-button"
import { useState } from "react"
import SuggestionChips from "./SuggestionChips"
import ModelSelect from "./ModelSelect"

export default function InputBar({
  value,
  onChange,
  onSubmit,
  disabled,
  models,
  selectedModel,
  onModelChange,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  disabled?: boolean
  models: string[]
  selectedModel: string
  onModelChange: (model: string) => void
}) {
  const [inputValue, setInputValue] = useState(value)

  const handleSubmit = () => {
    if (inputValue.trim() && !disabled) {
      onSubmit()
      // clear input after sending
      setInputValue("")
      onChange("")
    }
  }

  return (
    <div className="w-full space-y-4 pb-4">
      <div className="input-container">
        <div className="flex gap-3 items-center">
          <div className="flex-shrink-0">
            <ModelSelect 
              models={models} 
              selected={selectedModel} 
              onChange={onModelChange} 
              disabled={disabled}
            />
          </div>
          <PromptInput
            value={inputValue}
            onValueChange={(v) => {
              setInputValue(v)
              onChange(v)
            }}
            onSubmit={handleSubmit}
            isLoading={disabled}
            className="flex-1"
          >
            <PromptInputTextarea
              placeholder="Type a message or click a suggestion..."
              disabled={disabled}
              className="text-base placeholder:text-slate-500 flex-1"
            />
            <PromptInputActions>
              <RocketButton
                onClick={handleSubmit}
                disabled={!inputValue.trim() || disabled}
              />
            </PromptInputActions>
          </PromptInput>
        </div>
      </div>
      <SuggestionChips onPick={(v) => {
        setInputValue(v)
        onChange(v)
      }} />
    </div>
  )
}