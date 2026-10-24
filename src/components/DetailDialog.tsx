import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import type { Copy } from '../data/translations'

export default function DetailDialog({ title, close, children, copy }: { title: string; close: () => void; children: ReactNode; copy: Copy }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current!
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.documentElement.style.overflow
    dialog.showModal()
    document.documentElement.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.documentElement.style.overflow = previousOverflow
      previousFocus?.focus({ preventScroll: true })
    }
  }, [])
  return <dialog ref={dialogRef} className="detail-dialog" aria-labelledby="detail-title" onCancel={(event) => { event.preventDefault(); close() }} onClick={(event) => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close() } }}>
    <div className="dialog-top"><span className="eyebrow">{copy.closer}</span><button className="icon-button" onClick={close} aria-label={copy.close} autoFocus><X size={21} /></button></div>
    <h2 id="detail-title">{title}</h2>
    {children}
  </dialog>
}
