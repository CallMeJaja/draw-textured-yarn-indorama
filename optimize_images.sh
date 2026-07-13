#!/bin/bash
cd /home/eza/Projects/draw-textured-yarn-indorama/assets

# Optimize main images
for f in img/*.jpg; do
  if [ -f "$f" ]; then
    echo "Processing $f..."
    # Create optimized JPG
    npx -y sharp-cli -i "$f" -o "img/opt_$(basename "$f")" -q 80 resize 1200 --withoutEnlargement
    # Create WebP
    npx -y sharp-cli -i "$f" -o "img/$(basename "${f%.jpg}.webp")" -q 80 -f webp resize 1200 --withoutEnlargement
    # Replace original with optimized
    mv "img/opt_$(basename "$f")" "$f"
  fi
done

# Optimize gallery images
for f in img/gallery/*.jpg; do
  if [ -f "$f" ]; then
    echo "Processing $f..."
    # Create optimized JPG
    npx -y sharp-cli -i "$f" -o "img/gallery/opt_$(basename "$f")" -q 80 resize 1200 --withoutEnlargement
    # Create WebP
    npx -y sharp-cli -i "$f" -o "img/gallery/$(basename "${f%.jpg}.webp")" -q 80 -f webp resize 1200 --withoutEnlargement
    # Replace original with optimized
    mv "img/gallery/opt_$(basename "$f")" "$f"
  fi
done

echo "Optimization complete!"
