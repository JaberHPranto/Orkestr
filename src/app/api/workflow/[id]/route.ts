import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const session = await getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const workflow = await prisma.workflow.findUnique({
      where: { id, userId: user.id },
    });

    if (!workflow) {
      return new Response("Workflow not found", { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: workflow,
      message: "Workflow retrieved successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while retrieving the workflow",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
