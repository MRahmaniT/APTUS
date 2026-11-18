import { useId, useLayoutEffect, useRef, type ReactNode } from "react";

export default function Modal({ title, onClose, children, className = "" }: {
  title: string; onClose: () => void; children: ReactNode; className?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  useLayoutEffect(() => {
    const el = dialog.current;
    el?.showModal();
    return () => { el?.close(); };
  }, []);

  // A native close event is also queued by React's development effect cleanup.
  // Only handle actual user dismissal, never that queued lifecycle event.
  return <dialog ref={dialog} className={"aptus-dialog " + className} aria-labelledby={id}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="dialog-surface">
      <header className="dialog-heading">
        <h2 id={id}>{title}</h2>
        <button type="button" aria-label="بستن پنجره" onClick={onClose}>×</button>
      </header>
      {children}
    </div>
  </dialog>;
}
