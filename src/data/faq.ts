/** Task-oriented answers, plain about what Busog does and does not do. */
export const faq = [
  {
    group: 'Getting started',
    question: 'What does Busog mean?',
    answer:
      'Busog is Filipino for pleasantly full. It starts with ordinary meals and makes room for ' +
      'rice, ulam and merienda.',
  },
  {
    group: 'Getting started',
    question: 'Do I need an account?',
    answer:
      'No. Busog opens with a sample diary you can edit right away, or you can set your own ' +
      'goals first. Everything stays on your device.',
  },
  {
    group: 'Getting started',
    question: 'Is Busog a subscription?',
    answer: 'No. Busog is free in your browser, with no payments or subscriptions. Install it from the Download page.',
  },
  {
    group: 'Getting started',
    question: 'Can I change the starting profile?',
    answer: 'Open You, then edit your goals or revisit onboarding. Existing diary entries remain in place.',
  },
  {
    group: 'Your plate',
    question: 'How does Turo-turo work?',
    answer:
      'Choose the dishes you would point to at a carinderia, set half, regular or extra ' +
      'portions, and choose rice cups. The review total is computed from weighed USDA ' +
      'ingredients.',
  },
  {
    group: 'Your plate',
    question: 'Is a dish exactly like my carinderia’s?',
    answer:
      'No. Busog supplies one explicit ingredient composition. Recipes, sauces and portions ' +
      'differ between cooks. Open How we counted this to decide whether the composition fits ' +
      'your plate.',
  },
  {
    group: 'Your plate',
    question: 'Does Snap recognize my own photos?',
    answer:
      'Not yet. The photo preview uses sample plates: pick one, review its USDA ingredients, ' +
      'adjust the grams and confirm. Nothing is uploaded.',
  },
  {
    group: 'Your plate',
    question: 'Can I edit a food after logging?',
    answer:
      'Tap its diary row, open the serving picker, change grams and save. You can remove the ' +
      'item from the same detail sheet.',
  },
  {
    group: 'Your plate',
    question: 'How much is a cup of rice?',
    answer:
      'The bundled cooked long-grain white rice record lists one cup as 158 grams. That is the ' +
      'serving weight used by the counter; your own cup may differ.',
  },
  {
    group: 'Your plate',
    question: 'What are the little source labels?',
    answer:
      'The hand marks Turo-turo, the camera marks Snap, the database marks USDA ' +
      'search, and the barcode marks Open Food Facts. The label stays with the entry.',
  },
  {
    group: 'Food data',
    question: 'Where are ingredient values from?',
    answer:
      'The snapshot contains 110 everyday foods, each a complete USDA FoodData Central SR Legacy ' +
      'record. Each keeps its FDC ID and its per-100g values.',
  },
  {
    group: 'Food data',
    question: 'Why do cooked and raw values differ?',
    answer:
      'They refer to different food states and water content. Choose the USDA state that ' +
      'matches what you weighed. A cooked gram weight should not be applied to a raw record.',
  },
  {
    group: 'Food data',
    question: 'What if USDA search is offline?',
    answer:
      'Bundled matches stay available. Live search falls back to that snapshot when a request ' +
      'fails or reaches its request budget.',
  },
  {
    group: 'Food data',
    question: 'Where do packaged foods come from?',
    answer:
      'Barcode lookup uses Open Food Facts, an open community database under ODbL. Check the ' +
      'product and nutrition against its pack before logging.',
  },
  {
    group: 'Food data',
    question: 'Why can’t I find a barcode?',
    answer:
      'It may be absent or lack complete calorie and macro data. Check the digits or search ' +
      'USDA for a suitable ingredient. Busog does not fill missing numbers with guesses.',
  },
  {
    group: 'Food data',
    question: 'Are recipes dietitian-approved?',
    answer:
      'No. They are Busog’s own ingredient lists with transparent arithmetic, and have not ' +
      'been reviewed by a dietitian.',
  },
  {
    group: 'Privacy & install',
    question: 'What is saved?',
    answer:
      'Your diary, weights, water and profile are saved in your browser. Clearing browser ' +
      'data removes them, so export JSON first if you want a copy.',
  },
  {
    group: 'Privacy & install',
    question: 'What leaves my browser?',
    answer:
      'USDA search sends your search text and API key directly to USDA. A barcode lookup sends ' +
      'its digits directly to Open Food Facts. No diary or weight history is sent.',
  },
  {
    group: 'Privacy & install',
    question: 'Can I use it without storage?',
    answer:
      'Yes. If browser storage is blocked, Busog keeps working in memory and tells you ' +
      'changes last for this visit.',
  },
  {
    group: 'Privacy & install',
    question: 'How do I install it?',
    answer:
      'Open the Download page for iPhone Safari and Android Chrome instructions. It installs as ' +
      'a web app after being served over HTTPS.',
  },
  {
    group: 'Privacy & install',
    question: 'Does it work offline?',
    answer:
      'Once the app shell and assets have been cached, the local diary, recipes and bundled ' +
      'search work offline. Barcode lookup and live USDA results require a connection.',
  },
  {
    group: 'Goals',
    question: 'How is the calorie target calculated?',
    answer:
      'The adult calculator uses Mifflin–St Jeor resting energy multiplied by your selected ' +
      'activity factor. A small chosen deficit or surplus changes the result by 250 kcal.',
  },
  {
    group: 'Goals',
    question: 'Is the suggested target medical advice?',
    answer:
      'No. It is an educational starting point based on a formula and assumptions, not a ' +
      'measurement or prescription. Seek individual guidance for medical or dietary needs.',
  },
  {
    group: 'Goals',
    question: 'Is the coach a live AI?',
    answer:
      'Not yet. Busog Coach is an early preview that answers on your device from your own diary, ' +
      'such as your protein so far or a recipe for tomorrow. It calls no AI service.',
  },
];
