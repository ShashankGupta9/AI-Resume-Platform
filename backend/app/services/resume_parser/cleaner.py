import re


def clean_text(text: str) -> str:
    """
    Clean extracted resume text while preserving
    useful information and line structure.
    """

    if not text:
        return ""

    # Normalize Windows/Mac line endings.
    text = text.replace("\r\n", "\n")
    text = text.replace("\r", "\n")

    # Remove null characters.
    text = text.replace("\x00", "")

    # Normalize tabs.
    text = text.replace("\t", " ")

    # Remove excessive spaces.
    text = re.sub(r"[ ]{2,}", " ", text)

    # Remove excessive blank lines.
    text = re.sub(r"\n[ ]*\n[ ]*\n+", "\n\n", text)

    # Clean spaces around lines.
    lines = []

    for line in text.split("\n"):
        line = line.strip()

        if line:
            lines.append(line)

    text = "\n".join(lines)

    return text.strip()


def normalize_for_matching(text: str) -> str:
    """
    Create a normalized version used for
    section/keyword matching.
    """

    text = text.lower()

    text = re.sub(r"[^a-z0-9+#.\-/ ]", " ", text)

    text = re.sub(r"\s+", " ", text)

    return text.strip()