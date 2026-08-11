from pathlib import Path
from typing import Any, Dict

from .extractor import extract_text
from .cleaner import clean_text
from .section_parser import parse_sections


def parse_resume(file_path: str | Path) -> Dict[str, Any]:
    """
    Complete resume parsing pipeline.

    File
      ↓
    Extract
      ↓
    Clean
      ↓
    Detect sections
    """

    file_path = Path(file_path)

    raw_text = extract_text(file_path)

    cleaned_text = clean_text(raw_text)

    sections = parse_sections(cleaned_text)

    return {
        "filename": file_path.name,
        "file_type": file_path.suffix.lower(),
        "raw_text": raw_text,
        "cleaned_text": cleaned_text,
        "sections": sections,
    }