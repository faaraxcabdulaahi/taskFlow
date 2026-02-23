import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TaskModel from "@/models/tasks";
import { Auth } from "@/lib/auth";
import { ApiResponse, TaskInput } from "@/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    // Make sure to pass the request object
    const user = await Auth.getSession(request);

    console.log(`GET /api/tasks/${id} - User:`, user ? 'Authenticated' : 'Not authenticated');

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    const task = await TaskModel.findOne({
      _id: id,
      userId: user.id,
    });

    if (!task) {
      return NextResponse.json<ApiResponse>(
        { error: "Task not found" },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse>({ task });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Failed to fetch task" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    // Make sure to pass the request object
    const user = await Auth.getSession(request);

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body: TaskInput = await request.json();
    const { title, description, status } = body;

    await connectDB();

    const task = await TaskModel.findOneAndUpdate(
      {
        _id: id,
        userId: user.id,
      },
      {
        title,
        description,
        status,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true },
    );

    if (!task) {
      return NextResponse.json<ApiResponse>(
        { error: "Task not found" },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse>({
      task,
      message: "Task updated successfully",
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Failed to update task" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    // Make sure to pass the request object
    const user = await Auth.getSession(request);

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    const task = await TaskModel.findOneAndDelete({
      _id: id,
      userId: user.id,
    });

    if (!task) {
      return NextResponse.json<ApiResponse>(
        { error: "Task not found" },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResponse>({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Failed to delete task" },
      { status: 500 },
    );
  }
}