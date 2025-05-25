"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/** 🔍 Helper function to validate user plan */
async function validateUserPlan(userId) {
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  // 🕒 Check if the plan is expired
  const currentDate = new Date();
  const planEndDate = new Date(user.plan_end);

  if (currentDate > planEndDate) {
    console.log("❌ User plan expired, redirecting to /pricing");
    redirect("/pricing");
  }

  return user;
}

/** 🔹 Create Sprint */
export async function createSprint(projectId, data) {
  const { userId } = auth();
  const orgId = cookies().get("orgId")?.value;

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // ✅ Validate user plan
  await validateUserPlan(userId);

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { sprints: { orderBy: { createdAt: "desc" } } },
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error("Project not found");
  }

  const sprint = await db.sprint.create({
    data: {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      status: "PLANNED",
      projectId: projectId,
    },
  });

  return sprint;
}

/** 🔹 Update Sprint Status */
export async function updateSprintStatus(sprintId, newStatus) {
  const { userId } = auth();
  const orgId = cookies().get("orgId")?.value;
  const orgRole = cookies().get("orgRole")?.value;

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // ✅ Validate user plan
  await validateUserPlan(userId);

  try {
    const sprint = await db.sprint.findUnique({
      where: { id: sprintId },
      include: { project: true },
    });

    if (!sprint) {
      throw new Error("Sprint not found");
    }

    if (sprint.project.organizationId !== orgId) {
      throw new Error("Unauthorized");
    }

    if (orgRole !== "org:admin") {
      throw new Error("Only Admin can make this change");
    }

    const now = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);

    if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
      throw new Error("Cannot start sprint outside of its date range");
    }

    if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
      throw new Error("Can only complete an active sprint");
    }

    const updatedSprint = await db.sprint.update({
      where: { id: sprintId },
      data: { status: newStatus },
    });

    return { success: true, sprint: updatedSprint };
  } catch (error) {
    throw new Error(error.message);
  }
}
