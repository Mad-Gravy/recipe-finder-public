// Joseph Teague, 5/24/2025
// CS 233JS, Term Project "Recipe Finder"

export default class RecipeSearcher {
  constructor(ingredients) {
    this.ingredients = ingredients;
    this.apiKey = process.env.RAPIDAPI_KEY;
    this.apiHost = process.env.RAPIDAPI_HOST;
  }

  async fetchRecipes() {
    const encodedIngredients = this.ingredients.map(i => encodeURIComponent(i)).join('%2C');

    const url = `https://${this.apiHost}/recipes/findByIngredients?ingredients=${encodedIngredients}&number=100&ranking=0&ignorePantry=true`;

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
      return data;
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
      return [];
    }
  }
}