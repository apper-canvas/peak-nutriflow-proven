import { toast } from 'react-toastify';

class MealPlanService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'meal_plan';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          'Name', 'week_start_date', 'total_calories', 'user_id', 'Tags',
          'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
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
      console.error('Error fetching meal plans:', error);
      toast.error('Failed to fetch meal plans');
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          'Name', 'week_start_date', 'total_calories', 'user_id', 'Tags',
          'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
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
      console.error(`Error fetching meal plan with ID ${id}:`, error);
      toast.error('Failed to fetch meal plan');
      return null;
    }
  }

  async create(mealPlanData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: mealPlanData.Name || `Meal Plan ${new Date().toLocaleDateString()}`,
          week_start_date: mealPlanData.week_start_date 
            ? new Date(mealPlanData.week_start_date).toISOString().split('T')[0]
            : mealPlanData.weekStartDate 
            ? new Date(mealPlanData.weekStartDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          total_calories: parseInt(mealPlanData.total_calories) || parseInt(mealPlanData.totalCalories) || 0,
          user_id: parseInt(mealPlanData.user_id) || parseInt(mealPlanData.userId) || null,
          Tags: Array.isArray(mealPlanData.tags)
            ? mealPlanData.tags.join(',')
            : mealPlanData.Tags || mealPlanData.tags || ''
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
          toast.success('Meal plan created successfully');
          return successfulRecords[0].data;
        }
      }

      throw new Error('Failed to create meal plan');
    } catch (error) {
      console.error('Error creating meal plan:', error);
      throw error;
    }
  }

  async update(id, mealPlanData) {
    try {
      // Only include Updateable fields plus Id
      const params = {
        records: [{
          Id: parseInt(id),
          Name: mealPlanData.Name,
          week_start_date: mealPlanData.week_start_date 
            ? new Date(mealPlanData.week_start_date).toISOString().split('T')[0]
            : mealPlanData.weekStartDate 
            ? new Date(mealPlanData.weekStartDate).toISOString().split('T')[0]
            : undefined,
          total_calories: mealPlanData.total_calories 
            ? parseInt(mealPlanData.total_calories) 
            : mealPlanData.totalCalories 
            ? parseInt(mealPlanData.totalCalories) 
            : undefined,
          user_id: mealPlanData.user_id 
            ? parseInt(mealPlanData.user_id) 
            : mealPlanData.userId 
            ? parseInt(mealPlanData.userId) 
            : undefined,
          Tags: Array.isArray(mealPlanData.tags)
            ? mealPlanData.tags.join(',')
            : mealPlanData.Tags || mealPlanData.tags
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
          toast.success('Meal plan updated successfully');
          return successfulUpdates[0].data;
        }
      }

      throw new Error('Failed to update meal plan');
    } catch (error) {
      console.error('Error updating meal plan:', error);
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
          toast.success('Meal plan deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      throw error;
    }
  }
}

export default new MealPlanService();