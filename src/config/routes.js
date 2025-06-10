import HomePage from '@/components/pages/HomePage';
import MealPlannerPage from '@/components/pages/MealPlannerPage';
import RecipesPage from '@/components/pages/RecipesPage';
import RecipeDetailPage from '@/components/pages/RecipeDetailPage';
import HealthTrackingPage from '@/components/pages/HealthTrackingPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Dashboard',
    path: '/',
    icon: 'Home',
component: HomePage
  },
  mealPlanner: {
    id: 'mealPlanner',
    label: 'Meal Planner',
    path: '/meal-planner',
    icon: 'Calendar',
component: MealPlannerPage
  },
  recipes: {
    id: 'recipes',
    label: 'Recipes',
    path: '/recipes',
    icon: 'ChefHat',
component: RecipesPage
  },
  recipeDetail: {
    id: 'recipeDetail',
    label: 'Recipe Detail',
    path: '/recipe/:id',
    icon: 'Book',
component: RecipeDetailPage,
    hidden: true
  },
  healthTracking: {
    id: 'healthTracking',
    label: 'Health Tracking',
    path: '/health-tracking',
    icon: 'Activity',
component: HealthTrackingPage
  }
};

export const routeArray = Object.values(routes);
export const navigationRoutes = routeArray.filter(route => !route.hidden);