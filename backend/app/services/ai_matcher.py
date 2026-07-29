import io
import re
import json
from pypdf import PdfReader
import docx

KNOWN_SKILLS = [
    "React", "Next.js", "Node.js", "Express", "TypeScript", "JavaScript", "Python", "Java", "C++",
    "PostgreSQL", "MongoDB", "MySQL", "Redis", "GraphQL", "REST API", "Docker", "Kubernetes",
    "AWS", "Azure", "GCP", "Tailwind CSS", "HTML5", "CSS3", "Git", "CI/CD", "Agile", "Scrum",
    "UI/UX", "Figma", "System Design", "Microservices", "Jest", "PyTorch", "TensorFlow",
    "Machine Learning", "NLP", "Data Science", "SQL", "Prisma", "Supabase", "FastAPI", "Flask"
]

def extract_text_from_pdf(content: bytes) -> str:
    try:
        reader = PdfReader(io.BytesIO(content))
        text = ""
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text += t + "\n"
        return text
    except Exception as e:
        print(f"PDF extraction error: {e}")
        return ""

def extract_text_from_docx(content: bytes) -> str:
    try:
        doc = docx.Document(io.BytesIO(content))
        return "\n".join([p.text for p in doc.paragraphs])
    except Exception as e:
        print(f"DOCX extraction error: {e}")
        return ""

def analyze_resume_file(content: bytes, file_type: str, required_skills: str, job_title: str) -> dict:
    ext = file_type.lower()
    raw_text = ""

    if "pdf" in ext:
        raw_text = extract_text_from_pdf(content)
    elif "docx" in ext or "word" in ext:
        raw_text = extract_text_from_docx(content)

    if not raw_text:
        raw_text = content.decode("utf-8", errors="ignore")[:3000]

    text_lower = raw_text.lower()

    # Skill matching
    extracted_skills = []
    for skill in KNOWN_SKILLS:
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            extracted_skills.append(skill)

    # Job required skills evaluation
    req_skills_list = [s.strip() for s in re.split(r'[,;\n]', required_skills) if s.strip()]
    matched_count = 0
    for req in req_skills_list:
        if any(req.lower() in s.lower() for s in extracted_skills) or req.lower() in text_lower:
            matched_count += 1

    base_score = 65
    if req_skills_list:
        ratio = matched_count / len(req_skills_list)
        base_score = int(min(98, max(35, round(ratio * 45 + 50))))

    # Contact regex
    email_match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', raw_text)
    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', raw_text)

    summary = (
        f"Candidate demonstrates target qualifications for {job_title}. Extracted {len(extracted_skills)} "
        f"core technical competencies including {', '.join(extracted_skills[:4]) or 'Software Engineering'}. "
        f"Matches {matched_count} out of {len(req_skills_list) or 1} core requirements."
    )

    return {
        "raw_text": raw_text[:5000],
        "extracted_skills": extracted_skills,
        "match_score": base_score,
        "summary": summary,
        "extracted_email": email_match.group(0) if email_match else None,
        "extracted_phone": phone_match.group(0) if phone_match else None
    }
