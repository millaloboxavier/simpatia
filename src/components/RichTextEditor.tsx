"use client";

import { useEffect, useRef } from "react";

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current && ref.current) {
      ref.current.innerHTML = value || "";
      isFirstRender.current = false;
    }
  }, [value]);

  function exec(command: string, arg?: string) {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
  }

  function handleLink() {
    const url = window.prompt("Cole o link (com https://):");
    if (url) exec("createLink", url);
  }

  return (
    <div className="rte">
      <div className="rte-toolbar">
        <button type="button" onClick={() => exec("bold")} title="Negrito">
          <b>N</b>
        </button>
        <button type="button" onClick={() => exec("italic")} title="Itálico">
          <i>I</i>
        </button>
        <button type="button" onClick={() => exec("formatBlock", "h2")} title="Título">
          H2
        </button>
        <button type="button" onClick={() => exec("formatBlock", "p")} title="Parágrafo">
          P
        </button>
        <button type="button" onClick={() => exec("insertUnorderedList")} title="Lista">
          • Lista
        </button>
        <button type="button" onClick={handleLink} title="Link">
          🔗 Link
        </button>
      </div>
      <div
        ref={ref}
        className="rte-content"
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        onBlur={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
      />
    </div>
  );
}
