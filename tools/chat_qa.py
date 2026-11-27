#!/usr/bin/env python3
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
errors = []
for locale in ("ar", "en", "ru"):
    page = root / locale / "chat" / "index.html"
    if not page.is_file():
        errors.append(f"missing localized chat page: {page.relative_to(root)}")
    else:
        source = page.read_text(encoding="utf-8")
        if f'data-locale="{locale}"' not in source:
            errors.append(f"incorrect locale marker: {page.relative_to(root)}")
        if "chat.js" not in source or "chat.css" not in source:
            errors.append(f"missing chat assets: {page.relative_to(root)}")
        if 'type="file"' in source.lower() or "type='file'" in source.lower():
            errors.append(f"file upload control found: {page.relative_to(root)}")

avatars = list((root / "assets" / "chat" / "avatars").glob("avatar-*.svg"))
if len(avatars) != 10:
    errors.append(f"expected 10 SVG avatars, found {len(avatars)}")
for avatar in avatars:
    if "<svg" not in avatar.read_text(encoding="utf-8"):
        errors.append(f"invalid SVG avatar: {avatar.relative_to(root)}")

script = root / "chat.js"
if not script.is_file():
    errors.append("missing chat.js")
else:
    source = script.read_text(encoding="utf-8")
    for token in ("chat_profiles", "chat_conversations", "chat_messages", "chat_friend_requests", "search_chat_profile", "send_chat_friend_request", "get_chat_profiles", "incoming-requests", "outgoing-requests", "postgres_changes", "async function searchUsers", "async function ensureConversation", "async function loadMessages"):
        if token not in source:
            errors.append(f"chat.js missing expected feature: {token}")
    if ".upload(" in source or 'type="file"' in source.lower() or "type='file'" in source.lower():
        errors.append("file upload implementation found in chat.js")

migration = root / "supabase" / "migrations" / "20261127110000_chat_friend_requests_and_profile_privacy.sql"
if not migration.is_file():
    errors.append("missing friendship and privacy migration")
else:
    sql = migration.read_text(encoding="utf-8")
    for token in ("chat_friend_requests", "search_chat_profile", "get_chat_profiles", "status = 'accepted'", "users read their own chat profile"):
        if token not in sql:
            errors.append(f"friendship migration missing expected control: {token}")

if script.is_file():
    source = script.read_text(encoding="utf-8")
    if '.from("chat_profiles").select("id,username,avatar_id").eq("id",user.id)' not in source:
        errors.append("profile reads must be owner-scoped")
    if '.from("chat_profiles").select("id,username,avatar_id").eq("username"' in source:
        errors.append("public profile search must use the restricted RPC")

if errors:
    raise SystemExit("; ".join(errors))
print("SODO Chat QA passed: 3 localized pages, 10 SVG avatars, friend-request/privacy controls, no file uploads.")
