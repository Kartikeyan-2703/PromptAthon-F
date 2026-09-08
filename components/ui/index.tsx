'use client';

import { AlertTriangle, Check, FileQuestion, LoaderCircle, Upload, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function StatusBadge({ status }: { status: string }) {
  const tone = status.toLowerCase().replaceAll(' ', '-');
  return <span className={`status-badge status-${tone}`}><i />{status}</span>;
}

export function PageIntro({ index, eyebrow, title, copy, action }: { index?: string; eyebrow: string; title: string; copy?: string; action?: ReactNode }) {
  return <header className="page-intro">
    <div><p className="eyebrow">{index && <span>{index} / </span>}{eyebrow}</p><h1>{title}</h1>{copy && <p className="page-copy">{copy}</p>}</div>
    {action && <div className="page-intro-action">{action}</div>}
  </header>;
}

export function Modal({ open, title, children, confirmLabel, tone = 'default', onClose, onConfirm, disabled }: { open: boolean; title: string; children: ReactNode; confirmLabel: string; tone?: 'default' | 'danger'; onClose: () => void; onConfirm: () => void; disabled?: boolean }) {
  return <AnimatePresence>{open && <motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} role="presentation" onMouseDown={onClose}>
    <motion.div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" initial={{opacity:0,y:18,scale:.985}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:10,scale:.99}} transition={{duration:.32,ease:[.16,1,.3,1]}} onMouseDown={(event)=>event.stopPropagation()}>
      <div className="modal-top"><p className="eyebrow"><span>&gt;</span> CONFIRM ACTION</p><button onClick={onClose} aria-label="Close dialog"><X size={18}/></button></div>
      <h2 id="modal-title">{title}</h2>
      <div className="modal-copy">{children}</div>
      <div className="modal-actions"><button className="button secondary" onClick={onClose}>Cancel</button><button className={`button ${tone === 'danger' ? 'danger' : 'primary'}`} disabled={disabled} onClick={onConfirm}>{confirmLabel}</button></div>
    </motion.div>
  </motion.div>}</AnimatePresence>;
}

export function FileDrop({ label, accept = 'image/*,.pdf', onFile, fileName }: { label: string; accept?: string; onFile?: (file: File) => void; fileName?: string }) {
  return <label className={`file-drop ${fileName ? 'has-file' : ''}`}>
    <input type="file" accept={accept} onChange={(e)=>e.target.files?.[0] && onFile?.(e.target.files[0])}/>
    {fileName ? <Check size={19}/> : <Upload size={20}/>}<span><strong>{fileName || label}</strong><small>{fileName ? 'Ready for mock submission' : 'Choose a file or drop it here'}</small></span>
  </label>;
}

export function LoadingState({ label = 'INITIALIZING PROMPTHON...' }: { label?: string }) {
  return <div className="system-state loading-state" role="status"><LoaderCircle className="spin" size={22}/><p>&gt; {label}<span className="cursor">_</span></p></div>;
}

export function EmptyState({ title = 'NO SUBMISSIONS YET', message = 'Teams have not submitted their work for this round.' }: { title?: string; message?: string }) {
  return <div className="system-state"><FileQuestion size={24}/><h3>{title}</h3><p>{message}</p></div>;
}

export function ErrorState() {
  return <div className="system-state"><AlertTriangle size={24}/><h3>SOMETHING WENT WRONG</h3><p>We couldn’t load this section.</p><button className="button secondary">Try again</button></div>;
}
