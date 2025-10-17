import requests
from pathlib import Path

base_url = "https://api-cops.criticalforce.fi/api/public/profile?usernames="

def load_blocked_usernames():
    path = Path(__file__).resolve().parent.parent.parent / "app" / "config" / "blocked_usernames.txt"
    if not path.exists():
        print(f"[WARN] Blocklist not found at {path}")
        return set()
    with open(path, "r", encoding="utf-8") as f:
        return {line.strip().lower() for line in f if line.strip()}
    print(f"[INFO] Loaded {len(blocked)} blocked usernames from {path}")
    return blocked
BLOCKED_USERNAMES = load_blocked_usernames()

def check_username_availability(username: str):
    normalized = username.strip().lower()

    if normalized in BLOCKED_USERNAMES:
        return  {
            "username": username,
            "available": False,
            "reason": "contains blocked word",
        }

    try:
        r = requests.get(f"{base_url}{username}", timeout=5)
        status = r.status_code
        if status==200:
            data = r.json()
            return {"username": username, "available": not bool(data)}
        
        elif status in [204, 404, 500]:
            return{"username": username, "available": True}
        return {"error": "API error", "status": r.status_code}
    
    
    except Exception as e:
        return {"error": str(e)}