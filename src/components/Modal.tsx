import { useEffect, useId, useRef, type ReactNode } from "react";

export default function Modal({ title, onClose, children, className = "" }: {title:string;onClose:()=>void;children:ReactNode;className?:string}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const el = dialog.current!;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    el.showModal();
    return () => { el.close(); document.body.style.overflow = overflow; };
  }, []);
  return <dialog ref={dialog} className={"aptus-dialog " + className} aria-labelledby={id} onClose={onClose} onClick={event=>{if(event.target===event.currentTarget)dialog.current?.close();}}>
    <div className="dialog-surface"><header className="dialog-heading"><h2 id={id}>{title}</h2><button type="button" aria-label="بستن پنجره" onClick={()=>dialog.current?.close()}>×</button></header>{children}</div>
  </dialog>;
}
