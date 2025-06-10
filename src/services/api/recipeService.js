import recipesData from '../mockData/recipes.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class RecipeService {
  constructor() {
    this.data = [...recipesData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(250);
    const item = this.data.find(recipe => recipe.id === id);
    return item ? { ...item } : null;
  }

  async create(recipe) {
    await delay(400);
    const newRecipe = {
      ...recipe,
      id: Date.now().toString()
    };
    this.data.unshift(newRecipe);
    return { ...newRecipe };
  }

  async update(id, updatedData) {
    await delay(350);
    const index = this.data.findIndex(recipe => recipe.id === id);
    if (index === -1) {
      throw new Error('Recipe not found');
    }
    
    this.data[index] = { ...this.data[index], ...updatedData };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(recipe => recipe.id === id);
    if (index === -1) {
      throw new Error('Recipe not found');
    }
    
    this.data.splice(index, 1);
    return true;
  }
}

export default new RecipeService();