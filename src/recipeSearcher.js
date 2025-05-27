// Joseph Teague, 5/24/2025
// CS 233JS, Term Project "Recipe Finder"

export default class RecipeSearcher {
  constructor(ingredients, requiredIngredients) {
    this.ingredients = ingredients;
    this.requiredIngredients = requiredIngredients;
    this.apiKey = process.env.SPOONACULAR_API_KEY;
  }

  async fetchRecipes() {
    const isStrictSearch = this.requiredIngredients.length > 0;
    let url;

    if (isStrictSearch) {
      const required = this.requiredIngredients.join(',');
      url = `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${required}&number=12&instructionsRequired=true&addRecipeInformation=true&fillIngredients=true&ignorePantry=true&apiKey=${this.apiKey}`;
    } else {
      const all = this.ingredients.join(',');
      url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${all}&number=25&ranking=2&ignorePantry=true&apiKey=${this.apiKey}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log('API response:', data);
      return data.results || data;
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
      return [];
    }
  }
}
