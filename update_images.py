import re

with open('/home/eza/Projects/draw-textured-yarn-indorama/index.html', 'r') as f:
    content = f.read()

# Pattern for standard images like: <img src="assets/img/hero-group.jpg" alt="..." class="..." id="..." />
# We need to capture the src, and everything else
def replace_img(match):
    img_tag = match.group(0)
    src_match = re.search(r'src="([^"]+)\.jpg"', img_tag)
    if not src_match:
        return img_tag
        
    base_src = src_match.group(1)
    
    # Add loading="lazy" if not present and it's not the hero image
    new_img_tag = img_tag
    if "hero-group" not in base_src and "loading=" not in new_img_tag:
        # Insert loading="lazy" before the closing bracket
        new_img_tag = new_img_tag.replace('/>', 'loading="lazy" />').replace('>', ' loading="lazy">')
        # Clean up any duplicated spaces
        new_img_tag = new_img_tag.replace('  loading', ' loading')

    return f'''<picture>
              <source srcset="{base_src}.webp" type="image/webp" />
              {new_img_tag}
            </picture>'''

# Replace standard images
content = re.sub(r'<img\s+src="assets/img/[^"]+\.jpg"[^>]*>', replace_img, content)

with open('/home/eza/Projects/draw-textured-yarn-indorama/index.html', 'w') as f:
    f.write(content)

print("Images updated in index.html")
