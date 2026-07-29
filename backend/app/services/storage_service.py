import os
import time
import re
from supabase import create_client, Client

supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
supabase_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")

supabase_client: Client = None
if supabase_url and supabase_key and "your-project" not in supabase_url:
    try:
        supabase_client = create_client(supabase_url, supabase_key)
    except Exception as e:
        print(f"Supabase client initialization warning: {e}")

def save_resume_file(content: bytes, file_name: str, content_type: str) -> str:
    sanitized_name = f"{int(time.time())}_{re.sub(r'[^a-zA-Z0-9.-]', '_', file_name)}"

    # Try Supabase Storage
    if supabase_client:
        try:
            res = supabase_client.storage.from_("resumes").upload(
                file=content,
                path=sanitized_name,
                file_options={"content-type": content_type}
            )
            public_url = supabase_client.storage.from_("resumes").get_public_url(sanitized_name)
            return public_url
        except Exception as e:
            print(f"Supabase storage upload fallback: {e}")

    # Fallback to local storage
    upload_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "frontend", "public", "uploads"))
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, sanitized_name)
    with open(file_path, "wb") as f:
        f.write(content)

    return f"/uploads/{sanitized_name}"
