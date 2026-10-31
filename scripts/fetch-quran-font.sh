#!/usr/bin/env bash
# Скачивает шрифт KFGQPC HAFS Uthmanic Script (Комплекс короля Фахда) — тот же, которым QuranEnc
# показывает арабский текст из src/data/quran.json — и распаковывает WOFF2 в TTF (React Native не читает WOFF2).
# Нужен Python с fontTools и brotli: pip install fonttools brotli
set -euo pipefail
cd "$(dirname "$0")/.."
tmp=$(mktemp -d)
curl -fsSL https://quranenc.com/assets_2/fonts/Hafs_20.woff2 -o "$tmp/Hafs_20.woff2"
python3 - "$tmp/Hafs_20.woff2" assets/fonts/UthmanicHafs.ttf <<'PY'
import sys
from fontTools.ttLib import TTFont
f = TTFont(sys.argv[1]); f.flavor = None; f.save(sys.argv[2])
PY
rm -rf "$tmp"
echo "saved assets/fonts/UthmanicHafs.ttf"
