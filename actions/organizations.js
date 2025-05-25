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

/** 🔹 Get Organization with plan validation */
export async function getOrganization(slug) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  // ✅ Validate user plan
  await validateUserPlan(userId);

  // 🏢 Get the organization details
  const organization = await clerkClient().organizations.getOrganization({
    slug,
  });

  if (!organization) return null;

  // 🔎 Check if the user is part of the organization
  const { data: membership } =
    await clerkClient().organizations.getOrganizationMembershipList({
      organizationId: organization.id,
    });

  const userMembership = membership.find(
    (member) => member.publicUserData.userId === userId
  );

  if (!userMembership) return null;

  return organization;
}

/** 🔹 Get Projects with plan validation */
export async function getProjects() {
  const orgId = cookies().get("orgId")?.value;
  const { userId } = auth();

  if (!userId) throw new Error("Unauthorized");

  // ✅ Validate user plan
  await validateUserPlan(userId);

  const projects = await db.project.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });

  return projects;
}

/** 🔹 Get User Issues with plan validation */
export async function getUserIssues(userId) {
  const orgId = cookies().get("orgId")?.value;

  if (!userId || !orgId) throw new Error("No user id or organization id found");

  // ✅ Validate user plan
  await validateUserPlan(userId);

  const issues = await db.issue.findMany({
    where: {
      OR: [{ assigneeId: userId }, { reporterId: userId }],
      project: {
        organizationId: orgId,
      },
    },
    include: {
      project: true,
      assignee: true,
      reporter: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return issues;
}

/** 🔹 Get Organization Users with plan validation */
export async function getOrganizationUsers() {
  const orgId = cookies().get("orgId")?.value;
  const { userId } = auth();

  if (!userId) throw new Error("Unauthorized");

  // ✅ Validate user plan
  await validateUserPlan(userId);

  const organizationMemberships =
    await clerkClient().organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const userIds = organizationMemberships.data.map(
    (membership) => membership.publicUserData.userId
  );

  const users = await db.user.findMany({
    where: {
      clerkUserId: {
        in: userIds,
      },
    },
  });

  return users;
}
