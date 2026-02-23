// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import TaskModel from "@/models/tasks"; // Make sure this path is correct
// import { Auth } from "@/lib/auth";
// import { ApiResponse, TaskInput } from "@/types";


// export async function POST(request: NextRequest) {
//   try {
//     console.log("========== TASK CREATION START ==========");
    
//     const user = await Auth.getSession(request);

//     if (!user) {
//       return NextResponse.json<ApiResponse>(
//         { error: "Unauthorized" },
//         { status: 401 },
//       );
//     }

//     const body: TaskInput = await request.json();
//     const { title, description, status } = body;

//     if (!title) {
//       return NextResponse.json<ApiResponse>(
//         { error: "Title is required" },
//         { status: 400 },
//       );
//     }

//     await connectDB();

//     // Create task - NO pre-save hook needed anymore
//     const task = await TaskModel.create({
//       title,
//       description: description || "",
//       status: status || "pending",
//       userId: user.id,
//     });

//     console.log("Task created successfully:", task._id);
    
//     return NextResponse.json<ApiResponse>(
//       {
//         task,
//         message: "Task created successfully",
//       },
//       { status: 201 },
//     );

//   } catch (error: any) {
//     console.error("Error creating task:", error);
//     return NextResponse.json<ApiResponse>(
//       { error: error?.message || "Failed to create task" },
//       { status: 500 },
//     );
//   }
// }

// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import TaskModel from "@/models/tasks";
// import { Auth } from "@/lib/auth";
// import { ApiResponse, TaskInput } from "@/types";

// // ✅ GET METHOD - Fetch all tasks
// export async function GET(request: NextRequest) {
//   try {
//     console.log("========== FETCHING TASKS ==========");
    
//     // Check authentication
//     const user = await Auth.getSession(request);

//     if (!user) {
//       console.log("GET /api/tasks - Unauthorized: No user session");
//       return NextResponse.json<ApiResponse>(
//         { error: "Unauthorized" },
//         { status: 401 },
//       );
//     }

//     console.log("GET /api/tasks - User authenticated:", user.id);

//     // Connect to database
//     await connectDB();

//     // Fetch tasks for this user
//     const tasks = await TaskModel.find({ userId: user.id })
//       .sort({ createdAt: -1 })
//       .lean();

//     console.log(`GET /api/tasks - Found ${tasks.length} tasks`);

//     // Transform tasks to include id instead of _id
//     const transformedTasks = tasks.map(task => ({
//       id: task._id.toString(),
//       title: task.title,
//       description: task.description,
//       status: task.status,
//       userId: task.userId.toString(),
//       createdAt: task.createdAt,
//       updatedAt: task.updatedAt,
//     }));

//     return NextResponse.json<ApiResponse>({ 
//       tasks: transformedTasks 
//     });

//   } catch (error: any) {
//     console.error("GET /api/tasks - Error:", error);
//     return NextResponse.json<ApiResponse>(
//       { error: error?.message || "Failed to fetch tasks" },
//       { status: 500 },
//     );
//   }
// }

// // ✅ POST METHOD - Create a new task
// export async function POST(request: NextRequest) {
//   try {
//     console.log("========== TASK CREATION START ==========");
    
//     const user = await Auth.getSession(request);

//     if (!user) {
//       return NextResponse.json<ApiResponse>(
//         { error: "Unauthorized" },
//         { status: 401 },
//       );
//     }

//     const body: TaskInput = await request.json();
//     const { title, description, status } = body;

//     if (!title) {
//       return NextResponse.json<ApiResponse>(
//         { error: "Title is required" },
//         { status: 400 },
//       );
//     }

//     await connectDB();

//     const task = await TaskModel.create({
//       title,
//       description: description || "",
//       status: status || "pending",
//       userId: user.id,
//     });

//     console.log("Task created successfully:", task._id);
    
//     // Transform the task to include id
//     const transformedTask = {
//       id: task._id.toString(),
//       title: task.title,
//       description: task.description,
//       status: task.status,
//       userId: task.userId.toString(),
//       createdAt: task.createdAt,
//       updatedAt: task.updatedAt,
//     };
    
//     return NextResponse.json<ApiResponse>(
//       {
//         task: transformedTask,
//         message: "Task created successfully",
//       },
//       { status: 201 },
//     );

//   } catch (error: any) {
//     console.error("Error creating task:", error);
//     return NextResponse.json<ApiResponse>(
//       { error: error?.message || "Failed to create task" },
//       { status: 500 },
//     );
//   }
// }

// // Handle unsupported methods (optional)
// export async function PUT() {
//   return NextResponse.json<ApiResponse>(
//     { error: "Method not allowed" },
//     { status: 405 },
//   );
// }

// export async function DELETE() {
//   return NextResponse.json<ApiResponse>(
//     { error: "Method not allowed" },
//     { status: 405 },
//   );
// }


import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TaskModel from "@/models/tasks";
import { Auth } from "@/lib/auth";
import { ApiResponse, TaskInput } from "@/types";

// GET METHOD - Fetch all tasks
export async function GET(request: NextRequest) {
  try {
    console.log("========== FETCHING TASKS ==========");
    
    const user = await Auth.getSession(request);

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    const tasks = await TaskModel.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Found ${tasks.length} tasks`);

    // Transform tasks to include id instead of _id
    const transformedTasks = tasks.map(task => ({
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      status: task.status,
      userId: task.userId.toString(),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));

    return NextResponse.json<ApiResponse>({ 
      tasks: transformedTasks 
    });

  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json<ApiResponse>(
      { error: error?.message || "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}

// POST METHOD - Create a new task
export async function POST(request: NextRequest) {
  try {
    console.log("========== TASK CREATION START ==========");
    
    const user = await Auth.getSession(request);

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body: TaskInput = await request.json();
    const { title, description, status } = body;

    if (!title) {
      return NextResponse.json<ApiResponse>(
        { error: "Title is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const task = await TaskModel.create({
      title,
      description: description || "",
      status: status || "pending",
      userId: user.id,
    });

    console.log("Task created successfully:", task._id);
    
    const transformedTask = {
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      status: task.status,
      userId: task.userId.toString(),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
    
    return NextResponse.json<ApiResponse>(
      {
        task: transformedTask,
        message: "Task created successfully",
      },
      { status: 201 },
    );

  } catch (error: any) {
    console.error("Error creating task:", error);
    return NextResponse.json<ApiResponse>(
      { error: error?.message || "Failed to create task" },
      { status: 500 },
    );
  }
}