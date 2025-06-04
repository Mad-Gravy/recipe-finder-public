// Joseph Teague, 5/24/2025
// CS 233JS, Term Project "Recipe Finder"

import './style.css';
import RecipeSearcher from './recipeSearcher';

const input = document.getElementById('ingredient-input');
const addBtn = document.getElementById('add-ingredient');
const ingredientsList = document.getElementById('ingredients-list');
const searchBtn = document.getElementById('search-btn');
const resultsContainer = document.getElementById('results');
const autocompleteResults = document.getElementById('autocomplete-results');

let ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];

// Re-render saved ingredients on page load
ingredients.forEach(renderIngredientPill);

// Event listeners
addBtn.addEventListener('click', handleAddIngredient);
searchBtn.addEventListener('click', handleSearch);
input.addEventListener('keyup', handleAutocomplete);

// Add ingredient to list
function handleAddIngredient() {
  const ingredient = input.value.trim().toLowerCase();
  if (!ingredient || ingredients.includes(ingredient)) return;

  ingredients.push(ingredient);
  ingredients = [...new Set(ingredients)];
  localStorage.setItem('ingredients', JSON.stringify(ingredients));
  renderIngredientPill(ingredient);

  input.value = '';
  autocompleteResults.innerHTML = '';
}

// Render autocomplete suggestions
async function handleAutocomplete() {
  const query = input.value.trim();
  if (query.length < 2) {
    autocompleteResults.innerHTML = '';
    return;
  }

  try {
    const res = await fetch(`https://${process.env.RAPIDAPI_HOST}/food/ingredients/autocomplete?query=${query}&number=5`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST
      }
    });
    const suggestions = await res.json();
    renderAutocompleteList(suggestions);
  } catch (err) {
    console.error('Autocomplete error:', err);
  }
}

// Display autocomplete results
function renderAutocompleteList(suggestions) {
  autocompleteResults.innerHTML = '';
  suggestions.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.name;
    li.className = 'list-group-item list-group-item-action';
    li.addEventListener('click', () => {
      input.value = item.name;
      autocompleteResults.innerHTML = '';
    });
    autocompleteResults.appendChild(li);
  });
}

// Display ingredient as a pill
function renderIngredientPill(name) {
  const pill = document.createElement('span');
  pill.className = 'badge bg-primary m-1';
  pill.textContent = name;

  const removeBtn = document.createElement('button');
  removeBtn.textContent = '×';
  removeBtn.className = 'btn-close btn-close-white ms-2';
  removeBtn.style.fontSize = '0.6rem';
  removeBtn.addEventListener('click', () => {
    ingredients = ingredients.filter(i => i !== name);
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
    pill.remove();
  });

  pill.appendChild(removeBtn);
  ingredientsList.appendChild(pill);
}

// Search for recipes
async function handleSearch() {
  resultsContainer.innerHTML = '<p>Searching for recipes...</p>';
  const searcher = new RecipeSearcher(ingredients);
  const meals = await searcher.fetchRecipes();

  resultsContainer.innerHTML = '';
  if (!meals || meals.length === 0) {
    resultsContainer.innerHTML = '<p>No recipes found. Try adding more ingredients!</p>';
    return;
  }
  // Sort recipes by least to most missing ingredients
  meals.sort((a, b) => (a.missedIngredientCount || 0) - (b.missedIngredientCount || 0));

  // Generate search results as recipe cards
  meals.forEach(meal => {
    const card = document.createElement('div');
    card.className = 'card mb-3';
    card.innerHTML = `
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${meal.image}" class="img-fluid rounded-start" alt="${meal.title}">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${meal.title}</h5>
            <p class="card-text">Missing ingredients: ${meal.missedIngredientCount || 0}</p>
            ${meal.missedIngredients ? `<ul>${meal.missedIngredients.map(i => `<li>${i.name}</li>`).join('')}</ul>` : ''}
            <a href="https://spoonacular.com/recipes/${meal.title.replace(/ /g, '-')}-${meal.id}" class="btn btn-success" target="_blank">View Recipe</a>
          </div>
        </div>
      </div>
    `;
    resultsContainer.appendChild(card);
  });
}