export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskInput {
  title: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
}

export interface ApiResponse<T = any> {
  message?: string;
  error?: string;
  data?: T;
  task?: Task;
  tasks?: Task[];
  user?: User;
  token?: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}