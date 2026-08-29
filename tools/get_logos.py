import urllib.request
import urllib.parse
import json
import os

os.makedirs('assets/logos/institutions', exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

exact_files = {
    'epn.png': 'File:Escuela_Politécnica_Nacional.png',
    'uce.png': 'File:Escudo_de_la_Universidad_Central_del_Ecuador.svg',
    'espe.png': 'File:Logo_ESPE.png',
    'utn.png': 'File:Logo_Universidad_Técnica_del_Norte.png',
    'usfq.png': 'File:USFQ_logo.png',
    'udla.png': 'File:UDLA-logo-oficial.jpg',
    'espoch.png': 'File:Logo_ESPOCH.png',
    'ieee_wie.png': 'File:IEEE_Women_in_Engineering_logo.png',
    'ieee_cs.png': 'File:IEEE_Computer_Society_logo.png'
}

for out_name, file_page in exact_files.items():
    api_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(file_page)}&prop=imageinfo&iiprop=url&format=json"
    try:
        req = urllib.request.Request(api_url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data['query']['pages']
            found = False
            for pid, pdata in pages.items():
                if 'imageinfo' in pdata:
                    url = pdata['imageinfo'][0]['url'].split('?')[0]
                    print(f"Downloading {file_page} from {url}")
                    img_req = urllib.request.Request(url, headers=headers)
                    with urllib.request.urlopen(img_req) as i_resp, open(f'assets/logos/institutions/{out_name}', 'wb') as f:
                        f.write(i_resp.read())
                    print(f"Saved {out_name}")
                    found = True
                    break
            if not found:
                print(f"Not found: {file_page}")
    except Exception as e:
        print(f"Error {file_page}: {e}")
