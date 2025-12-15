export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // Hashed password
  createdAt: Date;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

// In-memory user storage (replace with database in production)
export class UserStore {
  private users: Map<string, User> = new Map();

  createUser(user: User): void {
    this.users.set(user.id, user);
  }

  findByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  findByUsername(username: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  findById(id: string): User | undefined {
    return this.users.get(id);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }
}

export const userStore = new UserStore();
