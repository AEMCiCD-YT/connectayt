import urllib.request
import re

url = 'https://yachaytech.edu.ec/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
    
    matches = re.findall(r'src=["\']([^"\']+\.(?:png|svg|jpg|jpeg|webp))["\']', html)
    print("Found images:", len(matches))
    for m in matches:
        if any(k in m.lower() for k in ['logo', 'header', 'brand', 'yachay', 'icon']):
            print("Logo match:", m)
except Exception as e:
    print("Error:", e)
