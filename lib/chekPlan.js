import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const checkPlan = async () => {
  try {
    const user = await currentUser();
    if (!user) return null;

    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });
    // If user is found, directly return it, otherwise return null
    return loggedInUser || null;
  } catch (error) {
    console.error("Error fetching user plan details:", error);
    return null;
  }
};
