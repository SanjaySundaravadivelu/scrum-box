"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";

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

/** 🔹 Get Epics for a Project */
export async function getEpicsForProject(projectId) {
  const { userId } = auth();
  const orgId = cookies().get("orgId")?.value;

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // ✅ Validate user plan
  await validateUserPlan(userId);

  const epics = await db.epic.findUnique({
    where: { projectId },
  });

  return epics ? epics.labels : [];
}

export async function createEpic(projectId, item) {
  try {
    // First, fetch the existing epic entry
    const existingEpics = await db.epic.findUnique({
      where: { projectId },
    });

    if (existingEpics) {
      // If the project already has an epics list, update it
      await db.epic.update({
        where: { projectId },
        data: {
          labels: {
            push: item,
          },
        },
      });
    } else {
      // If not, create a new entry with the list
      await db.epic.create({
        data: {
          projectId,
          labels: [item],
        },
      });
    }
  } catch (error) {
    console.error("Error creating epic:", error.message);
    throw new Error(error.message);
  }
}

/** 🔹 Update an Epic */
export async function updateEpic(projectId, oldName, newName) {
  const { userId } = auth();
  const orgId = cookies().get("orgId")?.value;

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  await validateUserPlan(userId);

  const epicsData = await db.epic.findUnique({
    where: { projectId },
  });

  if (!epicsData || !epicsData.lables.includes(oldName)) {
    throw new Error("Epic not found");
  }

  const updatedList = epicsData.lables.map((epic) =>
    epic === oldName ? newName : epic
  );

  await db.epic.update({
    where: { projectId },
    data: { labels: updatedList },
  });

  return { success: true };
}

/** 🔹 Delete an Epic */
export async function deleteEpic(projectId, epicName) {
  const { userId } = auth();
  const orgId = cookies().get("orgId")?.value;

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  await validateUserPlan(userId);

  const epicsData = await db.epic.findUnique({
    where: { projectId },
  });

  if (!epicsData || !epicsData.lables.includes(epicName)) {
    throw new Error("Epic not found");
  }

  const updatedList = epicsData.lables.filter((epic) => epic !== epicName);

  await db.epic.update({
    where: { projectId },
    data: { labels: updatedList },
  });

  return { success: true };
}

/* 
  const handleUpdate = async () => {
    try {
      await updateEpic(projectId, editEpic, editValue);
      setEpics((prev) =>
        prev.map((epic) => (epic === editEpic ? editValue : epic))
      );
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  const handleDelete = async (epic) => {
    try {
      await deleteEpic(projectId, epic);
      setEpics((prev) => prev.filter((e) => e !== epic));
    } catch (error) {
      console.error(error.message);
    }
  };
  */
