const USERS_KEY = "shoptech_users";
const SESSION_KEY = "shoptech_session";

const defaultUsers = [
  {
    id: 1,
    name: "Default Admin",
    email: "admin@shoptech.com",
    password: "admin123",
    role: "admin"
  },
  {
    id: 2,
    name: "Default User",
    email: "user@shoptech.com",
    password: "user123",
    role: "customer"
  }
];

const seedUsers = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
};

// Initialize
seedUsers();

export const authService = {
  getUsers: () => {
    seedUsers();
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  },

  register: (userData) => {
    const users = authService.getUsers();
    
    // Check if user exists
    const exists = users.find((u) => u.email === userData.email);
    if (exists) {
      throw new Error("Email already registered");
    }

    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || "customer" // Default to customer
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Do not auto-login upon registration as per plan, we will redirect to login page.
    return newUser;
  },

  login: (email, password) => {
    const users = authService.getUsers();
    const user = users.find((u) => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Create session
    const session = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: `mock-jwt-token-${user.id}-${Date.now()}`
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentSession: () => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  // Update user role (admin <-> customer)
  updateUserRole: (userId, newRole) => {
    const users = authService.getUsers();
    const index = users.findIndex((u) => u.id === Number(userId));
    if (index === -1) return null;

    users[index].role = newRole;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return users[index];
  },

  // Delete a user by ID
  deleteUser: (userId) => {
    const users = authService.getUsers();
    const filtered = users.filter((u) => u.id !== Number(userId));
    localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
    return true;
  }
};
