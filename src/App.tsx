import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpRight, Braces, Check, ChevronRight, Code2, Copy, Database, Download, ExternalLink, FileText, GitFork, GraduationCap, Layers3, Menu, Palette, Terminal, X } from 'lucide-react'
import { assetUrl, portfolio, safeExternalUrl, type Language, type Project } from './data/portfolio'
import { translations } from './data/translations'
import { Section } from './components/Section'
import { sections, type SectionId } from './data/sections'
import Hero from './components/Hero'
import DetailDialog from './components/DetailDialog'

function initialLanguage(): Language {
  const query = new URLSearchParams(window.location.search).get('lang')
  if (query === 'en' || query === 'tr') return query
  try { return localStorage.getItem('portfolio-language') === 'en' ? 'en' : 'tr' } catch { return 'tr' }
}
function TechnologyMark({ name }: { name: string }) {
  const short: Record<string, string> = { JavaScript: 'JS', TypeScript: 'TS', 'React.js': '⚛', Python: 'Py', PHP: 'php', Java: 'J', 'C# (.NET)': 'C#', 'C++': 'C++', Git: '◇', GitHub: 'GH', 'Tailwind CSS': '≈', Bootstrap: 'B', PostgreSQL: 'PG', 'Microsoft SQL Server': 'MS', MySQL: 'My', Django: 'Dj', FastAPI: 'Fa', Flask: 'Fl', 'Spring Boot': 'SB', '.NET Core': '.N', Laravel: 'La', Figma: 'Fi', 'Adobe XD': 'Xd' }
  return <span className={'technology-mark mark-' + name.toLowerCase().replace(/[^a-z0-9]/g, '')} aria-hidden="true">{name === 'GitHub' ? <GitFork size={19} /> : short[name] || name.slice(0, 2)}</span>
}

export default function App() {
  const [language, setLanguage] = useState<Language>(initialLanguage)
  const copy = translations[language]
  const [active, setActive] = useState<SectionId>('merhaba')
  const [menuOpen, setMenuOpen] = useState(false)
  const [hash, setHash] = useState(() => window.location.hash)
  const [filter, setFilter] = useState<'all' | Project['category']>('all')
  const [emailCopied, setEmailCopied] = useState<'success' | 'error' | ''>('')
  const menuRef = useRef<HTMLElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const project = hash.startsWith('#/proje/') ? portfolio.projects.find((item) => '#/proje/' + item.slug === hash) : undefined
  const unknownDetail = hash.startsWith('#/') && !project
  const categories: ('all' | Project['category'])[] = ['all', ...new Set(portfolio.projects.map((item) => item.category))]
  const visibleProjects = portfolio.projects.filter((item) => filter === 'all' || filter === item.category)

  function changeLanguage(next: Language) {
    setLanguage(next)
    try { localStorage.setItem('portfolio-language', next) } catch { /* URL still preserves the preference. */ }
    const url = new URL(window.location.href)
    url.searchParams.set('lang', next)
    history.replaceState(null, '', url)
  }

  useEffect(() => {
    function onHashChange() { setHash(window.location.hash) }
    window.addEventListener('hashchange', onHashChange)
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id as SectionId)
    }, { rootMargin: '-25% 0px -55% 0px', threshold: 0 })
    document.querySelectorAll('main > section').forEach((section) => observer.observe(section))
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target) } })
    }, { threshold: 0.08 })
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element))
    document.documentElement.classList.add('motion-ready')
    return () => { observer.disconnect(); revealObserver.disconnect(); window.removeEventListener('hashchange', onHashChange); document.documentElement.classList.remove('motion-ready') }
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
    const title = (project ? project.title + ' — ' : '') + portfolio.name + ' | ' + portfolio.title
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy.meta)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', copy.meta)
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', language === 'tr' ? 'tr_TR' : 'en_US')
  }, [project, language, copy.meta])

  useEffect(() => {
    if (!menuOpen) return
    menuRef.current?.querySelector('a')?.focus()
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus() }
      if (event.key === 'Tab') {
        const links = [...(menuRef.current?.querySelectorAll<HTMLAnchorElement>('a') || [])]
        if (!event.shiftKey && document.activeElement === links.at(-1)) { event.preventDefault(); menuButton.current?.focus() }
        else if (document.activeElement === menuButton.current) { event.preventDefault(); (event.shiftKey ? links.at(-1) : links[0])?.focus() }
        else if (event.shiftKey && document.activeElement === links[0]) { event.preventDefault(); menuButton.current?.focus() }
      }
    }
    function onPointer(event: PointerEvent) { if (!menuRef.current?.contains(event.target as Node) && !menuButton.current?.contains(event.target as Node)) setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('pointerdown', onPointer) }
  }, [menuOpen])

  function closeDetail() {
    const destination = project ? 'projeler' : active
    history.replaceState(null, '', window.location.pathname + window.location.search + '#' + destination)
    setHash('#' + destination)
  }
  async function copyEmail() {
    try { await navigator.clipboard.writeText(portfolio.email); setEmailCopied('success') }
    catch { setEmailCopied('error') }
  }

  return <>
    <a className="skip-link" href="#main">{copy.skip}</a>
    <header className="site-header"><div className="header-inner">
      <a href="#merhaba" className="brand" aria-label={copy.home}><span className="brand-icon" aria-hidden="true">&lt;/&gt;</span><span>{portfolio.name}</span><span className="brand-dot">.</span></a>
      <nav id="main-nav" ref={menuRef} className={'main-nav ' + (menuOpen ? 'menu-open' : '')} aria-label={copy.nav}>
        {sections.slice(1, -1).map((section) => <a href={'#' + section.id} key={section.id} aria-current={active === section.id ? 'location' : undefined} onClick={() => setMenuOpen(false)}>{section.label[language]}</a>)}
        <a className="nav-contact" href="#iletisim" onClick={() => setMenuOpen(false)} aria-current={active === 'iletisim' ? 'location' : undefined}>{copy.talk} <ArrowUpRight size={15} /></a>
      </nav>
      <div className="header-controls"><div className="language-switch" role="group" aria-label={copy.language}>
        <button lang="tr" aria-label="Türkçe" aria-pressed={language === 'tr'} onClick={() => changeLanguage('tr')}>TR</button>
        <span aria-hidden="true">/</span>
        <button lang="en" aria-label="English" aria-pressed={language === 'en'} onClick={() => changeLanguage('en')}>EN</button>
      </div><button className="menu-toggle icon-button" ref={menuButton} aria-label={menuOpen ? copy.menuClose : copy.menuOpen} aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <X /> : <Menu />}</button></div>
    </div></header>
    <main id="main" tabIndex={-1}>
      <Hero active={active === 'merhaba'} language={language} />
      <Section id="hakkimda" number="02" label={copy.aboutLabel} title={<>{copy.aboutTitle1}<br /><span className="muted-title">{copy.aboutTitle2}</span></>}>
        <div className="about-grid reveal">
          <div className="about-art"><span className="art-top-label">BARIS ALI AKCA / FRONTEND</span><div className="about-monogram" aria-hidden="true"><Braces strokeWidth={0.7} /></div><div className="about-art-bottom"><span>{copy.student}<br /><strong>{copy.year}</strong></span><ArrowUpRight size={28} /></div></div>
          <div className="about-copy"><p className="text-label">{copy.story}</p><p className="about-biography">{portfolio.biography[language]}</p><div className="profile-facts"><span>{portfolio.location[language]}</span><span>{portfolio.education[0].institution[language]}</span><span>{portfolio.education[0].gpa[language]}</span></div><a className="inline-link" href="#ozgecmis">{copy.resumeLink}<ArrowDown size={16} /></a></div>
        </div>
      </Section>
      <Section id="yetenekler" number="03" label={copy.skillsLabel} title={<>{copy.skillsTitle1}<br /><span className="muted-title">{copy.skillsTitle2}</span></>} description={copy.skillsDescription}>
        <div className="skill-grid personal-skills reveal">{portfolio.skillGroups.map((group, index) => {
          const Icon = group.icon === 'frontend' || group.icon === 'code' ? Code2 : group.icon === 'backend' || group.icon === 'database' ? Database : group.icon === 'design' ? Palette : Layers3
          return <div className="skill-card" key={group.icon}><div className="skill-card-top"><Icon size={25} strokeWidth={1.4} /><span>{String(index + 1).padStart(2, '0')}</span></div><h3>{group.name[language]}</h3><p>{group.subtitle[language]}</p><div className="skill-list">{group.skills.map((skill) => <div className="skill-item" key={skill}><TechnologyMark name={skill} /><span>{skill}</span></div>)}</div></div>
        })}</div>
        <div className="section-endnote reveal"><Terminal size={15} /><span>{copy.skillsNote}</span></div>
      </Section>
      <Section id="projeler" number="04" label={copy.projectsLabel} title={<>{copy.projectsTitle1} <span className="muted-title">{copy.projectsTitle2}</span></>} description={copy.projectsDescription}>
        <div className="project-toolbar reveal"><div className="project-filters" role="group" aria-label={copy.filter}>{categories.map((category) => <button key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category === 'all' ? copy.all : copy[category]}</button>)}</div><span className="results-count" role="status">{String(visibleProjects.length).padStart(2, '0')} {copy.work}</span></div>
        <div className="project-grid personal-projects">{visibleProjects.map((item) => <article className="project-card" key={item.slug}>
          <a className="project-image" href={'#/proje/' + item.slug} aria-label={item.title + ' — ' + copy.detail}>
            <span className="browser-bar" aria-hidden="true"><i /><i /><i /><span>{new URL(item.demo).hostname}</span><ArrowUpRight size={12} /></span>
            <img src={assetUrl(item.image)} alt={item.title + ' ' + copy.screenshotAlt} width="1440" height="960" loading="lazy" />
            <span className="preview-caption"><span>{copy.preview}</span><ArrowUpRight size={17} /></span>
          </a>
          <div className="project-title-row"><h3><a href={'#/proje/' + item.slug}>{item.title}</a></h3><a className="project-live-link" href={item.demo} target="_blank" rel="noopener noreferrer" aria-label={item.title + ' — ' + copy.live + ' (' + copy.newTab + ')'}><ArrowUpRight size={20} /></a></div>
          <p>{item.description[language]}</p><div className="project-category"><span>{copy[item.category]}</span><span>{new URL(item.demo).hostname}</span></div>
        </article>)}</div>
      </Section>
      <Section id="ozgecmis" number="05" label={copy.resumeLabel} title={<>{copy.resumeTitle1}<br /><span className="muted-title">{copy.resumeTitle2}</span></>}>
        <div className="resume-grid reveal"><div className="timeline">
          <div className="timeline-group"><h3><GraduationCap size={20} />{copy.education}</h3>{portfolio.education.map((item) => <div className="timeline-item" key={item.title.tr}><span className="timeline-period">{item.period[language]}</span><h4>{item.title[language]}</h4><p className="timeline-institution">{item.institution[language]}</p><p>{item.degree[language]}<span className="education-gpa">{item.gpa[language]}</span></p></div>)}</div>
          <div className="timeline-group"><h3><Braces size={19} />{copy.internship}</h3>{portfolio.experience.map((item) => <div className="timeline-item" key={item.institution.tr}><span className="timeline-period">{item.period}</span><h4>{item.title[language]}</h4><a className="institution-link" href={item.url} target="_blank" rel="noopener noreferrer">{item.institution[language]}<ExternalLink size={12} /><span className="sr-only"> ({copy.newTab})</span></a></div>)}</div>
        </div><aside className="cv-card"><div className="cv-icon"><FileText size={36} strokeWidth={1} /></div><span className="text-label">{copy.cvLabel}</span><h3>{copy.cvTitle1}<br />{copy.cvTitle2}</h3><p>{copy.cvDescription}</p><a className="button button-primary" href={assetUrl(portfolio.cvPath[language])} download>{copy.cvDownload}<Download size={17} /></a><span className="cv-format">{copy.cvFormat}</span></aside></div>
      </Section>
      <Section id="iletisim" number="06" label={copy.contactLabel} className="contact-section" title={<>{copy.contactTitle1}<br />{copy.contactTitle2} <span className="contact-accent">{copy.contactAccent}<svg viewBox="0 0 530 20" preserveAspectRatio="none" aria-hidden="true"><path d="M3 15 Q 220 -3 525 10" /></svg></span>.</>}>
        <div className="contact-content reveal"><p>{copy.contactBody1}<br />{copy.contactBody2}</p><div className="email-actions"><a className="email-link" href={'mailto:' + portfolio.email}>{portfolio.email}<ArrowUpRight /></a><button className="icon-button" onClick={copyEmail} aria-label={copy.copyEmail}>{emailCopied === 'success' ? <Check size={18} /> : <Copy size={18} />}</button><span className="sr-only" role="status">{emailCopied === 'success' ? copy.emailCopied : emailCopied === 'error' ? copy.emailError : ''}</span></div><div className="social-links">{portfolio.socialLinks.map((link) => <a href={safeExternalUrl(link.url)} key={link.label} target="_blank" rel="noopener noreferrer">{link.label}<ArrowUpRight size={16} /><span className="sr-only"> ({copy.newTab})</span></a>)}</div></div>
        <footer className="site-footer"><a className="brand" href="#merhaba"><span className="brand-icon" aria-hidden="true">&lt;/&gt;</span>{portfolio.name}</a><p>© {new Date().getFullYear()} {portfolio.name}<span>{copy.footer}</span></p><a className="back-top" href="#merhaba">{copy.backTop}<ArrowUp size={16} /></a></footer>
      </Section>
    </main>
    <nav className="section-indicators" aria-label={copy.indicators}>{sections.map((section, index) => <a key={section.id} href={'#' + section.id} aria-label={String(index + 1) + '. ' + copy.section + ': ' + section.label[language]} aria-current={active === section.id ? 'location' : undefined}><span className="indicator-label">{section.label[language]}</span><span className="indicator-dot" /></a>)}</nav>
    <div className="page-counter" aria-hidden="true"><span>{String(sections.findIndex((section) => section.id === active) + 1).padStart(2, '0')}</span><span className="counter-line" />06</div>
    {project && <DetailDialog key={project.slug} title={project.title} close={closeDetail} copy={copy}>
      <img className="dialog-project-image" src={assetUrl(project.image)} alt={project.title + ' ' + copy.screenshotAlt} width="1440" height="960" />
      <div className="project-category"><span>{copy[project.category]}</span><span>{new URL(project.demo).hostname}</span></div>
      <div className="prose">{project.details.map((paragraph) => <p key={paragraph.tr}>{paragraph[language]}</p>)}</div>
      {project.technologies.length > 0 && <div className="technology-tags">{project.technologies.map((item) => <span key={item}>{item}</span>)}</div>}
      <div className="dialog-links">{safeExternalUrl(project.github) && <a className="button button-outline" href={safeExternalUrl(project.github)} target="_blank" rel="noopener noreferrer"><GitFork size={17} />GitHub<ArrowUpRight size={16} /></a>}<a className="button button-primary" href={project.demo} target="_blank" rel="noopener noreferrer">{copy.live}<ArrowUpRight size={16} /><span className="sr-only"> ({copy.newTab})</span></a></div>
    </DetailDialog>}
    {unknownDetail && <DetailDialog title={copy.notFound} close={closeDetail} copy={copy}><p>{copy.notFoundBody}</p><button className="button button-primary" onClick={closeDetail}>{copy.return}<ChevronRight size={16} /></button></DetailDialog>}
  </>
}

