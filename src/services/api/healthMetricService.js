import { toast } from 'react-toastify';

class HealthMetricService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'health_metric';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          'Name', 'date', 'weight', 'waist', 'hips', 'arms', 'bmi', 'user_id',
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
      console.error('Error fetching health metrics:', error);
      toast.error('Failed to fetch health metrics');
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          'Name', 'date', 'weight', 'waist', 'hips', 'arms', 'bmi', 'user_id',
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
      console.error(`Error fetching health metric with ID ${id}:`, error);
      toast.error('Failed to fetch health metric');
      return null;
    }
  }

  async create(metricData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: metricData.Name || `Health Metric ${new Date().toLocaleDateString()}`,
          date: metricData.date ? new Date(metricData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          weight: parseFloat(metricData.weight) || 0,
          waist: parseInt(metricData.waist) || 0,
          hips: parseInt(metricData.hips) || 0,
          arms: parseInt(metricData.arms) || 0,
          bmi: parseFloat(metricData.bmi) || 0,
          user_id: parseInt(metricData.user_id) || parseInt(metricData.userId) || null,
          Tags: Array.isArray(metricData.tags)
            ? metricData.tags.join(',')
            : metricData.Tags || metricData.tags || ''
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
          toast.success('Health metric created successfully');
          return successfulRecords[0].data;
        }
      }

      throw new Error('Failed to create health metric');
    } catch (error) {
      console.error('Error creating health metric:', error);
      throw error;
    }
  }

  async update(id, metricData) {
    try {
      // Only include Updateable fields plus Id
      const params = {
        records: [{
          Id: parseInt(id),
          Name: metricData.Name,
          date: metricData.date ? new Date(metricData.date).toISOString().split('T')[0] : undefined,
          weight: metricData.weight ? parseFloat(metricData.weight) : undefined,
          waist: metricData.waist ? parseInt(metricData.waist) : undefined,
          hips: metricData.hips ? parseInt(metricData.hips) : undefined,
          arms: metricData.arms ? parseInt(metricData.arms) : undefined,
          bmi: metricData.bmi ? parseFloat(metricData.bmi) : undefined,
          user_id: metricData.user_id ? parseInt(metricData.user_id) : (metricData.userId ? parseInt(metricData.userId) : undefined),
          Tags: Array.isArray(metricData.tags)
            ? metricData.tags.join(',')
            : metricData.Tags || metricData.tags
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
          toast.success('Health metric updated successfully');
          return successfulUpdates[0].data;
        }
      }

      throw new Error('Failed to update health metric');
    } catch (error) {
      console.error('Error updating health metric:', error);
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
          toast.success('Health metric deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error deleting health metric:', error);
      throw error;
    }
  }
}

export default new HealthMetricService();