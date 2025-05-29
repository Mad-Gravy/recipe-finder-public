// Joseph Teague, 5/24/2025
// CS 233JS, Term Project "Recipe Finder"

export default class RecipeSearcher {
  constructor(ingredients, requiredIngredients) {
    this.ingredients = ingredients;
    this.requiredIngredients = requiredIngredients;
    this.apiKey = process.env.RAPIDAPI_KEY;
    this.apiHost = process.env.RAPIDAPI_HOST;
  }

  async fetchRecipes() {
    const isStrictSearch = this.requiredIngredients.length > 0;
    let url;

    const encodedIngredients = (list) => list.map(ing => encodeURIComponent(ing)).join('%2C');

    if (isStrictSearch) {
      const required = encodedIngredients(this.requiredIngredients);
      url = `https://${this.apiHost}/recipes/complexSearch?includeIngredients=${required}&number=100&ranking=0&instructionsRequired=true&addRecipeInformation=true&fillIngredients=true&ignorePantry=true`;
    } else {
      const all = encodedIngredients(this.ingredients);
      url = `https://${this.apiHost}/recipes/findByIngredients?ingredients=${all}&number=100&ranking=0&ignorePantry=true`;
    }

    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': this.apiKey,
        'x-rapidapi-host': this.apiHost,
      },
    };

    try {
      const res = await fetch(url, options);
      const data = await res.json();
      const results = data.results || data;

      if (isStrictSearch) {
        // Filter to only recipes that include ALL required ingredients
        const normalize = (str) => str.replace(/[^a-zA-Z]/g, '').toLowerCase();

        return results.filter(recipe => {
          const ingredientNames = recipe.extendedIngredients.map(i => normalize(i.name));
          return this.requiredIngredients.every(req =>
            ingredientNames.some(name => name.includes(normalize(req)))
          );
        });
      }

      return results;
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
      return [];
    }
  }
}
