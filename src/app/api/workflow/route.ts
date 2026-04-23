import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const workflows = await prisma.workflow.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
      },
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: workflows,
      message: "Workflows retrieved successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while retrieving workflows",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json();

    const session = await getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new Response("Name is required", { status: 400 });
    }

    const workflow = await prisma.workflow.create({
      data: {
        name,
        description: description || "",
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: workflow,
      message: "Workflow created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while creating the workflow",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
