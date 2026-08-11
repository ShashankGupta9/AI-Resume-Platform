import re
from typing import Dict


SECTION_ALIASES = {
    "skills": {
        "skills",
        "technical skills",
        "technical skill",
        "core skills",
        "key skills",
        "technologies",
        "technical expertise",
        "competencies",
    },

    "experience": {
        "experience",
        "work experience",
        "professional experience",
        "employment",
        "employment history",
        "work history",
    },

    "education": {
        "education",
        "academic background",
        "academic qualifications",
        "qualifications",
        "educational background",
    },

    "projects": {
        "projects",
        "personal projects",
        "academic projects",
        "key projects",
        "project experience",
    },

    "certifications": {
        "certifications",
        "certificates",
        "licenses",
    },

    "achievements": {
        "achievements",
        "accomplishments",
        "awards",
    },

    "summary": {
        "summary",
        "professional summary",
        "profile",
        "career objective",
        "objective",
    },
}


def normalize_heading(line: str) -> str:
    """
    Normalize a potential section heading.
    """

    line = line.strip().lower()

    line = re.sub(r"[:\-|]+$", "", line)

    line = re.sub(r"\s+", " ", line)

    return line


def detect_section(line: str) -> str | None:
    """
    Detect whether a line represents a known resume section.
    """

    normalized = normalize_heading(line)

    for section_name, aliases in SECTION_ALIASES.items():

        if normalized in aliases:
            return section_name

    return None


def parse_sections(text: str) -> Dict[str, str]:
    """
    Split resume text into logical sections.
    """

    sections: Dict[str, list[str]] = {}

    current_section = "header"

    sections[current_section] = []

    for line in text.splitlines():

        line = line.strip()

        if not line:
            continue

        detected_section = detect_section(line)

        if detected_section:
            current_section = detected_section

            if current_section not in sections:
                sections[current_section] = []

            continue

        sections.setdefault(current_section, [])

        sections[current_section].append(line)

    return {
        section: "\n".join(content).strip()
        for section, content in sections.items()
        if content
    }