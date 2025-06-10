import healthMetricsData from '../mockData/healthMetrics.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class HealthMetricService {
  constructor() {
    this.data = [...healthMetricsData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(250);
    const item = this.data.find(metric => metric.id === id);
    return item ? { ...item } : null;
  }

  async create(metric) {
    await delay(400);
    const newMetric = {
      ...metric,
      id: Date.now().toString()
    };
    this.data.unshift(newMetric);
    return { ...newMetric };
  }

  async update(id, updatedData) {
    await delay(350);
    const index = this.data.findIndex(metric => metric.id === id);
    if (index === -1) {
      throw new Error('Health metric not found');
    }
    
    this.data[index] = { ...this.data[index], ...updatedData };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(metric => metric.id === id);
    if (index === -1) {
      throw new Error('Health metric not found');
    }
    
    this.data.splice(index, 1);
    return true;
  }
}

export default new HealthMetricService();