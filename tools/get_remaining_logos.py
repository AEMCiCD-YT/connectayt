import urllib.request
import urllib.parse
import json
import os

os.makedirs('assets/logos/institutions', exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

targets = {
    'usfq.png': 'File:Escudo_usfq-01.png',
    'uce.png': 'File:Escudo_de_la_Universidad_Central_del_Ecuador_-_Andrés_Agual.png',
    'espe.png': 'File:Logo_ESPE.png'
}

for out_name, file_page in targets.items():
    api_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(file_page)}&prop=imageinfo&iiprop=url&format=json"
    try:
        req = urllib.request.Request(api_url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data['query']['pages']
            for pid, pdata in pages.items():
                if 'imageinfo' in pdata:
                    url = pdata['imageinfo'][0]['url'].split('?')[0]
                    print(f"Downloading {file_page} from {url}")
                    img_req = urllib.request.Request(url, headers=headers)
                    with urllib.request.urlopen(img_req) as i_resp, open(f'assets/logos/institutions/{out_name}', 'wb') as f:
                        f.write(i_resp.read())
                    print(f"Saved {out_name}")
    except Exception as e:
        print(f"Error {file_page}: {e}")
