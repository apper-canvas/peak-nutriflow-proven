// Central export for all services
import recipeService from './api/recipeService';
import healthMetricService from './api/healthMetricService';
import mealPlanService from './api/mealPlanService';
import userService from './api/userService';

export {
  recipeService,
  healthMetricService,
  mealPlanService,
  userService
};

export default {
  recipes: recipeService,
  healthMetrics: healthMetricService,
  mealPlans: mealPlanService,
  users: userService
};
export { default as recipeService } from './api/recipeService';
export { default as healthMetricService } from './api/healthMetricService';