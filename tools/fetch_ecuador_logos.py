import urllib.request
import json
import os

files = {
    'uce.png': 'Escudo_de_la_Universidad_Central_del_Ecuador.png',
    'utn.png': 'Universidad_T%C3%A9cnica_del_Norte.png',
    'espoch.png': 'Escudo_de_la_Escuela_Superior_Polit%C3%A9cnica_de_Chimborazo.png'
}

headers = {'User-Agent': 'Mozilla/5.0'}

for out_name, enc_title in files.items():
    api_url = 'https://commons.wikimedia.org/w/api.php?action=query&titles=File:' + enc_title + '&prop=imageinfo&iiprop=url&format=json'
    try:
        req = urllib.request.Request(api_url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            for pid, pdata in data['query']['pages'].items():
                if 'imageinfo' in pdata:
                    url = pdata['imageinfo'][0]['url'].split('?')[0]
                    print(f"Downloading {out_name} from {url}")
                    with urllib.request.urlopen(urllib.request.Request(url, headers=headers)) as img_r, open(f'assets/logos/institutions/{out_name}', 'wb') as f:
                        f.write(img_r.read())
                    print(f"Saved {out_name} ({os.path.getsize(f'assets/logos/institutions/{out_name}')} bytes)")
    except Exception as e:
        print(f"Error {out_name}: {e}")
