"use client";

import { Select } from "@/components/ui/select";

/**
 * Props for the ModelSelect component
 */
interface ModelSelectProps {
  /** Array of available model names */
  models: string[];
  /** Currently selected model */
  selected: string;
  /** Callback when model selection changes */
  onChange: (value: string) => void;
  /** Whether the select is disabled */
  disabled?: boolean;
}

/**
 * Configuration for the model select component
 */
const MODEL_SELECT_CONFIG = {
  /** Placeholder text when no model is selected */
  placeholder: "Select model",
  /** Minimum width of the select */
  minWidth: "180px",
  /** Maximum width of the select */
  maxWidth: "220px",
} as const;

/**
 * Select component for choosing AI models
 * Displays models in a compact, readable format
 */
export default function ModelSelect({
  models,
  selected,
  onChange,
  disabled = false
}: ModelSelectProps) {
  const availableModels = models.length ? models : [selected];

  return (
    <div
      className="min-w-[180px] max-w-[220px]"
      style={{
        minWidth: MODEL_SELECT_CONFIG.minWidth,
        maxWidth: MODEL_SELECT_CONFIG.maxWidth
      }}
    >
      <Select
        value={selected}
        onChange={onChange}
        className="w-full truncate h-[60px] flex items-center"
        options={availableModels.map((model) => ({
          label: compactModelName(model),
          value: model
        }))}
        placeholder={MODEL_SELECT_CONFIG.placeholder}
        disabled={disabled}
      />
    </div>
  );
}

/**
 * Converts a full model name to a compact, readable format
 * Removes unnecessary parts and formats for display
 */
function compactModelName(modelName: string): string {
  const parts = modelName.split('/');
  const last = parts[parts.length - 1];
  const [name, tag] = last.split(':');
  const cleaned = name.replace(/-GGUF$/i, '');
  return tag ? `${cleaned} (${tag})` : cleaned;
}


