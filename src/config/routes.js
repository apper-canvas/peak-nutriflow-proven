import Home from '../pages/Home';
import MealPlanner from '../pages/MealPlanner';
import Recipes from '../pages/Recipes';
import RecipeDetail from '../pages/RecipeDetail';
import HealthTracking from '../pages/HealthTracking';

export const routes = {
  home: {
    id: 'home',
    label: 'Dashboard',
    path: '/',
    icon: 'Home',
    component: Home
  },
  mealPlanner: {
    id: 'mealPlanner',
    label: 'Meal Planner',
    path: '/meal-planner',
    icon: 'Calendar',
    component: MealPlanner
  },
  recipes: {
    id: 'recipes',
    label: 'Recipes',
    path: '/recipes',
    icon: 'ChefHat',
    component: Recipes
  },
  recipeDetail: {
    id: 'recipeDetail',
    label: 'Recipe Detail',
    path: '/recipe/:id',
    icon: 'Book',
    component: RecipeDetail,
    hidden: true
  },
  healthTracking: {
    id: 'healthTracking',
    label: 'Health Tracking',
    path: '/health-tracking',
    icon: 'Activity',
    component: HealthTracking
  }
};

export const routeArray = Object.values(routes);
export const navigationRoutes = routeArray.filter(route => !route.hidden);