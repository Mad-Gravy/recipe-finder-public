// Joseph Teague, 5/24/2025
// CS 233JS, Term Project "Recipe Finder"

import './style.css';
import RecipeSearcher from './recipeSearcher';

const ingredientForm = document.getElementById('ingredient-form');
const ingredientInput = document.getElementById('ingredient-input');
const ingredientList = document.getElementById('ingredient-list');
const findRecipesBtn = document.getElementById('find-recipes');
const recipesSection = document.getElementById('recipes');

let ingredients = []; // all ingredients
let requiredIngredients = []; // subset of ingredients marked as "required"

window.addEventListener('DOMContentLoaded', () => {
  const stored = localStorage.getItem('ingredients');
  if (stored) {
    ingredients = JSON.parse(stored);
    ingredients.forEach(displayIngredient);
  }
});

ingredientForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const ingredient = ingredientInput.value.trim().toLowerCase();
  if (ingredient && !ingredients.includes(ingredient)) {
    ingredients.push(ingredient);
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
    displayIngredient(ingredient);
    ingredientInput.value = '';
  }
});

function displayIngredient(ingredient) {
  const badge = document.createElement('span');
  badge.className = 'badge rounded-pill bg-info text-dark m-1';
  badge.textContent = ingredient;
  badge.title = 'Click to toggle required / right-click to remove';
  badge.dataset.ingredient = ingredient;

  // Click to toggle "required"
  badge.addEventListener('click', () => {
    if (requiredIngredients.includes(ingredient)) {
      requiredIngredients = requiredIngredients.filter(i => i !== ingredient);
      badge.classList.remove('bg-danger');
      badge.classList.add('bg-info');
    } else {
      requiredIngredients.push(ingredient);
      badge.classList.remove('bg-info');
      badge.classList.add('bg-danger');
    }
  });

  // Right-click to remove
  badge.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    ingredients = ingredients.filter(i => i !== ingredient);
    requiredIngredients = requiredIngredients.filter(i => i !== ingredient);
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
    badge.remove();
  });

  ingredientList.appendChild(badge);
}

findRecipesBtn.addEventListener('click', async () => {
  if (ingredients.length === 0) return alert('Please add ingredients!');
  const searcher = new RecipeSearcher(ingredients, requiredIngredients);
  const recipes = await searcher.fetchRecipes();
  displayRecipes(recipes);
});

function displayRecipes(meals) {
  recipesSection.innerHTML = '';
  if (!meals || meals.length === 0) {
    recipesSection.innerHTML = '<p class="text-center">No recipes found.</p>';
    return;
  }

  meals.forEach(meal => {
    const col = document.createElement('div');
    col.className = 'col-md-3';

    const card = document.createElement('div');
    card.className = 'card h-100';

    const img = document.createElement('img');
    img.src = meal.image;
    img.className = 'card-img-top';

    const body = document.createElement('div');
    body.className = 'card-body d-flex flex-column';

    const title = document.createElement('h5');
    title.className = 'card-title';
    title.textContent = meal.title;

    const link = document.createElement('a');
    link.href = `https://spoonacular.com/recipes/${meal.title.replaceAll(' ', '-')}-${meal.id}`;
    link.target = '_blank';
    link.className = 'btn btn-outline-light mt-auto';
    link.textContent = 'View Recipe';

    body.appendChild(title);
    body.appendChild(link);
    card.appendChild(img);
    card.appendChild(body);
    col.appendChild(card);
    recipesSection.appendChild(col);
  });
}
