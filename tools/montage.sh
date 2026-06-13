#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."
C=assets/_raw_video/clips
RAW=assets/_raw_video
OUT=assets/video
mkdir -p "$OUT" assets/img

# build_montage OUTFILE  "file|start|dur"  "file|start|dur" ...
build_montage(){
  local out="$1"; shift
  local segs=("$@")
  local inputs=() filter="" n=0
  for s in "${segs[@]}"; do
    IFS='|' read -r f st du <<< "$s"
    inputs+=( -i "$f" )
    filter+="[${n}:v]trim=start=${st}:duration=${du},setpts=PTS-STARTPTS,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1,fps=30,format=yuv420p[v${n}];"
    n=$((n+1))
  done
  local concat=""
  for ((i=0;i<n;i++)); do concat+="[v${i}]"; done
  concat+="concat=n=${n}:v=1:a=0[outv]"
  echo ">> building $out ($n cuts)"
  ffmpeg -y -loglevel error "${inputs[@]}" \
    -filter_complex "${filter}${concat}" -map "[outv]" -an \
    -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 28 -preset slow -movflags +faststart "$out"
  echo "   $(($(stat -c%s "$out")/1000000)) MB"
}

# ---- HERO montage: boat -> view -> dive -> food -> party -> sunset ----
build_montage "$OUT/hero-montage.mp4" \
  "$C/boat-cruise.mp4|4|2.2" \
  "$C/pov-bow.mp4|3|2.0" \
  "$C/aerial-wake.mp4|3|2.0" \
  "$C/dive.mp4|0.3|1.8" \
  "$C/oliveoil.mp4|4|2.0" \
  "$C/cheers-boat.mp4|3|2.2" \
  "$RAW/sunset-yacht.mp4|2|2.6"

# ---- FOOD / life-on-board montage ----
build_montage "$OUT/food-montage.mp4" \
  "$C/oliveoil.mp4|6|2.0" \
  "$C/burrata.mp4|0.2|1.9" \
  "$C/vongole.mp4|2|2.1" \
  "$C/shrimp-pasta.mp4|4|2.0" \
  "$C/cheers-boat.mp4|6|2.2"

# posters (first frame of each montage)
ffmpeg -y -loglevel error -i "$OUT/hero-montage.mp4" -frames:v 1 -q:v 4 assets/img/hero-montage-poster.jpg
ffmpeg -y -loglevel error -i "$OUT/food-montage.mp4" -frames:v 1 -q:v 4 assets/img/food-montage-poster.jpg

echo "ALL DONE"
ls -la "$OUT"/hero-montage.mp4 "$OUT"/food-montage.mp4
