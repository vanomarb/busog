"""Reproduce the offline snapshot from a fixed official USDA JSON release; never fabricate nutrients."""
import hashlib
import io
import json
from pathlib import Path
import urllib.request
import zipfile

from snapshot_foods import CURATED

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / '.research'
RELEASE = 'FoodData_Central_sr_legacy_food_json_2018-04.zip'


def download(filename):
    """Cache the archive locally while retaining a checksum for the checked-in provenance manifest."""
    CACHE.mkdir(exist_ok=True)
    target = CACHE / 'sr.zip'
    url = 'https://fdc.nal.usda.gov/fdc-datasets/' + filename
    if not target.exists():
        request = urllib.request.Request(url, headers={'User-Agent': 'BusogSnapshot/1.0'})
        target.write_bytes(urllib.request.urlopen(request, timeout=120).read())
    archive = target.read_bytes()
    with zipfile.ZipFile(io.BytesIO(archive)) as bundle:
        name = next(name for name in bundle.namelist() if name.endswith('.json'))
        data = json.loads(bundle.read(name))
    return next(iter(data.values())), {'url': url, 'sha256': hashlib.sha256(archive).hexdigest()}


def normalize(food, identifier, name, local, category):
    """Require all four published macronutrients; missing is never silently interpreted as zero."""
    nutrients = {item['nutrient']['id']: item.get('amount') for item in food['foodNutrients']}
    energy = next((nutrients[key] for key in [1008, 2048, 2047] if nutrients.get(key) is not None), None)
    values = [energy, nutrients.get(1003), nutrients.get(1005), nutrients.get(1004)]
    if any(value is None or value < 0 for value in values):
        raise ValueError(f'{identifier} ({food["fdcId"]}) lacks a published macronutrient.')
    portions = []
    for portion in food.get('foodPortions', []):
        weight = portion.get('gramWeight', 0)
        label = portion.get('modifier') or portion.get('portionDescription') or 'USDA portion'
        if len(label) > 32:
            label = label.split(' (')[0]
        if weight > 0:
            portions.append({'label': f"{portion.get('amount', 1):g} {label}", 'grams': weight})
    result = {
        'id': identifier, 'fdcId': food['fdcId'], 'name': name, 'description': food['description'],
        'category': category, 'dataType': food['dataType'],
        'nutrition': {key: round(value, 2) for key, value in zip(['kcal', 'protein', 'carbs', 'fat'], values)},
        'portions': portions[:4], 'source': 'usda',
        'sourceUrl': f"https://fdc.nal.usda.gov/food-details/{food['fdcId']}/nutrients",
    }
    if local:
        result['local'] = local
    return result


def main():
    """Select a curated set of everyday Filipino and international foods by their exact FDC IDs."""
    foods, provenance = download(RELEASE)
    by_id = {food['fdcId']: food for food in foods}
    selected = []
    for category, items in CURATED.items():
        for identifier, fdc_id, name, local in items:
            if fdc_id not in by_id:
                raise KeyError(f'{identifier}: FDC {fdc_id} is not in the SR Legacy release.')
            selected.append(normalize(by_id[fdc_id], identifier, name, local, category))
    output = ROOT / 'src/data'
    output.mkdir(parents=True, exist_ok=True)
    (output / 'foods.json').write_text(json.dumps(selected, ensure_ascii=False, indent=1) + '\n')
    manifest = {'sr': provenance, 'count': len(selected), 'license': 'CC0-1.0', 'basis': 'per 100 g edible portion'}
    (output / 'provenance.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(f'Generated {len(selected)} foods from the official USDA SR Legacy archive.')


if __name__ == '__main__':
    main()
