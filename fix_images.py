import re

with open('/home/eza/Projects/draw-textured-yarn-indorama/index.html', 'r') as f:
    content = f.read()

# Fix the double loading="lazy" issue
content = content.replace('loading="lazy" / loading="lazy">', 'loading="lazy" />')
content = content.replace('loading="lazy"  loading="lazy">', 'loading="lazy">')

with open('/home/eza/Projects/draw-textured-yarn-indorama/index.html', 'w') as f:
    f.write(content)

print("Fixed images in index.html")
