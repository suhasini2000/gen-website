"""Authentication integration will be implemented here."""
import os
from functools import lru_cache
import jwt
from fastapi import APIRouter, HTTPException, Request
from jwt import PyJWKClient

clerk_router = APIRouter(prefix="/api")

@clerk_router.get("/clerk/config")
def clerk_config():
    return {"enabled": bool(os.environ.get("CLERK_PUBLISHABLE_KEY") and os.environ.get("CLERK_SECRET_KEY")), "publishable_key": os.environ.get("CLERK_PUBLISHABLE_KEY", ""), "proxy_url": ""}

@lru_cache(maxsize=1)
def jwks(secret: str):
    return PyJWKClient("https://api.clerk.com/v1/jwks", headers={"Authorization": f"Bearer {secret}", "User-Agent": "geninfotech-app"})

def require_user(request: Request):
    secret = os.environ.get("CLERK_SECRET_KEY", "")
    token = request.headers.get("authorization", "")
    if not secret or not token.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Not signed in")
    try:
        key = jwks(secret).get_signing_key_from_jwt(token[7:]).key
        claims = jwt.decode(token[7:], key, algorithms=["RS256"])
        return {"user_id": claims.get("sub"), "claims": claims}
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid session") from exc