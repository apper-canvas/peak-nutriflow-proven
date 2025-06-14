import { toast } from 'react-toastify';

class RecipeService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'recipe';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          'Name', 'description', 'image', 'prep_time', 'cook_time', 'servings',
          'difficulty', 'calories', 'protein', 'carbs', 'fat', 'ingredients',
          'instructions', 'category', 'Tags', 'CreatedOn', 'CreatedBy',
          'ModifiedOn', 'ModifiedBy'
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast.error('Failed to fetch recipes');
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          'Name', 'description', 'image', 'prep_time', 'cook_time', 'servings',
          'difficulty', 'calories', 'protein', 'carbs', 'fat', 'ingredients',
          'instructions', 'category', 'Tags', 'CreatedOn', 'CreatedBy',
          'ModifiedOn', 'ModifiedBy'
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching recipe with ID ${id}:`, error);
      toast.error('Failed to fetch recipe');
      return null;
    }
  }

  async create(recipeData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: recipeData.Name || recipeData.name,
          description: recipeData.description || '',
          image: recipeData.image || '',
          prep_time: recipeData.prep_time || recipeData.prepTime || 0,
          cook_time: recipeData.cook_time || recipeData.cookTime || 0,
          servings: recipeData.servings || 1,
          difficulty: recipeData.difficulty || 'Easy',
          calories: recipeData.calories || 0,
          protein: recipeData.protein || 0,
          carbs: recipeData.carbs || 0,
          fat: recipeData.fat || 0,
          ingredients: Array.isArray(recipeData.ingredients) 
            ? JSON.stringify(recipeData.ingredients)
            : recipeData.ingredients || '',
          instructions: Array.isArray(recipeData.instructions)
            ? recipeData.instructions.join('\n')
            : recipeData.instructions || '',
          category: recipeData.category || 'Salad',
          Tags: Array.isArray(recipeData.tags)
            ? recipeData.tags.join(',')
            : recipeData.Tags || recipeData.tags || ''
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${failedRecords}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Recipe created successfully');
          return successfulRecords[0].data;
        }
      }

      throw new Error('Failed to create recipe');
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  }

  async update(id, recipeData) {
    try {
      // Only include Updateable fields plus Id
      const params = {
        records: [{
          Id: parseInt(id),
          Name: recipeData.Name || recipeData.name,
          description: recipeData.description,
          image: recipeData.image,
          prep_time: recipeData.prep_time || recipeData.prepTime,
          cook_time: recipeData.cook_time || recipeData.cookTime,
          servings: recipeData.servings,
          difficulty: recipeData.difficulty,
          calories: recipeData.calories,
          protein: recipeData.protein,
          carbs: recipeData.carbs,
          fat: recipeData.fat,
          ingredients: Array.isArray(recipeData.ingredients) 
            ? JSON.stringify(recipeData.ingredients)
            : recipeData.ingredients,
          instructions: Array.isArray(recipeData.instructions)
            ? recipeData.instructions.join('\n')
            : recipeData.instructions,
          category: recipeData.category,
          Tags: Array.isArray(recipeData.tags)
            ? recipeData.tags.join(',')
            : recipeData.Tags || recipeData.tags
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${failedUpdates}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Recipe updated successfully');
          return successfulUpdates[0].data;
        }
      }

      throw new Error('Failed to update recipe');
    } catch (error) {
      console.error('Error updating recipe:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${failedDeletions}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Recipe deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }
  }
}

export default new RecipeService();