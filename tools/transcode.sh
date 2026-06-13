#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."
mkdir -p assets/_raw_video assets/video assets/img

NAMES="hero-coast-italy adriatic-cliff sunset-yacht swim-inflatables speedboat-sunset"

# move originals out of the web folder (only if still there)
for n in $NAMES; do
  if [ -f "assets/video/$n.mp4" ] && [ ! -f "assets/_raw_video/$n.mp4" ]; then
    mv "assets/video/$n.mp4" "assets/_raw_video/$n.mp4"
  fi
done

for n in $NAMES; do
  src="assets/_raw_video/$n.mp4"
  echo ">> $n"
  ffmpeg -y -loglevel error -i "$src" -t 18 -an \
    -vf "scale=-2:1080" -c:v libx264 -profile:v high -pix_fmt yuv420p \
    -crf 30 -preset slow -movflags +faststart "assets/video/$n.mp4"
  ffmpeg -y -loglevel error -ss 2 -i "$src" -frames:v 1 \
    -vf "scale=-2:1080" -q:v 4 "assets/img/$n-poster.jpg"
  sz=$(stat -c%s "assets/video/$n.mp4")
  echo "   done $(($sz/1000000)) MB"
done
echo "ALL DONE"
ls -la assets/video