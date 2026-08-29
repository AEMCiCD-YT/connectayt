import urllib.request
import os

url = 'https://ecuadorweb.net/wp-content/uploads/sello-uce-logotipo-universidad-central-ecuador-1.png'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as resp, open('assets/logos/institutions/uce.png', 'wb') as f:
        f.write(resp.read())
    print(f"UCE saved successfully: {os.path.getsize('assets/logos/institutions/uce.png')} bytes")
except Exception as e:
    print(f"Error: {e}")
