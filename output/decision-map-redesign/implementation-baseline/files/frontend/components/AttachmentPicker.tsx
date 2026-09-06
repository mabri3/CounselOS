"use client";

import { ChangeEvent, useRef } from "react";

export default function AttachmentPicker({ disabled, onSelect }: { disabled?: boolean; onSelect: (files: File[]) => void | Promise<void> }) {
  const fileInput = useRef<HTMLInputElement>(null);

  function selected(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length) void onSelect(files);
    event.target.value = "";
  }

  return (
    <div className="attachment-picker">
      <button aria-label="Add files" className="composer-plus" disabled={disabled} onClick={(event) => {
        fileInput.current?.click();
      }} title="Add files" type="button">+</button>
      <input accept=".md,.txt,.pdf,.docx" hidden multiple onChange={selected} ref={fileInput} type="file" />
    </div>
  );
}
