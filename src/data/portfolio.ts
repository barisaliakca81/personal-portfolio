export type Language = 'tr' | 'en'
export type Localized = Record<Language, string>
export interface Project {
  slug: string
  title: string
  category: 'corporate' | 'commerce' | 'property'
  description: Localized
  details: Localized[]
  technologies: string[]
  image: string
  demo: string
  github?: string
}
export interface TimelineItem { period: string; title: Localized; institution: Localized; description?: Localized; url?: string }

// Kişisel bilgilerin tek kaynağı. CV verisi de bu dosyadan dışa aktarılır.
// Proje teknoloji yığınları paylaşılmadığı için boş bırakıldı.
export const portfolio = {
  firstName: 'Barış Ali',
  lastName: 'AKÇA',
  name: 'Barış Ali AKÇA',
  title: 'Frontend Developer',
  email: 'barisaliakca81@gmail.com',
  location: { tr: 'İstanbul / Türkiye', en: 'Istanbul / Türkiye' },
  introduction: {
    tr: 'İstanbul’da yaşayan bir Frontend Developer. Anadolu Üniversitesi’nde Ön-Yüz Yazılım Geliştirme öğrencisi.',
    en: 'A Frontend Developer based in Istanbul, studying Front-End Software Development at Anadolu University.',
  },
  biography: {
    tr: 'Yazılımla ortaokuldan liseye geçerken tanıştım. Bugün Anadolu Üniversitesi Ön-Yüz Yazılım Geliştirme programında ikinci sınıf öğrencisiyim. Eğitimimi web geliştirme çalışmalarım ve staj deneyimlerimle bir araya getiriyorum.',
    en: 'I started programming during the transition from middle school to high school. Today, I am a second-year Front-End Software Development student at Anadolu University, combining my studies with web development projects and internship experience.',
  },
  education: [{
    period: { tr: 'Devam ediyor · 2. sınıf', en: 'Ongoing · Second year' },
    title: { tr: 'Ön-Yüz Yazılım Geliştirme', en: 'Front-End Software Development' },
    institution: { tr: 'Anadolu Üniversitesi', en: 'Anadolu University' },
    degree: { tr: 'Ön lisans', en: 'Associate degree' },
    gpa: { tr: 'GNO: 3,10', en: 'GPA: 3.10' },
  }],
  experience: [
    { period: '2024 - 2026', title: { tr: 'Frontend Developer · Staj', en: 'Frontend Developer · Internship' }, institution: { tr: 'Creovers Digital Agency', en: 'Creovers Digital Agency' }, url: 'https://creovers.com/' },
    { period: '2026', title: { tr: 'Staj', en: 'Internship' }, institution: { tr: 'Giga Yazılım', en: 'Giga Yazılım' }, url: 'https://giga.com.tr/' },
  ] satisfies TimelineItem[],
  skillGroups: [
    { name: { tr: 'Programlama dilleri', en: 'Programming languages' }, subtitle: { tr: 'Geliştirme temeli', en: 'Development foundations' }, icon: 'code', skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C# (.NET)', 'PHP', 'C++'] },
    { name: { tr: 'Frontend', en: 'Frontend' }, subtitle: { tr: 'Arayüz geliştirme', en: 'Interface development' }, icon: 'frontend', skills: ['React.js', 'Tailwind CSS', 'Bootstrap'] },
    { name: { tr: 'Backend', en: 'Backend' }, subtitle: { tr: 'Sunucu tarafı teknolojileri', en: 'Server-side technologies' }, icon: 'backend', skills: ['Django', 'FastAPI', 'Flask', 'Spring Boot', '.NET Core', 'Laravel'] },
    { name: { tr: 'Veritabanları', en: 'Databases' }, subtitle: { tr: 'Verinin yapısı', en: 'Structured data' }, icon: 'database', skills: ['PostgreSQL', 'Microsoft SQL Server', 'MySQL'] },
    { name: { tr: 'Sürüm kontrolü', en: 'Version control' }, subtitle: { tr: 'Kod ve çalışma akışı', en: 'Code and workflow' }, icon: 'tools', skills: ['Git', 'GitHub'] },
    { name: { tr: 'Tasarım araçları', en: 'Design tools' }, subtitle: { tr: 'Arayüzden prototipe', en: 'Interfaces and prototypes' }, icon: 'design', skills: ['Figma', 'Adobe XD'] },
  ],
  cvPath: { tr: 'cv/baris-ali-akca-cv-tr.pdf', en: 'cv/baris-ali-akca-cv-en.pdf' },
  socialLinks: [
    { label: 'GitHub', url: 'https://github.com/barisaliakca81' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/barış-ali-akça-7777b8249/' },
  ],
  projects: [
    { slug: 'cilltech', title: 'CillTech', category: 'corporate', description: { tr: 'Güvenlik teknolojileri ve kurumsal çözümler için web sitesi.', en: 'A corporate website for security technologies and business solutions.' }, details: [{ tr: 'CillTech’in güvenlik teknolojileri, yazılım ve teknik hizmetlerini tanıtan kurumsal web sitesi.', en: 'A corporate website presenting CillTech’s security technologies, software and technical services.' }], technologies: [], image: 'images/projects/cilltech.jpg', demo: 'https://cilltech.vercel.app/' },
    { slug: 'estedore', title: 'Estedore', category: 'corporate', description: { tr: 'Güzellik hizmetleri, şubeler ve marka dünyasını bir araya getiren web sitesi.', en: 'A brand website bringing together beauty services, locations and the Estedore brand.' }, details: [{ tr: 'Estedore Beauty Palace’ın hizmetlerini, şubelerini ve kurumsal yapısını tanıtan web sitesi.', en: 'A website presenting Estedore Beauty Palace’s services, locations and brand.' }], technologies: [], image: 'images/projects/estedore.jpg', demo: 'https://estedore.com/' },
    { slug: 'hillora', title: 'Hillora', category: 'commerce', description: { tr: 'Kozmetik ve bakım ürünleri için çevrimiçi alışveriş deneyimi.', en: 'An online shopping experience for cosmetics and personal care products.' }, details: [{ tr: 'Hillora’nın kozmetik ve bakım ürünlerini kategoriler hâlinde sunan çevrimiçi mağazası.', en: 'Hillora’s online store, presenting cosmetics and personal care products by category.' }], technologies: [], image: 'images/projects/hillora.jpg', demo: 'https://hillora.com/' },
    { slug: 'zynon', title: 'ZYNON', category: 'corporate', description: { tr: 'Marka ve ürün tanıtımını odağına alan kurumsal web sitesi.', en: 'A corporate website focused on brand and product presentation.' }, details: [{ tr: 'ZYNON markasını ve epilasyon cihazlarını tanıtan ürün odaklı web sitesi.', en: 'A product-focused website presenting the ZYNON brand and its hair removal devices.' }], technologies: [], image: 'images/projects/zynon.jpg', demo: 'https://zynon.com.tr/' },
    { slug: 'zeytinli-yasam-koyu', title: 'Zeytinli Yaşam Köyü', category: 'property', description: { tr: 'Yalova’daki yaşam projesini tanıtan görsel odaklı web sitesi.', en: 'A visual website presenting a residential development in Yalova.' }, details: [{ tr: 'Zeytinli Yaşam Köyü’nün yaşam alanlarını, proje yaklaşımını ve galerisini sunan tanıtım sitesi.', en: 'A presentation website featuring Zeytinli Yaşam Köyü’s residential spaces, project concept and gallery.' }], technologies: [], image: 'images/projects/zeytinli-yasam-koyu.jpg', demo: 'https://zeytinliyasamkoyu.com/' },
  ] satisfies Project[] as Project[],
}

export function assetUrl(path: string) { return import.meta.env.BASE_URL + path.replace(/^\/+/, '') }
export function safeExternalUrl(url?: string) {
  if (!url) return undefined
  try { const parsed = new URL(url); return ['https:', 'http:'].includes(parsed.protocol) ? parsed.href : undefined } catch { return undefined }
}

