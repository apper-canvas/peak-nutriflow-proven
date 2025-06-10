import { toast } from 'react-toastify';

class UserService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'User1';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          'Name', 'email', 'first_name', 'last_name', 'age', 'height', 'weight',
          'activity_level', 'gender', 'profile_complete', 'calories', 'protein',
          'carbs', 'fat', 'fiber', 'goals_set', 'dietary_restrictions', 'allergies',
          'cuisine_preferences', 'created_at', 'last_login_at', 'CreatedOn',
          'CreatedBy', 'ModifiedOn', 'ModifiedBy'
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
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          'Name', 'email', 'first_name', 'last_name', 'age', 'height', 'weight',
          'activity_level', 'gender', 'profile_complete', 'calories', 'protein',
          'carbs', 'fat', 'fiber', 'goals_set', 'dietary_restrictions', 'allergies',
          'cuisine_preferences', 'created_at', 'last_login_at', 'CreatedOn',
          'CreatedBy', 'ModifiedOn', 'ModifiedBy'
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
      console.error(`Error fetching user with ID ${id}:`, error);
      toast.error('Failed to fetch user');
      return null;
    }
  }

  async create(userData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: userData.Name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
          email: userData.email,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          age: userData.age || null,
          height: userData.height || null,
          weight: userData.weight || null,
          activity_level: userData.activity_level || 'moderate',
          gender: userData.gender || '',
          profile_complete: userData.profile_complete || false,
          calories: userData.calories || 2000,
          protein: userData.protein || 150,
          carbs: userData.carbs || 250,
          fat: userData.fat || 67,
          fiber: userData.fiber || 25,
          goals_set: userData.goals_set || false,
          dietary_restrictions: Array.isArray(userData.dietary_restrictions) 
            ? userData.dietary_restrictions.join(',') 
            : userData.dietary_restrictions || '',
          allergies: Array.isArray(userData.allergies) 
            ? userData.allergies.join(',') 
            : userData.allergies || '',
          cuisine_preferences: Array.isArray(userData.cuisine_preferences) 
            ? userData.cuisine_preferences.join(',') 
            : userData.cuisine_preferences || '',
          created_at: new Date().toISOString(),
          last_login_at: new Date().toISOString()
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
          toast.success('User created successfully');
          return successfulRecords[0].data;
        }
      }

      throw new Error('Failed to create user');
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async update(id, userData) {
    try {
      // Only include Updateable fields plus Id
      const params = {
        records: [{
          Id: parseInt(id),
          Name: userData.Name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          age: userData.age,
          height: userData.height,
          weight: userData.weight,
          activity_level: userData.activity_level,
          gender: userData.gender,
          profile_complete: userData.profile_complete,
          calories: userData.calories,
          protein: userData.protein,
          carbs: userData.carbs,
          fat: userData.fat,
          fiber: userData.fiber,
          goals_set: userData.goals_set,
          dietary_restrictions: Array.isArray(userData.dietary_restrictions) 
            ? userData.dietary_restrictions.join(',') 
            : userData.dietary_restrictions,
          allergies: Array.isArray(userData.allergies) 
            ? userData.allergies.join(',') 
            : userData.allergies,
          cuisine_preferences: Array.isArray(userData.cuisine_preferences) 
            ? userData.cuisine_preferences.join(',') 
            : userData.cuisine_preferences,
          last_login_at: new Date().toISOString()
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
          toast.success('User updated successfully');
          return successfulUpdates[0].data;
        }
      }

      throw new Error('Failed to update user');
    } catch (error) {
      console.error('Error updating user:', error);
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
          toast.success('User deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
export default userService;