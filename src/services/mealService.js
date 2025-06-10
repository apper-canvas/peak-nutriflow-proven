import { toast } from 'react-toastify';

class MealService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'meal';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          'Name', 'day', 'type', 'time', 'calories', 'recipe_id', 'meal_plan_id',
          'Tags', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
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
      console.error('Error fetching meals:', error);
      toast.error('Failed to fetch meals');
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          'Name', 'day', 'type', 'time', 'calories', 'recipe_id', 'meal_plan_id',
          'Tags', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
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
      console.error(`Error fetching meal with ID ${id}:`, error);
      toast.error('Failed to fetch meal');
      return null;
    }
  }

  async create(mealData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: mealData.Name || `${mealData.type} - ${mealData.day}`,
          day: mealData.day,
          type: mealData.type,
          time: mealData.time || '',
          calories: parseInt(mealData.calories) || 0,
          recipe_id: parseInt(mealData.recipe_id) || parseInt(mealData.recipeId) || null,
          meal_plan_id: parseInt(mealData.meal_plan_id) || parseInt(mealData.mealPlanId) || null,
          Tags: Array.isArray(mealData.tags)
            ? mealData.tags.join(',')
            : mealData.Tags || mealData.tags || ''
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
          toast.success('Meal created successfully');
          return successfulRecords[0].data;
        }
      }

      throw new Error('Failed to create meal');
    } catch (error) {
      console.error('Error creating meal:', error);
      throw error;
    }
  }

  async update(id, mealData) {
    try {
      // Only include Updateable fields plus Id
      const params = {
        records: [{
          Id: parseInt(id),
          Name: mealData.Name,
          day: mealData.day,
          type: mealData.type,
          time: mealData.time,
          calories: mealData.calories ? parseInt(mealData.calories) : undefined,
          recipe_id: mealData.recipe_id ? parseInt(mealData.recipe_id) : (mealData.recipeId ? parseInt(mealData.recipeId) : undefined),
          meal_plan_id: mealData.meal_plan_id ? parseInt(mealData.meal_plan_id) : (mealData.mealPlanId ? parseInt(mealData.mealPlanId) : undefined),
          Tags: Array.isArray(mealData.tags)
            ? mealData.tags.join(',')
            : mealData.Tags || mealData.tags
        }].map(record => {
          // Remove undefined fields
          Object.keys(record).forEach(key => {
            if (record[key] === undefined) {
              delete record[key];
            }
          });
          return record;
        })[0]
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
          toast.success('Meal updated successfully');
          return successfulUpdates[0].data;
        }
      }

      throw new Error('Failed to update meal');
    } catch (error) {
      console.error('Error updating meal:', error);
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
          toast.success('Meal deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error deleting meal:', error);
      throw error;
    }
  }
}

export default new MealService();