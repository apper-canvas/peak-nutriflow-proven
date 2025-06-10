import users from '@/services/mockData/users.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock storage for user data (in real app, this would be a database)
let mockUsers = [...users];
let currentUserId = mockUsers.length > 0 ? Math.max(...mockUsers.map(u => u.id)) + 1 : 1;

export const userService = {
  // Register a new user
  async register(email, password) {
    await delay(800);
    
    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser = {
      id: currentUserId++,
      email,
      password, // In real app, this would be hashed
      profile: null,
      nutritionGoals: null,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    mockUsers.push(newUser);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  // Login user
  async login(email, password) {
    await delay(600);
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Logout user
  async logout() {
    await delay(200);
    // In real app, this might invalidate tokens, etc.
    return true;
  },

  // Update user profile
  async updateProfile(userId, profileData) {
    await delay(500);
    
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Update profile
    mockUsers[userIndex].profile = {
      ...mockUsers[userIndex].profile,
      ...profileData,
      updatedAt: new Date().toISOString()
    };

    // Return updated user without password
    const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
    return userWithoutPassword;
  },

  // Update nutrition goals
  async updateNutritionGoals(userId, goalsData) {
    await delay(500);
    
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Update nutrition goals
    mockUsers[userIndex].nutritionGoals = {
      ...goalsData,
      updatedAt: new Date().toISOString()
    };

    // Return updated user without password
    const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
    return userWithoutPassword;
  },

  // Get user by ID
  async getUserById(userId) {
    await delay(300);
    
    const user = mockUsers.find(user => user.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Update user preferences
  async updatePreferences(userId, preferences) {
    await delay(400);
    
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    mockUsers[userIndex].preferences = {
      ...mockUsers[userIndex].preferences,
      ...preferences,
      updatedAt: new Date().toISOString()
    };

    const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
    return userWithoutPassword;
  },

  // Reset password (mock implementation)
  async resetPassword(email) {
    await delay(600);
    
    const user = mockUsers.find(user => user.email === email);
    if (!user) {
      throw new Error('User with this email not found');
    }

    // In real app, this would send an email with reset link
    console.log(`Password reset email sent to ${email}`);
    return { message: 'Password reset email sent' };
  }
};