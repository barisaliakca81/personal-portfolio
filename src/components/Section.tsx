import type { ReactNode } from 'react'
import type { SectionId } from '../data/sections'

export function Section({ id, number, label, title, description, children, className = '' }: {
  id: SectionId; number: string; label: string; title: ReactNode; description?: string; children: ReactNode; className?: string
}) {
  return <section id={id} className={`section ${className}`} aria-labelledby={`${id}-title`}>
    <div className="section-inner">
      <div className="section-heading reveal">
        <p className="eyebrow"><span>{number}</span><span className="eyebrow-line" />{label}</p>
        <div className="heading-row"><h2 id={`${id}-title`}>{title}</h2>{description && <p className="section-description">{description}</p>}</div>
      </div>
      {children}
    </div>
  </section>
}
