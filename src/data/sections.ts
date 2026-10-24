export const sections = [
  { id: 'merhaba', label: { tr: 'Merhaba', en: 'Hello' } },
  { id: 'hakkimda', label: { tr: 'Hakkımda', en: 'About' } },
  { id: 'yetenekler', label: { tr: 'Yetenekler', en: 'Skills' } },
  { id: 'projeler', label: { tr: 'Projeler', en: 'Projects' } },
  { id: 'ozgecmis', label: { tr: 'Özgeçmiş', en: 'Résumé' } },
  { id: 'iletisim', label: { tr: 'İletişim', en: 'Contact' } },
] as const

export type SectionId = typeof sections[number]['id']
