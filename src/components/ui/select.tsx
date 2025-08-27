"use client";
import * as React from "react";

type Option = { label: string; value: string };

export function Select({ value, onChange, options, placeholder, disabled, className }: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <select
      className={`px-3 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm ${className ?? ''}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-label={placeholder || 'Select'}
    >
      {placeholder ? <option value="" disabled>{placeholder}</option> : null}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}


