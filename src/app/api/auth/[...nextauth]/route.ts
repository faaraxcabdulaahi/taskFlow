import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import UserModel from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

export async function POST(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url);
    const action = pathname.split("/").pop();

    console.log("Auth action:", action); // Debug log
    console.log("Request URL:", request.url); // Debug log

    const body = await request.json();
    console.log("Request body:", body); // Debug log

    // SIGNUP
    if (action === "signup") {
      const { name, email, password } = body;

      // Validation
      if (!name || !email || !password) {
        return NextResponse.json(
          { error: "All fields are required" },
          { status: 400 },
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 },
        );
      }

      // Connect to database
      await connectDB();

      // Check if user exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 },
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await UserModel.create({
        name,
        email,
        password: hashedPassword,
      });

      console.log("User created:", user._id); // Debug log

      // Generate token
      const token = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      // Return user without password
      const userResponse = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      };

      const response = NextResponse.json(
        {
          user: userResponse,
          token,
          message: "Registration successful",
        },
        { status: 201 },
      );

      // Set cookie
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    // SIGNIN
    if (action === "signin") {
      const { email, password } = body;

      if (!email || !password) {
        return NextResponse.json(
          { error: "Email and password are required" },
          { status: 400 },
        );
      }

      await connectDB();

      const user = await UserModel.findOne({ email });
      if (!user) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 },
        );
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 },
        );
      }

      const token = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      const userResponse = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      };

      const response = NextResponse.json({
        user: userResponse,
        token,
        message: "Login successful",
      });

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    // LOGOUT
    if (action === "logout") {
      const response = NextResponse.json({ message: "Logout successful" });
      response.cookies.delete("token");
      return response;
    }

    return NextResponse.json({ error: "Action not found" }, { status: 404 });
  } catch (error) {
    console.error("Auth API error:", error);
    return NextResponse.json(
      { error: "Server error occurred" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url);
    const action = pathname.split("/").pop();

    if (action === "session") {
      const token = request.cookies.get("token")?.value;

      if (!token) {
        return NextResponse.json({ user: null });
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
          userId: string;
          email: string;
        };

        await connectDB();
        const user = await UserModel.findById(decoded.userId);

        if (!user) {
          return NextResponse.json({ user: null });
        }

        return NextResponse.json({
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          },
        });
      } catch (error) {
        return NextResponse.json({ user: null });
      }
    }

    return NextResponse.json({ error: "Action not found" }, { status: 404 });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
