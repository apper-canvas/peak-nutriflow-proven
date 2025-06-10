import usersData from '../mockData/users.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {
  constructor() {
    this.data = [...usersData];
  }

  async register(email, password) {
    await delay(400);
    
    // Check if user already exists
    const existingUser = this.data.find(user => user.email === email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In production, this would be hashed
      profile: {
        firstName: '',
        lastName: '',
        age: null,
        height: null,
        weight: null,
        activityLevel: 'moderate',
        gender: '',
        profileComplete: false
      },
      nutritionGoals: {
        calories: 2000,
        protein: 150,
        carbs: 250,
        fat: 67,
        fiber: 25,
        goalsSet: false
      },
      preferences: {
        dietaryRestrictions: [],
        allergies: [],
        cuisinePreferences: []
      },
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    this.data.push(newUser);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async login(email, password) {
    await delay(350);
    
    const user = this.data.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    user.lastLoginAt = new Date().toISOString();
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async logout() {
    await delay(200);
    return true;
  }

  async getById(id) {
    await delay(250);
    const user = this.data.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(id, profileData) {
    await delay(350);
    
    const userIndex = this.data.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.data[userIndex].profile = {
      ...this.data[userIndex].profile,
      ...profileData,
      profileComplete: true
    };

    // Return user without password
    const { password: _, ...userWithoutPassword } = this.data[userIndex];
    return userWithoutPassword;
  }

  async updateNutritionGoals(id, goalsData) {
    await delay(350);
    
    const userIndex = this.data.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.data[userIndex].nutritionGoals = {
      ...this.data[userIndex].nutritionGoals,
      ...goalsData,
      goalsSet: true
    };

    // Return user without password
    const { password: _, ...userWithoutPassword } = this.data[userIndex];
    return userWithoutPassword;
  }

  async updatePreferences(id, preferences) {
    await delay(300);
    
    const userIndex = this.data.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.data[userIndex].preferences = {
      ...this.data[userIndex].preferences,
      ...preferences
    };

    // Return user without password
    const { password: _, ...userWithoutPassword } = this.data[userIndex];
    return userWithoutPassword;
  }

  async getAll() {
    await delay(300);
    // Return all users without passwords (admin function)
    return this.data.map(({ password: _, ...user }) => user);
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    
    this.data.splice(index, 1);
    return true;
  }
}

export const userService = new UserService();
export default userService;