"""Build original, plated-component recipes. Ingredient weights refer to the USDA state in the snapshot.

No nutrient totals are stored: the app computes them from these weights. A photo is attached only when it shows
this exact dish; every other recipe is drawn from its ingredients instead.
"""
import json
from pathlib import Path

from recipe_list import FILIPINO, INTERNATIONAL

ROOT = Path(__file__).resolve().parents[1]


def build(rows, cuisine):
    """Expand compact rows into the JSON shape the app reads, validating every ingredient ID."""
    known = {food['id'] for food in json.loads((ROOT / 'src/data/foods.json').read_text())}
    recipes = []
    for row in rows:
        missing = [food_id for food_id, _ in row['ingredients'] if food_id not in known]
        if missing:
            raise KeyError(f"{row['id']} uses foods missing from the snapshot: {missing}")
        recipe = {
            'id': row['id'], 'name': row['name'], 'description': row['description'], 'category': row['category'],
            'cuisine': cuisine, 'minutes': row['minutes'], 'servings': row['servings'],
            'ingredients': [{'foodId': food_id, 'grams': grams} for food_id, grams in row['ingredients']],
            'steps': row['steps'],
        }
        for optional in ('english', 'image'):
            if optional in row:
                recipe[optional] = row[optional]
        recipes.append(recipe)
    return recipes


recipes = build(FILIPINO, 'filipino') + build(INTERNATIONAL, 'international')
(ROOT / 'src/data/recipes.json').write_text(json.dumps(recipes, ensure_ascii=False, indent=1) + '\n')
print(f'Generated {len(recipes)} original ingredient compositions; no nutrient totals are stored.')
