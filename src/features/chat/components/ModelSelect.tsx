"use client";
import { Select } from "@/components/ui/select";

export default function ModelSelect({ models, selected, onChange, disabled }: {
  models: string[];
  selected: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="min-w-[220px] max-w-[320px]">
      <Select
        value={selected}
        onChange={onChange}
        className="w-full truncate"
        options={(models.length ? models : [selected]).map((m) => ({ label: compactModelName(m), value: m }))}
        placeholder="Chọn model"
        disabled={disabled}
      />
    </div>
  );
}

function compactModelName(m: string) {
  const parts = m.split('/');
  const last = parts[parts.length - 1];
  const [name, tag] = last.split(':');
  const cleaned = name.replace(/-GGUF$/i, '');
  return tag ? `${cleaned} (${tag})` : cleaned;
}


