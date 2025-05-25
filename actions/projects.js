"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
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

/** 🔹 Create Project */
export async function createProject(data) {
  const { userId } = auth();
  const orgId = cookies().get("orgId")?.value;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!orgId) {
    throw new Error("No Organization Selected");
  }

  // ✅ Validate user plan
  await validateUserPlan(userId);

  // Check if the user is an admin of the organization
  const { data: membershipList } =
    await clerkClient().organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const userMembership = membershipList.find(
    (membership) => membership.publicUserData.userId === userId
  );

  if (!userMembership || userMembership.role !== "org:admin") {
    throw new Error("Only organization admins can create projects");
  }

  try {
    const project = await db.project.create({
      data: {
        name: data.name,
        key: data.key,
        description: data.description,
        organizationId: orgId,
      },
    });

    return project;
  } catch (error) {
    throw new Error("Error creating project: " + error.message);
  }
}

/** 🔹 Get Project */
export async function getProject(projectId) {
  const { userId } = auth();
  const orgId = cookies().get("orgId")?.value;

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // ✅ Validate user plan
  await validateUserPlan(userId);

  // Find user to verify existence
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get project with sprints and organization
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      sprints: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  // Verify project belongs to the organization
  if (project.organizationId !== orgId) {
    return null;
  }

  return project;
}

/** 🔹 Delete Project */
export async function deleteProject(projectId) {
  const { userId } = auth();
  const orgId = cookies().get("orgId")?.value;
  const orgRole = cookies().get("orgRole")?.value;

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // ✅ Validate user plan
  await validateUserPlan(userId);

  if (orgRole !== "org:admin") {
    throw new Error("Only organization admins can delete projects");
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error(
      "Project not found or you don't have permission to delete it"
    );
  }

  await db.project.delete({
    where: { id: projectId },
  });

  return { success: true };
}
