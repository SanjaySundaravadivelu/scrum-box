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

  const currentDate = new Date();
  const planEndDate = new Date(user.plan_end);

  if (currentDate > planEndDate) {
    console.log("❌ User plan expired, redirecting to /pricing");
    redirect("/pricing");
  }

  return user;
}

/** 🔹 Get Blocker by IssueId */
export async function getBlocker() {
  const { userId } = auth();
  const orgId = cookies().get("orgId")?.value;

  if (!userId || !orgId) throw new Error("Unauthorized");

  await validateUserPlan(userId);

  const blocker = await db.blocker.findMany();

  return blocker;
}

/** 🔹 Create Blocker */
export async function createBlocker(issueId, data) {
  const { userId } = auth();
  const orgId = cookies().get("orgId")?.value;

  if (!userId || !orgId) throw new Error("Unauthorized");

  await validateUserPlan(userId);

  const blocker = await db.blocker.create({
    data: {
      id: data.id, // same as Issue.id
      reporter: data.reporter,
      responsible: data.responsible || [],
      reason: data.reason,
      history: data.history || [],
    },
  });

  return blocker;
}

/** 🔹 Update Blocker */
export async function updateBlocker(issueId, data) {
  const { userId } = auth();
  const orgId = cookies().get("orgId")?.value;

  if (!userId || !orgId) throw new Error("Unauthorized");

  await validateUserPlan(userId);

  const blocker = await db.blocker.update({
    where: { id: issueId },
    data: {
      reporter: data.reporter,
      responsible: data.responsible,
      reason: data.reason,
      isResolved: data.isResolved,
      resolvedAt: data.isResolved ? new Date() : null,
      history: data.history,
    },
  });

  return blocker;
}

/** 🔹 Delete Blocker */
export async function deleteBlocker(issueId) {
  const { userId } = auth();
  const orgId = cookies().get("orgId")?.value;

  if (!userId || !orgId) throw new Error("Unauthorized");

  await validateUserPlan(userId);

  await db.blocker.delete({
    where: { id: issueId },
  });

  return { success: true };
}
