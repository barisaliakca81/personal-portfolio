"""Build two factual, one-page résumés from the portfolio's shared data."""
import json
from pathlib import Path
from html import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / '.tmp/cv-data.json').read_text(encoding='utf-8-sig'))
pdfmetrics.registerFont(TTFont('CV', 'C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('CV-Bold', 'C:/Windows/Fonts/arialbd.ttf'))
pdfmetrics.registerFontFamily('CV', normal='CV', bold='CV-Bold', italic='CV', boldItalic='CV-Bold')
ink, muted, accent = HexColor('#17232e'), HexColor('#506170'), HexColor('#196a79')
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='CVName', fontName='CV-Bold', fontSize=27, leading=33, textColor=ink, spaceAfter=4))
styles.add(ParagraphStyle(name='CVRole', fontName='CV', fontSize=12, leading=18, textColor=accent, spaceAfter=10))
styles.add(ParagraphStyle(name='CVBody', fontName='CV', fontSize=9.2, leading=13.2, textColor=ink, spaceAfter=5))
styles.add(ParagraphStyle(name='CVSmall', fontName='CV', fontSize=8.3, leading=12, textColor=muted, spaceAfter=3))
styles.add(ParagraphStyle(name='CVSection', fontName='CV-Bold', fontSize=10, leading=14, textColor=accent, spaceBefore=15, spaceAfter=9))

def p(text, style='CVBody'):
    return Paragraph(text, styles[style])

def link(url, label):
    return '<link href="' + escape(url, quote=True) + '" color="#196a79">' + escape(label) + '</link>'

def heading(text):
    return p(text, 'CVSection')

for lang in ['tr', 'en']:
    out = ROOT / 'public' / data['cvPath'][lang]
    out.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(out), pagesize=A4, rightMargin=42, leftMargin=42, topMargin=35, bottomMargin=33, title=data['name'] + ' | Frontend Developer', author=data['name'])
    story = [p(escape(data['name']), 'CVName'), p(data['title'], 'CVRole')]
    story.append(p(escape(data['location'][lang]) + '  |  ' + link('mailto:' + data['email'], data['email']), 'CVSmall'))
    story.append(p(link(data['socialLinks'][0]['url'], 'github.com/barisaliakca81') + '  |  ' + link(data['socialLinks'][1]['url'], 'LinkedIn / Barış Ali AKÇA'), 'CVSmall'))
    story += [Spacer(1, 9), HRFlowable(width='100%', thickness=1, color=accent), Spacer(1, 10)]
    summary = {
        'tr': 'Anadolu Üniversitesi Ön-Yüz Yazılım Geliştirme programında ikinci sınıf ön lisans öğrencisi ve Frontend Developer. Yazılıma ortaokuldan liseye geçerken başladı. Creovers Digital Agency ve Giga Yazılım bünyesinde staj deneyimi bulunmaktadır.',
        'en': 'Frontend Developer and second-year associate degree student in Front-End Software Development at Anadolu University. Started programming during the transition from middle school to high school. Internship experience at Creovers Digital Agency and Giga Yazılım.',
    }
    story.append(p(summary[lang]))
    story.append(heading('EĞİTİM' if lang == 'tr' else 'EDUCATION'))
    for item in data['education']:
        story.append(p('<b>' + escape(item['institution'][lang]) + '</b>'))
        story.append(p(escape(item['title'][lang]) + ' - ' + escape(item['degree'][lang])))
        story.append(p(escape(item['period'][lang]) + '  |  ' + escape(item['gpa'][lang]), 'CVSmall'))
    story.append(heading('STAJ DENEYİMİ' if lang == 'tr' else 'INTERNSHIP EXPERIENCE'))
    for item in data['experience']:
        story.append(KeepTogether([p('<b>' + escape(item['institution'][lang]) + '</b>  |  ' + item['period']), p(escape(item['title'][lang]) + '  ·  ' + link(item['url'], item['url'].replace('https://', '').rstrip('/')), 'CVSmall')]))
    story.append(heading('TEKNİK YETKİNLİKLER' if lang == 'tr' else 'TECHNICAL SKILLS'))
    rows = []
    for group in data['skillGroups']:
        rows.append([p('<b>' + escape(group['name'][lang]) + '</b>', 'CVSmall'), p(escape(', '.join(group['skills'])), 'CVSmall')])
    table = Table(rows, colWidths=[123, A4[0] - 84 - 123], hAlign='LEFT')
    table.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 10), ('TOPPADDING', (0, 0), (-1, -1), 3), ('BOTTOMPADDING', (0, 0), (-1, -1), 4)]))
    story.append(table)
    story.append(heading('SEÇİLİ WEB ÇALIŞMALARI' if lang == 'tr' else 'SELECTED WEB PROJECTS'))
    for item in data['projects']:
        url = item['demo'].replace('https://', '').rstrip('/')
        story.append(p('<b>' + escape(item['title']) + '</b>  ·  ' + link(item['demo'], url), 'CVSmall'))
    def footer(canvas, document):
        canvas.saveState()
        canvas.setStrokeColor(HexColor('#d6dfe4'))
        canvas.line(42, 31, A4[0] - 42, 31)
        canvas.setFont('CV', 7)
        canvas.setFillColor(muted)
        canvas.drawString(42, 20, data['name'] + ' / Frontend Developer')
        canvas.drawRightString(A4[0] - 42, 20, '1 / 1')
        canvas.restoreState()
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    reader = PdfReader(str(out))
    assert len(reader.pages) == 1, 'CV must remain one page: ' + str(out)
    text = reader.pages[0].extract_text()
    for expected in [data['name'], data['email'], 'Creovers', 'Giga', 'JavaScript', 'CillTech']:
        assert expected in text, 'Missing CV text: ' + expected
    print(str(out) + ' | 1 page | text verified')
