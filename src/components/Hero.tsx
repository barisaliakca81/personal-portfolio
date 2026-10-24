import { useState } from 'react'
import { ArrowDown, ArrowDownRight, ArrowUpRight, Check, Code2, Copy, Terminal } from 'lucide-react'
import { portfolio, type Language } from '../data/portfolio'
import { translations } from '../data/translations'

export default function Hero({ active, language }: { active: boolean; language: Language }) {
  const copy = translations[language]
  const [tab, setTab] = useState<'code' | 'terminal'>('code')
  const [copyState, setCopyState] = useState<'success' | 'error' | ''>('')
  const snippet = 'const developer = {\n  name: "' + portfolio.name + '",\n  role: "Frontend Developer",\n  basedIn: "Istanbul, Türkiye",\n};\n\nexport default developer;'
  async function copyCode() {
    try { await navigator.clipboard.writeText(snippet); setCopyState('success') }
    catch { setCopyState('error') }
  }
  return <section id="merhaba" className="section hero" aria-labelledby="hero-title" data-active={active}>
    <div className="hero-grid" aria-hidden="true" />
    <div className="section-inner hero-inner">
      <div className="hero-content reveal">
        <p className="eyebrow"><span className="status-dot" />{copy.hello}<span className="small-bracket">[ 01 / 06 ]</span></p>
        <h1 id="hero-title">{portfolio.firstName}<br /><span>{portfolio.lastName}<span className="name-period">.</span></span></h1>
        <div className="role-line"><span className="role-prefix" aria-hidden="true">&gt;_</span><span className="typed-title">{portfolio.title}</span><span className="cursor" aria-hidden="true">_</span></div>
        <p className="hero-description">{portfolio.introduction[language]}</p>
        <div className="hero-actions"><a className="button button-primary" href="#projeler">{copy.projectsCta}<ArrowUpRight size={18} /></a><a className="button button-text" href="#hakkimda">{copy.aboutCta}<ArrowDownRight size={18} /></a></div>
        <div className="hero-note"><span className="tiny-cross">+</span>{copy.note}</div>
      </div>
      <div className="hero-visual reveal">
        <div className="visual-coordinates" aria-hidden="true"><span>FRONTEND DEVELOPMENT</span><span>FIG. 001</span></div>
        <div className="orbit-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" /><div className="orbit-axis" /><span className="orbit-point point-one" /><span className="orbit-point point-two" /><div className="code-mark">&lt;<span>/</span>&gt;</div><span className="art-caption">Istanbul, Türkiye / Frontend Developer</span></div>
        <div className="editor-window">
          <div className="editor-header"><div className="window-dots" aria-hidden="true"><i /><i /><i /></div><div className="editor-tabs" role="tablist" aria-label={copy.codePreview} onKeyDown={(event) => {
            if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); const next = event.key === 'Home' ? 'code' : event.key === 'End' ? 'terminal' : tab === 'code' ? 'terminal' : 'code'; setTab(next); document.getElementById(next + '-tab')?.focus() }
          }}><button role="tab" tabIndex={tab === 'code' ? 0 : -1} aria-selected={tab === 'code'} aria-controls="editor-panel" id="code-tab" onClick={() => setTab('code')}><Code2 size={13} />portfolio.ts</button><button role="tab" tabIndex={tab === 'terminal' ? 0 : -1} aria-selected={tab === 'terminal'} aria-controls="editor-panel" id="terminal-tab" onClick={() => setTab('terminal')}><Terminal size={13} />terminal</button></div></div>
          <div id="editor-panel" role="tabpanel" aria-labelledby={tab === 'code' ? 'code-tab' : 'terminal-tab'} tabIndex={0}>
            {tab === 'code' ? <div className="editor-code"><div className="line-numbers" aria-hidden="true">01<br />02<br />03<br />04<br />05<br />06<br />07</div><pre><code><span className="syntax-purple">const</span> developer = {'{'}{'\n'}  name: <span className="syntax-green">"{portfolio.name}"</span>,{'\n'}  role: <span className="syntax-green">"Frontend Developer"</span>,{'\n'}  basedIn: <span className="syntax-green">"Istanbul, Türkiye"</span>,{'\n'}{'}'};{'\n\n'}<span className="syntax-purple">export default</span> <span className="syntax-blue">developer</span>;</code></pre></div>
              : <div className="terminal-output"><p><span>❯</span> whoami</p><p className="syntax-green">{portfolio.name}</p><p>✓ {copy.terminalLine1}</p><p>✓ {copy.terminalLine2}</p><p>✓ {copy.terminalLine3}<span className="cursor">_</span></p></div>}
          </div>
          <div className="editor-footer"><span><span className="editor-dot" />TypeScript<span className="editor-encoding">UTF-8</span></span><button onClick={copyCode} aria-label={copy.copyCode}>{copyState === 'success' ? <Check size={13} /> : <Copy size={13} />}<span className="sr-only" role="status">{copyState === 'success' ? copy.copiedCode : copyState === 'error' ? copy.copyError : ''}</span></button></div>
        </div>
        <div className="visual-footnote"><span className="tiny-cross">+</span>BARIS ALI AKCA<span>FRONTEND DEVELOPER</span></div>
      </div>
      <div className="hero-bottom"><a href="#hakkimda" className="scroll-cue"><span className="scroll-icon"><ArrowDown size={14} /></span>{copy.scroll}</a><p>{copy.idea}<span>→</span>{copy.code}<span>→</span>{copy.experience}</p><span className="hero-version">PORTFOLIO / V.02</span></div>
    </div>
  </section>
}

