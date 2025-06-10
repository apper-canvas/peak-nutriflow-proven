import mealPlansData from '../mockData/mealPlans.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MealPlanService {
  constructor() {
    this.data = [...mealPlansData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(250);
    const item = this.data.find(plan => plan.id === id);
    return item ? { ...item } : null;
  }

  async create(mealPlan) {
    await delay(400);
    const newPlan = {
      ...mealPlan,
      id: Date.now().toString()
    };
    this.data.unshift(newPlan);
    return { ...newPlan };
  }

  async update(id, updatedData) {
    await delay(350);
    const index = this.data.findIndex(plan => plan.id === id);
    if (index === -1) {
      throw new Error('Meal plan not found');
    }
    
    this.data[index] = { ...this.data[index], ...updatedData };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(plan => plan.id === id);
    if (index === -1) {
      throw new Error('Meal plan not found');
    }
    
    this.data.splice(index, 1);
    return true;
  }
}

export default new MealPlanService();