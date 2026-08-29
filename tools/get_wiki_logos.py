import urllib.request
import urllib.parse
import json

headers = {'User-Agent': 'Mozilla/5.0'}

pages = {
    'uce.png': 'Universidad Central del Ecuador',
    'utn.png': 'Universidad Técnica del Norte',
    'espoch.png': 'Escuela Superior Politécnica de Chimborazo'
}

for out_name, page_title in pages.items():
    api_url = f"https://es.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(page_title)}&prop=pageimages|images&pithumbsize=800&format=json"
    try:
        req = urllib.request.Request(api_url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            for pid, pdata in data['query']['pages'].items():
                if 'thumbnail' in pdata:
                    src = pdata['thumbnail']['source']
                    print(f"Thumbnail for {page_title}: {src}")
                    with urllib.request.urlopen(urllib.request.Request(src, headers=headers)) as img_r, open(f'assets/logos/institutions/{out_name}', 'wb') as f:
                        f.write(img_r.read())
                    print(f"Saved {out_name}")
                elif 'images' in pdata:
                    for im in pdata['images']:
                        print(f" Image in page: {im['title']}")
    except Exception as e:
        print(f"Error {page_title}: {e}")
