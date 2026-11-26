#!/usr/bin/env python3
"""Download and optimize SODO cinema poster artwork into local WebP assets."""

from __future__ import annotations

from io import BytesIO
from pathlib import Path
from urllib.request import Request, urlopen

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DESTINATION = ROOT / "assets" / "posters"

POSTERS = {
    "hope-2026.webp": [
        "https://dx35vtwkllhj9.cloudfront.net/neonrated/hope-2026/images/regions/us/onesheet.jpg",
    ],
    "black-box-2026.webp": [
        "https://static.filmvandaag.nl/covers/original/150000/150254.jpg?v=1&width=800",
    ],
    "heart-of-the-beast.webp": [
        "https://s3proxygw.cineplexx.at/cms-live/asset/RKS/movies/Heart%20of%20the%20Beast/posterImage.jpg",
    ],
    "me-before-you.webp": [
        "https://resizing.flixster.com/2JDi6Ckf2g6lNLrSPA3GschBugI=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzc0YjY1NDliLWNhNTMtNDQwYS04OThmLWM5NmFiMzI4YjBmNy53ZWJw",
    ],
    "lucky-strike.webp": [
        "https://images.justwatch.com/poster/347233655/s718/lucky-strike.jpg",
    ],
    "the-boys.webp": [
        "https://m.media-amazon.com/images/M/MV5BZjU4OWNiYzQtMzc1NS00NjZlLTgyYTctZWY4ZmEzMTkxYjA4XkEyXkFqcGc%40._V1_.jpg",
        "https://pics.filmaffinity.com/The_Boys_Serie_de_TV-641971209-large.jpg",
    ],
    "daredevil.webp": [
        "https://image.tmdb.org/t/p/original/aY6oJg7KSGU02dtRy0NSzEzQ8B6.jpg",
    ],
    "breaking-bad.webp": [
        "https://m.media-amazon.com/images/M/MV5BNDYxYzkzZDctYzJiMS00NzNiLThlMGMtMjYxMmI4MGFhNzZkXkEyXkFqcGc%40._V1_.jpg",
    ],
    "game-of-thrones.webp": [
        "https://web.static.nowtv.com/images/NOWTV_2026/Design_Assets/Ents%20%26%20Max/Bespoke%20pages/SEO%20Poster/GameOfThrones_poster.jpg?downsize=3840%3A%2A&output-format=webp&output-quality=75",
    ],
    "13-reasons-why.webp": [
        "https://resizing.flixster.com/LbH974dBYRL2ywPuqOm-w7CAlMM%3D/ems.cHJkLWVtcy1hc3NldHMvdHZzZWFzb24vUlRUVjI5NTc2Ny53ZWJw",
    ],
    "daredevil-born-again.webp": [
        "https://f.rpp-noticias.io/2025/01/15/1692815snapinstapp-473807099-2723084657877244-4278080076513490844-n-1080jpg.jpg",
    ],
    "hope-2019.webp": [
        "https://www.oslo-pictures.com/media/images/poster/xlarge/3d5bv93esi0q.jpg",
    ],
    "black-box-2020.webp": [
        "https://metadata-static.plex.tv/c/gracenote/c59ed964d20d8ba2e5e76c34d20b9b9b.jpg",
    ],
}

def download(url: str) -> bytes:
    request = Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; SODO-Poster-Asset-Bot/1.0)",
            "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        },
    )
    with urlopen(request, timeout=35) as response:
        payload = response.read(15 * 1024 * 1024 + 1)
    if not payload or len(payload) > 15 * 1024 * 1024:
        raise ValueError("empty image or image exceeds 15 MiB")
    return payload

def main() -> int:
    DESTINATION.mkdir(parents=True, exist_ok=True)
    failures: list[str] = []

    for filename, sources in POSTERS.items():
        output = DESTINATION / filename
        if output.is_file() and output.stat().st_size > 0:
            print(f"SKIP {filename}: already present")
            continue

        last_error: Exception | None = None
        for source in sources:
            try:
                payload = download(source)
                with Image.open(BytesIO(payload)) as original:
                    original.load()
                    image = original.convert("RGB")
                    image.thumbnail((900, 1350), Image.Resampling.LANCZOS)
                    image.save(output, format="WEBP", quality=84, method=6)
                print(f"OK {filename}: {output.stat().st_size} bytes")
                last_error = None
                break
            except Exception as error:  # report the source and try the next trusted source
                last_error = error
                print(f"WARN {filename}: source failed ({source}): {error}")

        if last_error is not None:
            failures.append(f"{filename}: {last_error}")

    if failures:
        print("\nPoster download failures:")
        for failure in failures:
            print(f" - {failure}")
        return 1

    print(f"\nPASS: {len(POSTERS)} locally hosted poster assets are ready.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
