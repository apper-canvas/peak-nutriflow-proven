import HomePage from '@/components/pages/HomePage';
import MealPlannerPage from '@/components/pages/MealPlannerPage';
import RecipesPage from '@/components/pages/RecipesPage';
import RecipeDetailPage from '@/components/pages/RecipeDetailPage';
import HealthTrackingPage from '@/components/pages/HealthTrackingPage';
import RegisterPage from '@/components/pages/RegisterPage';
import LoginPage from '@/components/pages/LoginPage';
import ProfileSetupPage from '@/components/pages/ProfileSetupPage';
import NutritionGoalsPage from '@/components/pages/NutritionGoalsPage';

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
  },
  register: {
    id: 'register',
    label: 'Register',
    path: '/register',
    icon: 'UserPlus',
    component: RegisterPage,
    hidden: true
  },
  login: {
    id: 'login',
    label: 'Login',
    path: '/login',
    icon: 'LogIn',
    component: LoginPage,
    hidden: true
  },
  profileSetup: {
    id: 'profileSetup',
    label: 'Profile Setup',
    path: '/profile-setup',
    icon: 'User',
    component: ProfileSetupPage,
    hidden: true
  },
  nutritionGoals: {
    id: 'nutritionGoals',
    label: 'Nutrition Goals',
    path: '/nutrition-goals',
    icon: 'Target',
    component: NutritionGoalsPage,
    hidden: true
  }
};

export const routeArray = Object.values(routes);
export const navigationRoutes = routeArray.filter(route => !route.hidden);