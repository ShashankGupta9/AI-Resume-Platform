import os
from datetime import datetime, timedelta
import bcrypt
import jwt

JWT_SECRET = os.getenv("JWT_SECRET", "ai-resume-platform-super-secret-jwt-key-2026")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_DAYS = int(os.getenv("ACCESS_TOKEN_EXPIRE_DAYS", "7"))

def _get_safe_password_bytes(password: str) -> bytes:
    """
    Encodes password to UTF-8 and safely truncates to max 72 bytes to adhere to bcrypt standard.
    """
    if not password:
        return b""
    return password.encode('utf-8')[:72]

def hash_password(password: str) -> str:
    pwd_bytes = _get_safe_password_bytes(password)
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(pwd_bytes, salt)
    return hashed_bytes.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        if not plain_password or not hashed_password:
            return False
        pwd_bytes = _get_safe_password_bytes(plain_password)
        hash_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(pwd_bytes, hash_bytes)
    except Exception as e:
        print(f"Password verification error: {e}")
        return False

def create_jwt_token(payload: dict) -> str:
    to_encode = payload.copy()
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)

def decode_jwt_token(token: str) -> dict:
    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return decoded
    except Exception as e:
        print(f"Token decoding error: {e}")
        return None
