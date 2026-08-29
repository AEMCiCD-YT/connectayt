import urllib.request
import re
import os

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

pages = {
    'uce.png': 'https://es.wikipedia.org/wiki/Universidad_Central_del_Ecuador',
    'utn.png': 'https://es.wikipedia.org/wiki/Universidad_T%C3%A9cnica_del_Norte',
    'espoch.png': 'https://es.wikipedia.org/wiki/Escuela_Superior_Polit%C3%A9cnica_de_Chimborazo'
}

for out_name, url in pages.items():
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8')
            # Look for all image tags in infobox or page
            img_srcs = re.findall(r'<img[^>]+src="([^"]+)"', html)
            print(f"--- Images for {out_name} ---")
            found = False
            for src in img_srcs:
                if 'upload.wikimedia.org' in src and not src.endswith('.svg') and ('Escudo' in src or 'Logo' in src or 'logo' in src or 'escudo' in src or 'Universidad' in src or 'emblem' in src or 'Emblema' in src):
                    if src.startswith('//'):
                        src = 'https:' + src
                    # Transform thumbnail to high-res (800px)
                    highres = re.sub(r'/[0-9]+px-', '/800px-', src)
                    print(f"Trying highres: {highres}")
                    try:
                        with urllib.request.urlopen(urllib.request.Request(highres, headers=headers)) as r, open(f'assets/logos/institutions/{out_name}', 'wb') as f:
                            f.write(r.read())
                        print(f" Successfully saved {out_name} (size: {os.path.getsize(f'assets/logos/institutions/{out_name}')} bytes)")
                        found = True
                        break
                    except Exception as e:
                        print(f"Highres failed ({e}), trying standard: {src}")
                        with urllib.request.urlopen(urllib.request.Request(src, headers=headers)) as r, open(f'assets/logos/institutions/{out_name}', 'wb') as f:
                            f.write(r.read())
                        print(f" Successfully saved {out_name} standard (size: {os.path.getsize(f'assets/logos/institutions/{out_name}')} bytes)")
                        found = True
                        break
            if not found:
                print(f"No specific logo found in img tags for {out_name}, total imgs: {len(img_srcs)}")
                for s in img_srcs[:5]:
                    print("  candidate:", s)
    except Exception as e:
        print(f"Error {out_name}: {e}")
