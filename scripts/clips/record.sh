#!/usr/bin/env bash
# Re-record the website's app clips from the current app, no hand-driving.
#
#   bun run clips            # every clip
#   bun run clips predict    # just one (predict | lastcall | score)
#
# Needs: a booted iOS simulator with a *development* build of the app
# (APP_ENV=development, bundle com.pulv.elevatorscoreboard.dev) installed,
# because the game is seeded through its dev-only elevatorscoreboard://dev-seed
# link. Plus maestro and ffmpeg on PATH.
#
# Per clip: seed + open the board and run the clip's setup flow (not
# recorded), start simctl recordVideo, run the clip flow, stop, then cut.py
# trims idle gaps and encodes public/clips/<name>.mp4 and a poster .jpg.
#
# The speech-bubble timings in app/page.tsx are still hand-set: after a
# re-record, check them against the new clip (cut.py prints its length).
set -euo pipefail
cd "$(dirname "$0")"
OUT=../../public/clips
RAW=../../.capture/rec-raw
FLOWS=flows
mkdir -p "$RAW" "$OUT"

xcrun simctl list devices booted | grep -q Booted ||
  { echo "Boot a simulator with the dev build first." >&2; exit 1; }

# Clean status bar for every take.
xcrun simctl status_bar booted override --time "09:41" --batteryState charged \
  --batteryLevel 100 --cellularBars 4 --wifiBars 3

# name | round | setup flow ("-" for none)
CLIPS=(
  "predict|5|-"
  "lastcall|5|lastcall-setup.yaml"
  "score|5|score-setup.yaml"
)

record() {
  local name=$1 round=$2 setup=$3
  echo "── $name (round $round)"
  maestro test -e ROUND="$round" "$FLOWS/open-game.yaml" >/dev/null
  [ "$setup" != "-" ] && maestro test "$FLOWS/$setup" >/dev/null

  local raw="$RAW/$name.mp4"
  rm -f "$raw"
  xcrun simctl io booted recordVideo --codec=h264 --force "$raw" &
  local rec=$!
  sleep 1.2 # recorder warm-up; cut.py trims this
  maestro test "$FLOWS/$name.yaml" >/dev/null
  sleep 1.5 # let the last animation land
  kill -INT "$rec"; wait "$rec" 2>/dev/null || true

  local len
  len=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$raw")
  python3 cut.py "$raw" 1.0 "$len" "$OUT/$name.mp4" 0.8
  # Poster: the clip's last frame (the settled result).
  ffmpeg -v error -y -sseof -0.1 -i "$OUT/$name.mp4" -frames:v 1 -q:v 4 \
    "$OUT/$name.jpg"
}

for spec in "${CLIPS[@]}"; do
  IFS='|' read -r name round setup <<<"$spec"
  if [ $# -eq 0 ] || [[ " $* " == *" $name "* ]]; then
    record "$name" "$round" "$setup"
  fi
done

xcrun simctl status_bar booted clear
echo "Done. Check bubble timings in app/page.tsx against the new lengths."
