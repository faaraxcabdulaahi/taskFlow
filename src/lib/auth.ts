import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connectDB from './db';
import UserModel from '@/models/user';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export class Auth {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(user: AuthUser): string {
    return jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  static verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  static async getUserFromToken(token: string): Promise<AuthUser | null> {
    try {
      const payload = this.verifyToken(token);
      if (!payload) return null;

      await connectDB();
      const user = await UserModel.findById(payload.userId);
      if (!user) return null;

      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      console.error('Error getting user from token:', error);
      return null;
    }
  }

  // FIXED: This method now properly handles both server and client contexts
  static async getSession(request?: NextRequest): Promise<AuthUser | null> {
    try {
      let token: string | undefined;

      // If request is provided (API route), get token from request cookies
      if (request) {
        token = request.cookies.get('token')?.value;
        console.log('Token from request cookies:', token ? 'Present' : 'Not found');
      } 
      // Otherwise, try to get from server components (using next/headers)
      else {
        try {
          const cookieStore = await cookies();
          token = cookieStore.get('token')?.value;
          console.log('Token from server cookies:', token ? 'Present' : 'Not found');
        } catch (error) {
          console.log('Not in server component context');
        }
      }

      if (!token) {
        console.log('No token found in cookies');
        return null;
      }

      return await this.getUserFromToken(token);
    } catch (error) {
      console.error('Session error:', error);
      return null;
    }
  }

  static async login(email: string, password: string): Promise<{ user: AuthUser; token: string } | null> {
    try {
      await connectDB();
      
      const user = await UserModel.findOne({ email });
      if (!user) return null;

      const isValid = await this.comparePassword(password, user.password);
      if (!isValid) return null;

      const authUser: AuthUser = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      };

      const token = this.generateToken(authUser);
      return { user: authUser, token };
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  static async register(name: string, email: string, password: string): Promise<{ user: AuthUser; token: string } | null> {
    try {
      await connectDB();
      
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) return null;

      const hashedPassword = await this.hashPassword(password);
      
      const user = await UserModel.create({
        email,
        password: hashedPassword,
        name,
      });

      const authUser: AuthUser = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      };

      const token = this.generateToken(authUser);
      return { user: authUser, token };
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  }
}