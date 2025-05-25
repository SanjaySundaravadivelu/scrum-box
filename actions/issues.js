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

/** 🔹 Get Issues for Sprint */
export async function getIssuesForSprint(sprintId) {
  const { userId } = auth();
  const orgId = cookies().get("orgId")?.value;

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // ✅ Validate user plan
  await validateUserPlan(userId);

  const issues = await db.issue.findMany({
    where: { sprintId: sprintId },
    orderBy: [{ status: "asc" }, { order: "asc" }],
    include: {
      assignee: true,
      reporter: true,
    },
  });

  return issues;
}
export async function getAllIssues(projectId) {
  const { userId } = auth();
  const orgId = cookies().get("orgId")?.value;

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // ✅ Validate user plan
  await validateUserPlan(userId);

  const issues = await db.issue.findMany({
    where: { projectId: projectId },
    orderBy: [{ status: "asc" }, { order: "asc" }],
    include: {
      assignee: true,
      reporter: true,
    },
  });

  return issues;
}

/** 🔹 Create a new issue */
export async function createIssue(projectId, data) {
  const { userId } = auth();
  const orgId = cookies().get("orgId")?.value;

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // ✅ Validate user plan
  await validateUserPlan(userId);

  let user = await db.user.findUnique({ where: { clerkUserId: userId } });

  const lastIssue = await db.issue.findFirst({
    where: { projectId, status: data.status },
    orderBy: { order: "desc" },
  });

  const newOrder = lastIssue ? lastIssue.order + 1 : 0;

  const issue = await db.issue.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      projectId: projectId,
      sprintId: data.sprintId,
      reporterId: user.id,
      assigneeId: data.assigneeId || null, // Add this line
      order: newOrder,
      points: data.points,
      epic: data.epic,
    },
    include: {
      assignee: true,
      reporter: true,
    },
  });

  return issue;
}

/** 🔹 Update Issue Order */
export async function updateIssueOrder(updatedIssues) {
  const { userId } = auth();
  const orgId = cookies().get("orgId")?.value;

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // ✅ Validate user plan
  await validateUserPlan(userId);

  // Start a transaction
  await db.$transaction(async (prisma) => {
    // Update each issue
    for (const issue of updatedIssues) {
      await prisma.issue.update({
        where: { id: issue.id },
        data: {
          status: issue.status,
          order: issue.order,
        },
      });
    }
  });

  return { success: true };
}

/** 🔹 Delete an Issue */
export async function deleteIssue(issueId) {
  const { userId } = auth();
  const orgId = cookies().get("orgId")?.value;

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // ✅ Validate user plan
  await validateUserPlan(userId);

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const issue = await db.issue.findUnique({
    where: { id: issueId },
    include: { project: true },
  });

  if (!issue) {
    throw new Error("Issue not found");
  }

  if (
    issue.reporterId !== user.id &&
    !issue.project.adminIds.includes(user.id)
  ) {
    throw new Error("You don't have permission to delete this issue");
  }

  await db.issue.delete({ where: { id: issueId } });

  return { success: true };
}

/** 🔹 Update an Issue */
export async function updateIssue(issueId, data) {
  const { userId } = auth();
  const orgId = cookies().get("orgId")?.value;

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // ✅ Validate user plan
  await validateUserPlan(userId);

  try {
    if (!data.points) {
      return;
    }
    const issue = await db.issue.findUnique({
      where: { id: issueId },
      include: { project: true },
    });

    if (!issue) {
      throw new Error("Issue not found");
    }

    if (issue.project.organizationId !== orgId) {
      throw new Error("Unauthorized");
    }

    const updatedIssue = await db.issue.update({
      where: { id: issueId },
      data: {
        status: data.status,
        priority: data.priority,
        points: parseInt(data.points, 10),
      },
      include: {
        assignee: true,
        reporter: true,
      },
    });

    return updatedIssue;
  } catch (error) {
    throw new Error("Error updating issue: " + error.message);
  }
}
