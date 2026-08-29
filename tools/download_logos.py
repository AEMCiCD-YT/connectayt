import urllib.request
import urllib.parse
import json
import os

os.makedirs('assets/logos/institutions', exist_ok=True)
headers = {'User-Agent': 'ConectaYT/1.0 (https://github.com/arielpincayy/connectayt; contact@yachaytech.edu.ec)'}

queries = {
    'yachay_tech.png': 'Logotipo Universidad Yachay Tech.png',
    'espol.svg': 'ESPOL - Logo 001.svg',
    'epn.png': 'Escudo de la Escuela Politécnica Nacional.png',
    'uce.png': 'Escudo de la Universidad Central del Ecuador.png',
    'espe.png': 'Logo de la Universidad de las Fuerzas Armadas ESPE.png',
    'utn.png': 'Universidad Técnica del Norte.png',
    'usfq.png': 'Logo USFQ.png',
    'udla.png': 'Logo UDLA.png',
    'espoch.png': 'Escudo de la Escuela Superior Politécnica de Chimborazo.png',
    'ieee_wie.svg': 'IEEE Women in Engineering logo.svg',
    'ieee_cs.svg': 'IEEE Computer Society logo.svg'
}

for out_name, title in queries.items():
    api_url = f'https://commons.wikimedia.org/w/api.php?action=query&titles=File:{urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&format=json'
    try:
        req = urllib.request.Request(api_url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data['query']['pages']
            found = False
            for pid, pdata in pages.items():
                if 'imageinfo' in pdata and len(pdata['imageinfo']) > 0:
                    raw_url = pdata['imageinfo'][0]['url'].split('?')[0]
                    print(f"Downloading {title} -> {out_name} from {raw_url}")
                    img_req = urllib.request.Request(raw_url, headers=headers)
                    with urllib.request.urlopen(img_req) as img_resp, open(f'assets/logos/institutions/{out_name}', 'wb') as f:
                        f.write(img_resp.read())
                    print(f" Saved {out_name} successfully!")
                    found = True
                    break
            if not found:
                print(f" Searching generator for: {title}")
                # Fallback to search
                srch_url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(title.split('.')[0])}&srnamespace=6&format=json"
                srch_req = urllib.request.Request(srch_url, headers=headers)
                with urllib.request.urlopen(srch_req) as srch_resp:
                    srch_data = json.loads(srch_resp.read().decode('utf-8'))
                    results = srch_data.get('query', {}).get('search', [])
                    if results:
                        first_title = results[0]['title']
                        print(f" Found alternative title: {first_title}")
                        alt_api = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(first_title)}&prop=imageinfo&iiprop=url&format=json"
                        with urllib.request.urlopen(urllib.request.Request(alt_api, headers=headers)) as a_resp:
                            a_data = json.loads(a_resp.read().decode('utf-8'))
                            for apid, adata in a_data['query']['pages'].items():
                                if 'imageinfo' in adata:
                                    alt_url = adata['imageinfo'][0]['url'].split('?')[0]
                                    with urllib.request.urlopen(urllib.request.Request(alt_url, headers=headers)) as i_resp, open(f'assets/logos/institutions/{out_name}', 'wb') as f:
                                        f.write(i_resp.read())
                                    print(f" Saved {out_name} via search!")
    except Exception as e:
        print(f"Error {title}: {e}")
