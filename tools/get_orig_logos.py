import urllib.request
import urllib.parse
import json
import os

headers = {'User-Agent': 'ConectaYTPlatform/1.0 (https://github.com/arielpincayy/connectayt; contact@yachaytech.edu.ec)'}

files = {
    'uce.png': 'Escudo de la Universidad Central del Ecuador.png',
    'utn.png': 'Universidad Técnica del Norte.png',
    'espoch.png': 'Escudo de la Escuela Superior Politécnica de Chimborazo.png'
}

for out_name, title in files.items():
    api_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles=File:{urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&format=json"
    try:
        req = urllib.request.Request(api_url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            for pid, pdata in data['query']['pages'].items():
                if 'imageinfo' in pdata and len(pdata['imageinfo']) > 0:
                    raw_url = pdata['imageinfo'][0]['url'].split('?')[0]
                    print(f"Downloading original: {raw_url}")
                    with urllib.request.urlopen(urllib.request.Request(raw_url, headers=headers)) as img_r, open(f'assets/logos/institutions/{out_name}', 'wb') as f:
                        f.write(img_r.read())
                    print(f"Successfully saved {out_name} (size: {os.path.getsize(f'assets/logos/institutions/{out_name}')} bytes)")
    except Exception as e:
        print(f"Error {title}: {e}")
