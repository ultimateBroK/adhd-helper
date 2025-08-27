"use client";

import { useState } from "react";
import { PromptInput, PromptInputTextarea, PromptInputActions } from "@/components/ui/prompt-input";
import { RocketButton } from "@/components/ui/rocket-button";
import SuggestionChips from "./SuggestionChips";
import ModelSelect from "./ModelSelect";

/**
 * Props for the InputBar component
 */
interface InputBarProps {
  /** Current input value */
  value: string;
  /** Callback when input value changes */
  onChange: (value: string) => void;
  /** Callback when message is submitted */
  onSubmit: () => void;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Available AI models */
  models: string[];
  /** Currently selected model */
  selectedModel: string;
  /** Callback when model selection changes */
  onModelChange: (model: string) => void;
}

/**
 * Chat input bar component that handles message composition and submission
 * Includes model selection, suggestion chips, and input validation
 */
export default function InputBar({
  value,
  onChange,
  onSubmit,
  disabled = false,
  models,
  selectedModel,
  onModelChange,
}: InputBarProps) {
  const [inputValue, setInputValue] = useState(value);

  /**
   * Handles form submission with validation
   */
  const handleSubmit = () => {
    const trimmedValue = inputValue.trim();

    if (trimmedValue && !disabled) {
      onSubmit();
      // Clear input after sending
      setInputValue("");
      onChange("");
    }
  };

  /**
   * Handles input value changes from both internal state and external props
   */
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    onChange(newValue);
  };

  /**
   * Handles suggestion chip selection
   */
  const handleSuggestionPick = (suggestion: string) => {
    setInputValue(suggestion);
    onChange(suggestion);
  };

  const isSubmitDisabled = !inputValue.trim() || disabled;

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
            onValueChange={handleInputChange}
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
                disabled={isSubmitDisabled}
              />
            </PromptInputActions>
          </PromptInput>
        </div>
      </div>

      <SuggestionChips onPick={handleSuggestionPick} />
    </div>
  );
}