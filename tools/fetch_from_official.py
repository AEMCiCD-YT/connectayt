import urllib.request
import re
import os

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

sites = {
    'utn.png': 'https://www.utn.edu.ec/',
    'espoch.png': 'https://www.espoch.edu.ec/',
    'uce.png': 'https://www.uce.edu.ec/'
}

for out_name, site in sites.items():
    try:
        req = urllib.request.Request(site, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            # Look for logo in img tags
            logos = re.findall(r'<img[^>]+src="([^">]+\.(?:png|svg|jpg))"', html, re.IGNORECASE)
            print(f"--- Logos found on {site} ---")
            for l in logos:
                if 'logo' in l.lower() or 'escudo' in l.lower() or 'brand' in l.lower() or 'header' in l.lower():
                    if not l.startswith('http'):
                        if l.startswith('//'):
                            l = 'https:' + l
                        elif l.startswith('/'):
                            l = site.rstrip('/') + l
                        else:
                            l = site + l
                    print(f"Candidate: {l}")
                    try:
                        with urllib.request.urlopen(urllib.request.Request(l, headers=headers), timeout=5) as r, open(f'assets/logos/institutions/{out_name}', 'wb') as f:
                            f.write(r.read())
                        print(f" Saved {out_name} from official university site ({os.path.getsize(f'assets/logos/institutions/{out_name}')} bytes)")
                        break
                    except Exception as e:
                        print(f"  Download failed for {l}: {e}")
    except Exception as e:
        print(f"Error connecting to {site}: {e}")
