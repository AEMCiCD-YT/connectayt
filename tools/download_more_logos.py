import urllib.request
import urllib.parse
import json
import os

os.makedirs('assets/logos/institutions', exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

urls = {
    'uce.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Escudo_de_la_Universidad_Central_del_Ecuador.png/800px-Escudo_de_la_Universidad_Central_del_Ecuador.png',
    'utn.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Universidad_T%C3%A9cnica_del_Norte.png/800px-Universidad_T%C3%A9cnica_del_Norte.png',
    'espoch.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Escudo_de_la_Escuela_Superior_Polit%C3%A9cnica_de_Chimborazo.png/800px-Escudo_de_la_Escuela_Superior_Polit%C3%A9cnica_de_Chimborazo.png',
    'ieee_wie.svg': 'https://upload.wikimedia.org/wikipedia/commons/3/30/IEEE_Women_in_Engineering_logo.svg',
    'ieee_cs.svg': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/IEEE_Computer_Society_logo.svg'
}

for name, url in urls.items():
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp, open(f'assets/logos/institutions/{name}', 'wb') as f:
            f.write(resp.read())
        print(f"Downloaded {name} successfully ({os.path.getsize(f'assets/logos/institutions/{name}')} bytes)")
    except Exception as e:
        print(f"Error {name}: {e}")
